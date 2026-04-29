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
