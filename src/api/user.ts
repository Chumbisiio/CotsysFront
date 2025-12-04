import api from './http';

export interface CreateUserRequest {
  nombre: string;
  email: string;
  rol: string;
  password: string;
}

export interface UpdateUserItem {
  email: string;
  rol: string;
  estado: boolean;
}

export async function createUsuario(data: CreateUserRequest): Promise<void> {
  const resp = await api.post('/auth/create-user', data);
  const body: any = resp.data;
  const msg = body?.message || body?.error || body?.detail;
  if (msg && /registrad|duplicad/i.test(msg)) {
    throw new Error(msg);
  }
  if (body && body.success === false) {
    throw new Error(msg || 'Error al crear usuario');
  }
}

export async function getUsuarios(): Promise<Array<any>> {
  const resp = await api.get('/users/get-all-users');
  return resp.data || [];
}

export async function updateUsuarios(usuarios: UpdateUserItem[]): Promise<void> {
  await api.post('/users/update-user', usuarios);
}

