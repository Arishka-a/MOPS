import { useState, useCallback } from 'react';
import { useRunSSHCommandMutation } from '../api';
import type { SSHTaskResult } from '../types';
import { applyStatusToEntry, errMessage, makeEntryId } from './sshTaskStatus';
import { useSSHTaskPolling } from './useSSHTaskPolling';

export type SSHEntryStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'error';

export interface SSHHistoryEntry {
  id: string;
  taskId: string | null;
  command: string;
  status: SSHEntryStatus;
  result: SSHTaskResult | null;
  error: string | null;
}

export interface SSHCommandParams {
  retries: number;
  retry_delay: number;
  cmd_timeout: number;
  port: number;
}

export const useSSHQueue = (hostname: string) => {
  const [runSSHCommand] = useRunSSHCommandMutation();

  const [history, setHistory] = useState<SSHHistoryEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Сброс истории при смене устройства, без useEffect.
  const [prevHostname, setPrevHostname] = useState(hostname);
  if (prevHostname !== hostname) {
    setPrevHostname(hostname);
    setHistory([]);
    setActiveId(null);
  }

  const updateEntry = useCallback((id: string, patch: Partial<SSHHistoryEntry>) => {
    setHistory((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    );
  }, []);

  const activeEntry = activeId ? history.find((e) => e.id === activeId) ?? null : null;
  const activeTaskId =
    activeEntry && (activeEntry.status === 'pending' || activeEntry.status === 'running')
      ? activeEntry.taskId
      : null;

  useSSHTaskPolling({
    taskId: activeTaskId,
    onStatus: (status) => {
      if (!activeId) return;
      const { patch, terminal } = applyStatusToEntry(status);
      if (Object.keys(patch).length > 0) updateEntry(activeId, patch);
      if (terminal) setActiveId(null);
    },
    onError: (message) => {
      if (!activeId) return;
      updateEntry(activeId, { status: 'error', error: message });
      setActiveId(null);
    },
  });

  const execute = useCallback(
    async (command: string, params: SSHCommandParams) => {
      const trimmed = command.trim();
      if (!trimmed || activeId) return;

      const entryId = makeEntryId();
      setHistory((prev) => [
        ...prev,
        {
          id: entryId,
          taskId: null,
          command: trimmed,
          status: 'pending',
          result: null,
          error: null,
        },
      ]);
      setActiveId(entryId);

      try {
        const raw = await runSSHCommand({
          hostname,
          cmd: trimmed,
          username: 'root',
          retries: params.retries,
          retry_delay: params.retry_delay,
          cmd_timeout: params.cmd_timeout,
          port: params.port,
        }).unwrap();
        const response = raw as { task_id?: string; id?: string };
        const id = response.task_id ?? response.id;

        if (!id) {
          updateEntry(entryId, { status: 'error', error: 'Сервер не вернул task_id' });
          setActiveId(null);
          return;
        }
        updateEntry(entryId, { taskId: id, status: 'running' });
      } catch (e) {
        updateEntry(entryId, { status: 'error', error: errMessage(e) });
        setActiveId(null);
      }
    },
    [hostname, activeId, runSSHCommand, updateEntry],
  );

  const clear = useCallback(() => {
    if (activeId) return;
    setHistory([]);
  }, [activeId]);

  return {
    history,
    isExecuting: activeId !== null,
    execute,
    clear,
  };
};
