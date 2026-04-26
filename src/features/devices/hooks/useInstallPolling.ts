import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  devicesApi,
  useInstallImageMutation,
  useLazyGetInstallStatusQuery,
  useReloadDeviceMutation,
  useLazyGetReloadStatusQuery,
} from '../api';
import type { InstallTaskStatus } from '../types';
import {
  loadInstallState,
  saveInstallState,
  clearInstallState,
} from './installStatePersist';

type Stage = 'idle' | 'installing' | 'reload_1' | 'reload_2' | 'done' | 'error';

const STAGE_LABELS: Record<Stage, string> = {
  idle: '',
  installing: 'Установка образа',
  reload_1: 'Перезагрузка 1/2',
  reload_2: 'Перезагрузка 2/2',
  done: 'Готово',
  error: 'Ошибка',
};

const STAGE_MARKER_PREFIX = '──';

const errMessage = (e: unknown): string => {
  if (typeof e === 'object' && e !== null) {
    const anyE = e as { status?: unknown; data?: unknown; error?: unknown; message?: unknown };
    const status = anyE.status !== undefined ? `[${String(anyE.status)}] ` : '';
    if (typeof anyE.data === 'string') return status + anyE.data;
    if (anyE.data && typeof anyE.data === 'object') {
      const detail = (anyE.data as { detail?: unknown }).detail;
      if (typeof detail === 'string') return status + detail;
      try { return status + JSON.stringify(anyE.data); } catch { /* noop */ }
    }
    if (typeof anyE.error === 'string') return status + anyE.error;
    if (typeof anyE.message === 'string') return status + anyE.message;
  }
  return String(e);
};

export const useInstallPolling = (hostname: string) => {
  const dispatch = useDispatch();
  const [installImage] = useInstallImageMutation();
  const [triggerInstallStatus] = useLazyGetInstallStatusQuery();
  const [reloadDevice] = useReloadDeviceMutation();
  const [triggerReloadStatus] = useLazyGetReloadStatusQuery();

  const initialState = loadInstallState(hostname);
  const [stage, setStage] = useState<Stage>(initialState?.stage ?? 'idle');
  const [logs, setLogs] = useState<string[]>(initialState?.logs ?? []);
  const [taskId, setTaskId] = useState<string | null>(initialState?.taskId ?? null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [prevHostname, setPrevHostname] = useState(hostname);
  if (prevHostname !== hostname) {
    setPrevHostname(hostname);
    const restored = loadInstallState(hostname);
    setStage(restored?.stage ?? 'idle');
    setLogs(restored?.logs ?? []);
    setTaskId(restored?.taskId ?? null);
  }

  useEffect(() => {
    if (stage === 'idle' && logs.length === 0 && !taskId) {
      clearInstallState(hostname);
      return;
    }
    const finished = stage === 'done' || stage === 'error';
    saveInstallState(hostname, {
      taskId,
      stage,
      logs,
      finishedAt: finished ? Date.now() : null,
    });
  }, [hostname, taskId, stage, logs]);

  const addLog = useCallback((line: string) => {
    setLogs((prev) => [...prev, line]);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
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

  const startReload = useCallback(async (reloadNumber: 1 | 2) => {
    const nextStage: Stage = reloadNumber === 1 ? 'reload_1' : 'reload_2';
    setStage(nextStage);
    addLog(`${STAGE_MARKER_PREFIX} ${STAGE_LABELS[nextStage]} ${STAGE_MARKER_PREFIX}`);

    try {
      const raw = await reloadDevice({
        hostname,
        ssh_username: 'root',
        retries: 30,
        retry_delay: 10,
      }).unwrap();
      const result = raw as { task_id?: string; id?: string };
      const id = result.task_id ?? result.id;
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

  useEffect(() => {
    if (!taskId || stage === 'idle' || stage === 'done' || stage === 'error') return;

    const isInstallStage = stage === 'installing';
    const triggerStatus = isInstallStage ? triggerInstallStatus : triggerReloadStatus;

    const tick = async () => {
      try {
        const status = await triggerStatus(taskId).unwrap() as InstallTaskStatus;

        if (status.log && status.log.trim().length > 0) {
          replaceCurrentStageLog(status.log);
        }

        if (status.status === 'completed') {
          stopPolling();
          setTaskId(null);
          addLog(`Этап завершён успешно (${stage})`);

          if (stage === 'installing') {
            dispatch(devicesApi.util.invalidateTags([
              { type: 'Images', id: hostname },
              { type: 'Device', id: hostname },
            ]));
            startReload(1);
          } else if (stage === 'reload_1') {
            startReload(2);
          } else if (stage === 'reload_2') {
            setStage('done');
            addLog('══ Установка полностью завершена ══');
            dispatch(devicesApi.util.invalidateTags([
              { type: 'Images', id: hostname },
              { type: 'Device', id: hostname },
            ]));
          }
        } else if (status.status === 'failed' || status.status === 'cancelled') {
          stopPolling();
          setTaskId(null);
          setStage('error');
          addLog(`Этап завершился с ошибкой: ${status.status}`);
        }
      } catch (e) {
        addLog(`[polling error] ${errMessage(e)}`);
      }
    };

    void tick();
    pollingRef.current = setInterval(tick, 5000);

    return () => stopPolling();
  }, [taskId, stage, hostname, dispatch, triggerInstallStatus, triggerReloadStatus, stopPolling, addLog, startReload, replaceCurrentStageLog]);

  const startInstall = async () => {
    clearInstallState(hostname);
    setLogs([]);
    setStage('installing');
    addLog(`${STAGE_MARKER_PREFIX} ${STAGE_LABELS.installing} ${STAGE_MARKER_PREFIX}`);

    try {
      const raw = await installImage(hostname).unwrap();
      const result = raw as { task_id?: string; id?: string };
      const id = result.task_id ?? result.id;
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

  const isActive = stage !== 'idle' && stage !== 'done' && stage !== 'error';

  return {
    logs,
    stage,
    stageLabel: STAGE_LABELS[stage],
    isActive,
    startInstall,
  };
};
