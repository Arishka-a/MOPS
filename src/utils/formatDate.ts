const parseServerDate = (iso: string): Date => {
  const hasTimezone = /Z$|[+-]\d{2}:?\d{2}$/.test(iso);
  return new Date(hasTimezone ? iso : iso + 'Z');
};

export const formatDate = (iso: string) => {
  try {
    return parseServerDate(iso).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

export const formatDateTime = (iso: string) => {
  try {
    return parseServerDate(iso).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};