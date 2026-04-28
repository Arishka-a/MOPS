import type { SSHTaskStatus } from '../types';
import type { SSHHistoryEntry } from './useSSHQueue';

export const errMessage = (e: unknown): string => {
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

export const makeEntryId = (): string =>
  `ssh-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const applyStatusToEntry = (
  status: SSHTaskStatus,
): { patch: Partial<SSHHistoryEntry>; terminal: boolean } => {
  switch (status.status) {
    case 'completed':
      return {
        patch: { status: 'completed', result: status.result },
        terminal: true,
      };
    case 'failed':
      return {
        patch: {
          status: 'failed',
          result: status.result,
          error: status.traceback ?? 'Задача завершилась с ошибкой',
        },
        terminal: true,
      };
    case 'cancelled':
      return {
        patch: { status: 'cancelled' },
        terminal: true,
      };
    case 'started':
    case 'running':
      return {
        patch: { status: 'running' },
        terminal: false,
      };
    default:
      return { patch: {}, terminal: false };
  }
};
