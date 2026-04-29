import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  devicesApi,
  useInstallImageMutation,
  useReloadDeviceMutation,
} from '../api';
import type { InstallTaskStatus } from '../types';
import {
  loadInstallState,
  saveInstallState,
  clearInstallState,
} from './installStatePersist';
import { clearPendingInstall } from './imageBindingPersist';
import { errMessage } from '../utils/errMessage';
import { useInstallTaskPolling } from './useInstallTaskPolling';
import {
  STAGE_LABELS,
  isActiveStage,
  isTerminalStage,
  taskKindForStage,
  nextActionOnCompleted,
  stageForReload,
  classifyTaskStatus,
  type Stage,
} from './installStateMachine';

const STAGE_MARKER_PREFIX = '──';
const stageMarker = (stage: Stage) => `${STAGE_MARKER_PREFIX} ${STAGE_LABELS[stage]} ${STAGE_MARKER_PREFIX}`;

export const useInstallPolling = (hostname: string) => {
  const dispatch = useDispatch();
  const [installImage] = useInstallImageMutation();
  const [reloadDevice] = useReloadDeviceMutation();

  const restoreFreshState = (h: string) => {
    const state = loadInstallState(h);
    if (!state) return null;
    if (isTerminalStage(state.stage)) {
      clearInstallState(h);
      return null;
    }
    return state;
  };

  const initialState = restoreFreshState(hostname);
  const [stage, setStage] = useState<Stage>(initialState?.stage ?? 'idle');
  const [logs, setLogs] = useState<string[]>(initialState?.logs ?? []);
  const [taskId, setTaskId] = useState<string | null>(initialState?.taskId ?? null);

  const [prevHostname, setPrevHostname] = useState(hostname);
  if (prevHostname !== hostname) {
    setPrevHostname(hostname);
    const restored = restoreFreshState(hostname);
    setStage(restored?.stage ?? 'idle');
    setLogs(restored?.logs ?? []);
    setTaskId(restored?.taskId ?? null);
  }

  useEffect(() => {
    if (stage === 'idle' && logs.length === 0 && !taskId) {
      clearInstallState(hostname);
      return;
    }
    if (isTerminalStage(stage)) {
      clearInstallState(hostname);
      return;
    }
    saveInstallState(hostname, { taskId, stage, logs, finishedAt: null });
  }, [hostname, taskId, stage, logs]);

  const addLog = useCallback((line: string) => {
    setLogs((prev) => [...prev, line]);
  }, []);

  const replaceCurrentStageLog = useCallback((rawLog: string) => {
    const lines = rawLog.split('\n').filter((l) => l.length > 0);
    if (lines.length === 0) return;
    setLogs((prev) => {
      const markerIdx = prev.findLastIndex((l) => l.startsWith(STAGE_MARKER_PREFIX));
      if (markerIdx >= 0) {
        return [...prev.slice(0, markerIdx + 1), ...lines];
      }
      return [...prev, ...lines];
    });
  }, []);

  const invalidateImageAndDevice = useCallback(() => {
    dispatch(devicesApi.util.invalidateTags([
      { type: 'Images', id: hostname },
      { type: 'Device', id: hostname },
    ]));
  }, [dispatch, hostname]);

  const extractTaskId = (raw: unknown): string | null => {
    const r = raw as { task_id?: string; id?: string };
    return r.task_id ?? r.id ?? null;
  };

  const startReload = useCallback(async (reloadNumber: 1 | 2) => {
    const nextStage = stageForReload(reloadNumber);
    setStage(nextStage);
    addLog(stageMarker(nextStage));

    try {
      const raw = await reloadDevice({
        hostname, ssh_username: 'root', retries: 30, retry_delay: 10,
      }).unwrap();
      const id = extractTaskId(raw);
      if (!id) {
        setStage('error');
        addLog(`Ошибка: в ответе перезагрузки нет task_id/id. Ответ: ${JSON.stringify(raw)}`);
        return;
      }
      setTaskId(id);
      addLog(`task_id: ${id}`);
    } catch (e) {
      setStage('error');
      addLog(`Ошибка запуска перезагрузки ${reloadNumber}: ${errMessage(e)}`);
    }
  }, [hostname, reloadDevice, addLog]);

  const finishSuccessfully = useCallback(() => {
    setStage('done');
    addLog('══ Установка полностью завершена ══');
    clearPendingInstall(hostname);
    invalidateImageAndDevice();
  }, [hostname, addLog, invalidateImageAndDevice]);

  const handleStatus = useCallback((status: InstallTaskStatus) => {
    if (status.log && status.log.trim().length > 0) {
      replaceCurrentStageLog(status.log);
    }
    const outcome = classifyTaskStatus(status.status);
    if (!outcome) return;

    setTaskId(null);
    if (outcome.type === 'failed') {
      setStage('error');
      addLog(`Этап завершился с ошибкой: ${outcome.reason}`);
      return;
    }

    addLog(`Этап завершён успешно (${stage})`);
    const action = nextActionOnCompleted(stage);
    if (action.type === 'start_reload') {
      if (stage === 'installing') invalidateImageAndDevice();
      void startReload(action.reloadNumber);
    } else if (action.type === 'finish') {
      finishSuccessfully();
    }
  }, [stage, addLog, replaceCurrentStageLog, startReload, finishSuccessfully, invalidateImageAndDevice]);

  const handlePollError = useCallback((message: string) => {
    addLog(`[polling error] ${message}`);
  }, [addLog]);

  const taskKind = taskKindForStage(stage);
  useInstallTaskPolling({
    taskId: taskKind && isActiveStage(stage) ? taskId : null,
    kind: taskKind ?? 'install', 
    onStatus: handleStatus,
    onError: handlePollError,
  });

  const startInstall = async () => {
    clearInstallState(hostname);
    setLogs([]);
    setStage('installing');
    addLog(stageMarker('installing'));

    try {
      const raw = await installImage(hostname).unwrap();
      const id = extractTaskId(raw);
      if (!id) {
        setStage('error');
        addLog(`Ошибка: в ответе нет task_id/id. Ответ: ${JSON.stringify(raw)}`);
        return;
      }
      setTaskId(id);
      addLog(`task_id: ${id}`);
    } catch (e) {
      setStage('error');
      addLog(`Ошибка запуска установки: ${errMessage(e)}`);
    }
  };

  const reset = useCallback(() => {
    setTaskId(null);
    setStage('idle');
    setLogs([]);
    clearInstallState(hostname);
  }, [hostname]);

  return {
    logs,
    stage,
    stageLabel: STAGE_LABELS[stage],
    isActive: isActiveStage(stage),
    startInstall,
    reset,
  };
};
