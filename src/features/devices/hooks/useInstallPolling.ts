import { useState, useEffect, useRef } from 'react';
import {
  useInstallImageMutation,
  useLazyGetInstallStatusQuery,
} from '../api';

export const useInstallPolling = (hostname: string) => {
  const [installImage, { isLoading: isInstalling }] = useInstallImageMutation();
  const [triggerStatus] = useLazyGetInstallStatusQuery();
  const [taskId, setTaskId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!taskId) return;

    pollingRef.current = setInterval(async () => {
      try {
        const status = await triggerStatus(taskId).unwrap();
        if (status.log) {
          setLogs(status.log.split('\n'));
        }
        if (status.status === 'completed' || status.status === 'failed' || status.status === 'cancelled') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setTaskId(null);
        }
      } catch {
        // ignore polling errors
      }
    }, 5000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [taskId, triggerStatus]);

  const startInstall = async () => {
    setLogs([]);
    try {
      const result = await installImage(hostname).unwrap();
      setTaskId(result.task_id);
      setLogs(['Задача установки создана...']);
    } catch {
      setLogs(['Ошибка при запуске установки']);
    }
  };

  return { logs, isInstalling, isPolling: !!taskId, startInstall };
};
