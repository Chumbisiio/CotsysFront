import api from './http';

export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  unidad_medida: string;
  costo_base: number;
  moneda_original: string;
  tipo: string; // 'PRODUCTO' o 'SERVICIO'
  estado: boolean;
}

export interface Kit {
  id_kit_solucion: number;
  nombre: string;
  descripcion?: string;
  estado: boolean;
}

export interface ComponenteKit {
  id_componente_kit: number;
  id_kit_solucion: number;
  id_producto: number;
  cantidad: number;
}

export async function getProductos(): Promise<Producto[]> {
  const resp = await api.get('/productos/get-all-productos');
  return resp.data || [];
}

export async function createProducto(producto: any) {
  const response = await api.post('/productos/create-producto', producto);
  return response.data;
}

export async function updateProducto(id_producto: number, producto: any) {
  const response = await api.put(`/productos/${id_producto}/update-producto`, producto);
  return response.data;
}

export async function deleteProducto(id_producto: number) {
  try {
    const response = await api.delete(`/productos/${id_producto}/delete-producto`);
    return response;
  } catch (error: any) {
    // Si es 204 (No Content), es exitoso
    if (error.response?.status === 204) {
      return { status: 204 };
    }
    throw error;
  }
}

export async function getKits(): Promise<Kit[]> {
  const resp = await api.get('/kits/get-all-kits');
  return resp.data || [];
}

// Obtiene los componentes del kit (solo IDs y cantidades)
export async function getComponentesKit(id_kit: number): Promise<ComponenteKit[]> {
  const resp = await api.get(`/componente-kit/${id_kit}/get-componentes`);
  return resp.data || [];
}

// Obtiene un producto por ID
export async function getProductoById(id_producto: number): Promise<Producto> {
  const resp = await api.get(`/productos/${id_producto}/get-producto-by-id`);
  return resp.data;
}
