import { useEffect, useRef } from 'react';
import { useLazyGetSSHStatusQuery } from '../api';
import type { SSHTaskStatus } from '../types';
import { errMessage } from '../utils/errMessage';

const POLL_INTERVAL_MS = 1500;

interface Options {
  taskId: string | null;
  onStatus: (status: SSHTaskStatus) => void;
  onError: (message: string) => void;
}

export const useSSHTaskPolling = ({ taskId, onStatus, onError }: Options) => {
  const [triggerSSHStatus] = useLazyGetSSHStatusQuery();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const onStatusRef = useRef(onStatus);
  const onErrorRef = useRef(onError);
  onStatusRef.current = onStatus;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!taskId) return;

    const tick = async () => {
      try {
        const status = await triggerSSHStatus(taskId).unwrap() as SSHTaskStatus;
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
  }, [taskId, triggerSSHStatus]);
};
