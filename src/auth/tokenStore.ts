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
  }
  if (typeof r === 'string' && r.length > 0) {
    refreshToken = r;
    localStorage.setItem('refresh_token', r);
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

function base64UrlDecode(str: string): string {
  try {
    const normalized = str.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const binaryString = atob(padded);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch (e) {
    return '';
  }
}

function fixUtf8Encoding(text: string): string {
  return text
    .replace(/Ã©/g, 'é')
    .replace(/Ã‰/g, 'É')
    .replace(/Ã¡/g, 'á')
    .replace(/Ã/g, 'Á')
    .replace(/Ã­/g, 'í')
    .replace(/Ã/g, 'Í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ã/g, 'Ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã/g, 'Ú')
    .replace(/Ã±/g, 'ñ')
    .replace(/Ã/g, 'Ñ');
}

export function getSessionUser(): SessionUser {
  const token = getAccessToken();
  if (!token) return { email: null, name: null, role: null };
  
  try {
    const [, payload] = token.split('.');
    if (!payload) return { email: null, name: null, role: null };
    
    const json = base64UrlDecode(payload);
    const data = JSON.parse(json || '{}');
    
    const roleRaw: string | undefined = data.rol ?? data.role;
    const name: string | null = data.nombre ?? data.name ?? null;
    const email: string | null = data.sub ?? data.email ?? null;
    
    let role: string | null = null;
    if (roleRaw) {
      let normalized = String(roleRaw).trim();
      normalized = fixUtf8Encoding(normalized);
      normalized = normalized.toUpperCase();
      
      if (normalized === 'TÉCNICO' || normalized === 'TECNICO' || normalized === 'LIDER_TECNICO') {
        role = 'TÉCNICO';
      } else if (normalized === 'ADMINISTRADOR') {
        role = 'ADMINISTRADOR';
      } else if (normalized === 'COMERCIAL') {
        role = 'COMERCIAL';
      } else {
        role = normalized;
      }
    }
    
    return { 
      email, 
      name: name ? fixUtf8Encoding(name) : null, 
      role 
    };
  } catch (e) {
    return { email: null, name: null, role: null };
  }
}

