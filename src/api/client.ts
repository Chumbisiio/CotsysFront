import axios from './http';

export interface CreateClienteRequest {
  nombre: string;
  nit: string;
  direccion: string;
  tipoRegimen: string;
  municipio: string;
  autorrentenedor: boolean;
}

export async function getClientes() {
  const response = await axios.get('/clientes/get-all-clientes');
  return response.data;
}

export async function createCliente(data: CreateClienteRequest): Promise<void>{
  const response = await axios.post('/clientes/create-cliente', data);
  return response.data;
}

export async function updateCliente(id_cliente: number, cliente: any) {
  const response = await axios.put(`/clientes/${id_cliente}/update-cliente`, cliente);
  return response.data;
}

export async function deleteCliente(id_cliente: number) {
  const response = await axios.delete(`/clientes/${id_cliente}/delete-cliente`);
  return response.data;
}
