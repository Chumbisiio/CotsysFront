import api from './http';

export async function getClientes(): Promise<Array<any>> {
  const resp = await api.get('/clientes/get-all-clientes');
  return resp.data || [];
}