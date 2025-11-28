import api from './http';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface CreateUserRequest {
  nombre: string;
  email: string;
  rol: string;
  password: string;
}

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const resp = await api.post<any>('/auth/login', data);
  const { access_token, refresh_token, accessToken, refreshToken } = resp.data || {};
  const at = access_token ?? accessToken;
  const rt = refresh_token ?? refreshToken;
  if (!at || !rt) {
    throw new Error('Respuesta de login sin tokens válidos');
  }
  return { access_token: at, refresh_token: rt };
}

export async function refreshToken(): Promise<TokenResponse> {
  const resp = await api.post<any>('/auth/refresh-token');
  const { access_token, refresh_token, accessToken, refreshToken } = resp.data || {};
  const at = access_token ?? accessToken;
  const rt = refresh_token ?? refreshToken;
  if (!at || !rt) {
    throw new Error('Respuesta de refresh sin tokens válidos');
  }
  return { access_token: at, refresh_token: rt };
}

export async function createUsuario(data: CreateUserRequest): Promise<void> {
  const resp = await api.post('/auth/create-user', data);
  const body: any = resp.data;
  const msg = body?.message || body?.error || body?.detail;
  if (msg && /registrad|duplicad/i.test(msg)) {
    throw new Error(msg);
  }
  // Si el backend usa una bandera de éxito falsa.
  if (body && body.success === false) {
    throw new Error(msg || 'Error al crear usuario');
  }
}

// Intenta cerrar sesión en el backend. En caso de error, solo registra una advertencia.
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    console.warn('[logout] Falló la solicitud de logout', e);
  }
}


