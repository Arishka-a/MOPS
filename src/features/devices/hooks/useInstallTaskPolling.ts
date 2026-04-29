import { useEffect, useRef } from 'react';
import { useLazyGetInstallStatusQuery, useLazyGetReloadStatusQuery } from '../api';
import type { InstallTaskStatus } from '../types';
import { errMessage } from '../utils/errMessage';

const POLL_INTERVAL_MS = 5000;

export type InstallTaskKind = 'install' | 'reload';

interface Options {
  taskId: string | null;
  kind: InstallTaskKind;
  onStatus: (status: InstallTaskStatus) => void;
  onError: (message: string) => void;
}

export const useInstallTaskPolling = ({ taskId, kind, onStatus, onError }: Options) => {
  const [triggerInstallStatus] = useLazyGetInstallStatusQuery();
  const [triggerReloadStatus] = useLazyGetReloadStatusQuery();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const onStatusRef = useRef(onStatus);
  const onErrorRef = useRef(onError);
  onStatusRef.current = onStatus;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!taskId) return;

    const trigger = kind === 'install' ? triggerInstallStatus : triggerReloadStatus;

    const tick = async () => {
      try {
        const status = (await trigger(taskId).unwrap()) as InstallTaskStatus;
        onStatusRef.current(status);
      } catch (e) {
        onErrorRef.current(errMessage(e));
      }
    };

    void tick();
    intervalRef.current = setInterval(tick, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [taskId, kind, triggerInstallStatus, triggerReloadStatus]);
};
