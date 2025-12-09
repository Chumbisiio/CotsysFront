import api from './http';

export interface CreateClienteRequest {
  nombre: string;
  nit: string;
  direccion: string;
  tipoRegimen: string;
  municipio: string;
  autorrentenedor: boolean;
}

export async function getClientes(): Promise<Array<any>> {
  const resp = await api.get('/clientes/get-all-clientes');
  return resp.data || [];
}

export async function createCliente(data: CreateClienteRequest): Promise<void>{
  const response = await api.post('/clientes/create-cliente', data);
  return response.data;
}

export async function updateCliente(id_cliente: number, cliente: any) {
  const response = await api.put(`/clientes/${id_cliente}/update-cliente`, cliente);
  return response.data;
}

export async function deleteCliente(id_cliente: number) {
  const response = await api.delete(`/clientes/${id_cliente}/delete-cliente`);
  return response.data;
}
