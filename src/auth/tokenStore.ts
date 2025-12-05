let accessToken: string | null = null;
let refreshToken: string | null = null;

type SessionUser = {
  email: string | null;
  name: string | null;
  role: string | null;
};

export function setTokens(a?: string | null, r?: string | null) {
  if (typeof a === 'string' && a.length > 0) {
    accessToken = a;
    sessionStorage.setItem('access_token', a);
    console.debug('[tokenStore] access_token set', a.slice(0, 12) + '...');
  }
  if (typeof r === 'string' && r.length > 0) {
    refreshToken = r;
    localStorage.setItem('refresh_token', r);
    console.debug('[tokenStore] refresh_token set', r.slice(0, 12) + '...');
  }
}

export function getAccessToken() {
  if (!accessToken) accessToken = sessionStorage.getItem('access_token');
  return accessToken;
}

export function getRefreshToken() {
  if (!refreshToken) refreshToken = localStorage.getItem('refresh_token');
  return refreshToken;
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  sessionStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

function base64UrlDecode(str: string) {
  try {
    const normalized = str.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    return atob(padded);
  } catch (e) {
    console.warn('[tokenStore] Error decoding base64url', e);
    return '';
  }
}

export function getSessionUser(): SessionUser {
  const token = getAccessToken();
  if (!token) return { email: null, name: null, role: null };
  try {
    const [, payload] = token.split('.');
    const json = base64UrlDecode(payload);
    const data = JSON.parse(json || '{}');
    const roleRaw: string | undefined = data.rol ?? data.role;
    const name: string | null = data.nombre ?? data.name ?? null;
    const email: string | null = data.sub ?? data.email ?? null;
    const role = roleRaw ? String(roleRaw).trim().toUpperCase() : null;
    return { email, name, role };
  } catch (e) {
    console.warn('[tokenStore] Error parsing JWT payload', e);
    return { email: null, name: null, role: null };
  }
}

