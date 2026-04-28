export type InstallStage = 'idle' | 'installing' | 'reload_1' | 'reload_2' | 'done' | 'error';

export interface InstallState {
  taskId: string | null;
  stage: InstallStage;
  logs: string[];
  finishedAt: number | null; 
}

const KEEP_FINISHED_MS = 10 * 60 * 1000;

const storageKey = (hostname: string) => `install:${hostname}`;

export const loadInstallState = (hostname: string): InstallState | null => {
  try {
    const raw = localStorage.getItem(storageKey(hostname));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as InstallState;

    if (parsed.finishedAt && Date.now() - parsed.finishedAt > KEEP_FINISHED_MS) {
      localStorage.removeItem(storageKey(hostname));
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const saveInstallState = (hostname: string, state: InstallState): void => {
  try {
    localStorage.setItem(storageKey(hostname), JSON.stringify(state));
  } catch {
    //
  }
};

export const clearInstallState = (hostname: string): void => {
  try {
    localStorage.removeItem(storageKey(hostname));
  } catch {
    //
  }
};
