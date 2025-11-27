let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setTokens(a?: string | null, r?: string | null) {
  // Only update storage when valid non-empty strings are provided
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

