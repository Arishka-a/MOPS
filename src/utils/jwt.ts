export interface JwtPayload {
  sub?: string;
  exp?: number;
  [key: string]: unknown;
}

export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payloadB64 = parts[1];
    const base64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

    const binaryString = atob(padded);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const json = new TextDecoder('utf-8').decode(bytes);

    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
};

export const isJwtExpired = (token: string): boolean => {
  const payload = decodeJwt(token);
  if (!payload || typeof payload.exp !== 'number') return false;
  return payload.exp * 1000 <= Date.now();
};

export const getUsernameFromJwt = (token: string): string | null => {
  const payload = decodeJwt(token);
  if (!payload || typeof payload.sub !== 'string') return null;
  return payload.sub;
};
