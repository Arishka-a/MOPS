import { useState, useEffect, useRef, useCallback } from 'react';
import {
  useInstallImageMutation,
  useLazyGetInstallStatusQuery,
  useReloadDeviceMutation,
  useLazyGetReloadStatusQuery,
} from '../api';

type Stage = 'idle' | 'installing' | 'reload_1' | 'reload_2' | 'done' | 'error';

const STAGE_LABELS: Record<Stage, string> = {
  idle: '',
  installing: 'Установка образа',
  reload_1: 'Перезагрузка 1/2',
  reload_2: 'Перезагрузка 2/2',
  done: 'Готово',
  error: 'Ошибка',
};

export const useInstallPolling = (hostname: string) => {
  const [installImage] = useInstallImageMutation();
  const [triggerInstallStatus] = useLazyGetInstallStatusQuery();
  const [reloadDevice] = useReloadDeviceMutation();
  const [triggerReloadStatus] = useLazyGetReloadStatusQuery();

  const [stage, setStage] = useState<Stage>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [taskId, setTaskId] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addLog = useCallback((line: string) => {
    setLogs((prev) => [...prev, line]);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startReload = useCallback(async (reloadNumber: 1 | 2) => {
    const nextStage: Stage = reloadNumber === 1 ? 'reload_1' : 'reload_2';
    setStage(nextStage);
    addLog(`── ${STAGE_LABELS[nextStage]} ──`);

    try {
      const result = await reloadDevice({
        hostname,
        ssh_username: 'root',
        retries: 3,
        retry_delay: 5,
      }).unwrap();

      setTaskId(result.task_id);
      addLog(`Задача перезагрузки создана: ${result.task_id}`);
    } catch {
      setStage('error');
      addLog(`Ошибка при запуске перезагрузки ${reloadNumber}`);
    }
  }, [hostname, reloadDevice, addLog]);

  useEffect(() => {
    if (!taskId || stage === 'idle' || stage === 'done' || stage === 'error') return;

    const isInstallStage = stage === 'installing';
    const triggerStatus = isInstallStage ? triggerInstallStatus : triggerReloadStatus;

    pollingRef.current = setInterval(async () => {
      try {
        const status = await triggerStatus(taskId).unwrap();

        if (status.log) {
          const logLines = status.log.split('\n').filter(Boolean);
          if (logLines.length > 0) {
            setLogs((prev) => {
              const markerIdx = prev.findLastIndex((l) => l.startsWith('──') || l.startsWith('Задача'));
              if (markerIdx >= 0) {
                return [...prev.slice(0, markerIdx + 1), ...logLines];
              }
              return [...prev, ...logLines];
            });
          }
        }

        if (status.status === 'completed') {
          stopPolling();
          setTaskId(null);
          addLog('Этап завершён успешно');

          if (stage === 'installing') {
            startReload(1);
          } else if (stage === 'reload_1') {
            startReload(2);
          } else if (stage === 'reload_2') {
            setStage('done');
            addLog('══ Установка полностью завершена ══');
          }
        } else if (status.status === 'failed' || status.status === 'cancelled') {
          stopPolling();
          setTaskId(null);
          setStage('error');
          addLog(`Этап завершился с ошибкой: ${status.status}`);
        }
      } catch {
        // ignore polling errors
      }
    }, 5000);

    return () => stopPolling();
  }, [taskId, stage, triggerInstallStatus, triggerReloadStatus, stopPolling, addLog, startReload]);

  const startInstall = async () => {
    setLogs([]);
    setStage('installing');
    addLog(`── ${STAGE_LABELS.installing} ──`);

    try {
      const result = await installImage(hostname).unwrap();
      setTaskId(result.task_id);
      addLog(`Задача установки создана: ${result.task_id}`);
    } catch {
      setStage('error');
      addLog('Ошибка при запуске установки');
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
