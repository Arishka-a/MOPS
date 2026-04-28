import type { InstallTaskKind } from './useInstallTaskPolling';

export type Stage = 'idle' | 'installing' | 'reload_1' | 'reload_2' | 'done' | 'error';

export const STAGE_LABELS: Record<Stage, string> = {
  idle: '',
  installing: 'Установка образа',
  reload_1: 'Перезагрузка 1/2',
  reload_2: 'Перезагрузка 2/2',
  done: 'Готово',
  error: 'Ошибка',
};

export const isActiveStage = (stage: Stage): boolean =>
  stage !== 'idle' && stage !== 'done' && stage !== 'error';

export const isTerminalStage = (stage: Stage): boolean =>
  stage === 'done' || stage === 'error';

export const taskKindForStage = (stage: Stage): InstallTaskKind | null => {
  if (stage === 'installing') return 'install';
  if (stage === 'reload_1' || stage === 'reload_2') return 'reload';
  return null;
};

export type CompletionAction =
  | { type: 'start_reload'; reloadNumber: 1 | 2 }
  | { type: 'finish' }
  | { type: 'noop' };

export const nextActionOnCompleted = (stage: Stage): CompletionAction => {
  if (stage === 'installing') return { type: 'start_reload', reloadNumber: 1 };
  if (stage === 'reload_1') return { type: 'start_reload', reloadNumber: 2 };
  if (stage === 'reload_2') return { type: 'finish' };
  return { type: 'noop' };
};

export const stageForReload = (reloadNumber: 1 | 2): Stage =>
  reloadNumber === 1 ? 'reload_1' : 'reload_2';

export type TaskOutcome =
  | { type: 'completed' }
  | { type: 'failed'; reason: 'failed' | 'cancelled' };

export const classifyTaskStatus = (status: string): TaskOutcome | null => {
  if (status === 'completed') return { type: 'completed' };
  if (status === 'failed' || status === 'cancelled') {
    return { type: 'failed', reason: status };
  }
  return null;
};
