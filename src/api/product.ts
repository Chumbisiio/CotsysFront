import axios from './http';

export async function getProductos() {
  const response = await axios.get('/productos/get-all-productos');
  return response.data;
}

export async function createProducto(producto: any) {
  const response = await axios.post('/productos/create-producto', producto);
  return response.data;
}

export async function updateProducto(id_producto: number, producto: any) {
  const response = await axios.put(`/productos/${id_producto}/update-producto`, producto);
  return response.data;
}

export async function deleteProducto(id_producto: number) {
  try {
    const response = await axios.delete(`/productos/${id_producto}/delete-producto`);
    return response;
  } catch (error: any) {
    // Si es 204 (No Content), es exitoso
    if (error.response?.status === 204) {
      return { status: 204 };
    }
    throw error;
  }
}


