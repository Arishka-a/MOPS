export interface PendingInstallState {
  imageId: string;
  markedAt: number;
}

const KEEP_PENDING_MS = 7 * 24 * 60 * 60 * 1000; 

const storageKey = (hostname: string) => `image_pending_install:${hostname}`;

export const loadPendingInstall = (hostname: string): PendingInstallState | null => {
  try {
    const raw = localStorage.getItem(storageKey(hostname));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingInstallState;
    if (!parsed.imageId) return null;
    if (parsed.markedAt && Date.now() - parsed.markedAt > KEEP_PENDING_MS) {
      localStorage.removeItem(storageKey(hostname));
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const savePendingInstall = (hostname: string, imageId: string): void => {
  try {
    const state: PendingInstallState = { imageId, markedAt: Date.now() };
    localStorage.setItem(storageKey(hostname), JSON.stringify(state));
  } catch {
    //
  }
};

export const clearPendingInstall = (hostname: string): void => {
  try {
    localStorage.removeItem(storageKey(hostname));
  } catch {
    //
  }
};

export const isPendingInstall = (hostname: string, imageId: string | undefined | null): boolean => {
  if (!imageId) return false;
  const state = loadPendingInstall(hostname);
  return state?.imageId === imageId;
};
