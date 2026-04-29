import type { SSHTaskStatus } from '../types';
import type { SSHHistoryEntry } from './useSSHQueue';

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
