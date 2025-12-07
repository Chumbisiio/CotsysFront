import api from './http';

export interface CreateCotizacionRequest {
  usuario: number;
  cliente: number;
  estado: string;
  fechaCreacion: string;
  fechaValidez: string;
  margenGeneral: number;
  monedaCotizacion: string;
}

export interface CreateItemCotizacionRequest {
  producto: number;
  cantidad: number;
  precioUnitario: number;
}

export interface CreateCotizacionCompleteRequest {
  cotizacion: CreateCotizacionRequest;
  items: CreateItemCotizacionRequest[];
}

export interface Cotizacion {
  id: number;
  usuario: number;
  cliente: number;
  estado: string;
  fechaCreacion: string;
  fechaValidez: string;
  margenGeneral: number;
  monedaCotizacion: string;
}

export interface ItemCotizacion {
  id: number;
  cotizacion: number;
  producto: number;
  cantidad: number;
  precioUnitario: number;
}

export interface Impuesto {
  id: number;
  tipo: string;
  descripcion: string;
  porcentaje: number;
  estado: boolean;
  cotizacion: number;
}

export async function createCotizacion(data: CreateCotizacionCompleteRequest): Promise<void> {
  const resp = await api.post('/cotizaciones/create-cotizacion', data);
  const body: any = resp.data;
  const msg = body?.message || body?.error || body?.detail;
  if (body && body.success === false) {
    throw new Error(msg || 'Error al crear cotización');
  }
}

export async function getCotizaciones(): Promise<Cotizacion[]> {
  const resp = await api.get('/cotizaciones/get-all-cotizaciones');
  return resp.data || [];
}

export async function getItemsCotizacion(cotizacionId: number): Promise<ItemCotizacion[]> {
  const resp = await api.get(`/cotizaciones/${cotizacionId}/items`);
  return resp.data || [];
}

export async function getImpuestosCotizacion(cotizacionId: number): Promise<Impuesto[]> {
  const resp = await api.get(`/cotizaciones/${cotizacionId}/impuestos`);
  return resp.data || [];
}