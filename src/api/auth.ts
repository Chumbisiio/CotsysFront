import api from './http';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
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

// Intenta cerrar sesión en el backend. En arquitectura JWT stateless esto suele
// invalidar el refresh token (por blacklist o rotación). Si falla la petición,
// igualmente el frontend puede limpiar tokens locales para efectos prácticos.
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    console.warn('[logout] Falló la solicitud de logout', e);
  }
}
