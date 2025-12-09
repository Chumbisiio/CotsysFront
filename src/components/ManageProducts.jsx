import { useState, useEffect } from "react";
import { getProductos, createProducto, updateProducto, deleteProducto, getProductoById } from "../api/producto";
import { getKits, createKit, updateKit, deleteKit } from "../api/kits";


const PALETTE = {
  primary: '#2b6777',
  light: '#c8d8e4',
  white: '#ffffff',
  gray: '#f2f2f2',
  accent: '#52ab98'
};

const IconPlus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconBack = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconUser = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

// Componente para cargar y mostrar el nombre del producto
function ComponenteKitRow({ componente }) {
  const [nombreProducto, setNombreProducto] = useState(`Cargando...`);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const producto = await getProductoById(componente.id_producto);
        setNombreProducto(producto.nombre);
      } catch (err) {
        console.error(`Error cargando producto ${componente.id_producto}:`, err);
        setNombreProducto(`ID ${componente.id_producto}`);
      }
    };
    cargarProducto();
  }, [componente.id_producto]);

  return (
    <div style={{ padding: 8, borderRadius: 8, background: '#fff', border: `1px solid ${PALETTE.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: 600 }}>{nombreProducto}</div>
        <div style={{ fontSize: 12, color: '#556' }}>Cant: {componente.cantidad || 0} · Instr: {componente.instrucciones || 'N/A'}</div>
      </div>
      <div style={{ fontSize: 12, color: componente.estado ? '#2e7d32' : '#b23b3b' }}>{componente.estado ? 'Activo' : 'Inactivo'}</div>
    </div>
  );
}

export default function ManageProducts({ user = { name: 'Usuario' }, onCancel, onLogout = () => { } }) {
  const [products, setProducts] = useState([]);
  const [kits, setKits] = useState([]);
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProductos();
        setProducts(data);

        const kitsData = await getKits();
        setKits(kitsData);

      } catch (err) {
        console.error("Error obteniendo productos:", err);
      }
    };
    load();
  }, []);


  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingKit, setEditingKit] = useState(null);
  const [showKitForm, setShowKitForm] = useState(false);
  const [showToastSaveP, setShowToastSaveP] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showToastDeleteP, setShowToastDeleteP] = useState(false);
  const [showToastDeleteK, setShowToastDeleteK] = useState(false);
  const [showToastSaveK, setShowToastSaveK] = useState(false);
  const [showToastUpdtKit, setShowToastUpdtKit] = useState(false);

  const emptyProductForm = { id: '', nombre: '', descripcion: '', categoria: '', unidadMedida: '', costoBase: '', monedaOriginal: '', tipo: '', estado: true };
  const [productForm, setProductForm] = useState(emptyProductForm);

  const emptyKitForm = { id_kit: '', nombre: '', descripcion: '', estado: true, componentes: [{ id_componente_kit: Date.now(), productoSeleccionado: '', cantidad: 1, instrucciones: '', estado: true }] };
  const [kitForm, setKitForm] = useState(emptyKitForm);

  const openProductCreate = () => { setProductForm(emptyProductForm); setEditingProduct(null); setShowProductForm(true); };
  const openProductEdit = (p) => { setProductForm({ ...p }); setEditingProduct(p); setShowProductForm(true); };
  const closeProductForm = () => { setShowProductForm(false); setEditingProduct(null); setProductForm(emptyProductForm); };

  const openKitCreate = () => { setKitForm(emptyKitForm); setEditingKit(null); setShowKitForm(true); };
  const openKitEdit = (k) => {
    if (!k) {
      console.error("Kit es null o undefined");
      return;
    }

    // Mapear componentes de forma segura
    console.log("Componentes originales del kit:", k.componentes);
    const componentes = Array.isArray(k.componentes) && k.componentes.length > 0
      ? k.componentes.map(c => (console.log("Componente a mapear:", c), {
        id_componente_kit: c.id_componente_kit || Date.now() + Math.random(),
        id_producto: c.id_producto,
        cantidad: c.cantidad || 1,
        instrucciones: c.instrucciones || '',
        estado: c.estado !== undefined ? c.estado : true
      }))
      : [{ id_componente_kit: Date.now(), id: '', cantidad: 1, instrucciones: '', estado: true }];

    const kitFormData = {
      id_kit: k.id_kit,
      nombre: k.nombre || '',
      descripcion: k.descripcion || '',
      estado: k.estado !== undefined ? k.estado : true,
      componentes: componentes
    };

    console.log("Datos del formulario a establecer:", kitFormData);
    setKitForm(kitFormData);
    setEditingKit(k);
    setShowKitForm(true);
  };
  const closeKitForm = () => { setShowKitForm(false); setEditingKit(null); setKitForm(emptyKitForm); };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleKitChange = (e) => {
    const { name, value, type, checked } = e.target;
    setKitForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleComponentChange = (idx, key, value) => {
    setKitForm(prev => ({
      ...prev,
      componentes: prev.componentes.map((c, i) => i === idx ? { ...c, [key]: key === 'cantidad' ? Number(value) : value } : c)
    }));
  };

  const addComponentRow = () => {
    setKitForm(prev => ({
      ...prev,
      componentes: [...prev.componentes, { id_componente_kit: Date.now(), id: '', cantidad: 1, instrucciones: '', estado: true }]
    }));
  };

  const removeComponentRow = (id) => {
    setKitForm(prev => ({ ...prev, componentes: prev.componentes.filter(c => c.id_componente_kit !== id) }));
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: productForm.nombre,
        descripcion: productForm.descripcion,
        categoria: productForm.categoria,
        unidadMedida: productForm.unidadMedida,
        costoBase: Number(productForm.costoBase),
        monedaOriginal: productForm.monedaOriginal,
        tipo: productForm.tipo,
        estado: productForm.estado,
      };

      if (editingProduct) {
        await updateProducto(editingProduct.id, payload);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      } else {
        await createProducto(payload);
        setShowToastSaveP(true);
        setTimeout(() => setShowToastSaveP(false), 2000);
      }

      const data = await getProductos(); // recarga lista
      setProducts(data);
      closeProductForm();
    } catch (err) {
      console.error("Error guardando producto:", err);
      alert("Error guardando el producto");
    }
  };


  const saveKit = async (e) => {
    e.preventDefault();
    try {
      // Formatear los datos para el backend
      const payload = {
        nombre: kitForm.nombre,
        descripcion: kitForm.descripcion,
        estado: kitForm.estado,
        componentes: kitForm.componentes
          .filter(c => c.id_producto && c.id_producto !== '') // Filtrar componentes sin producto
          .map(c => ({
            id_producto: Number(c.id_producto),
            cantidad: Number(c.cantidad) || 1,
            instrucciones: c.instrucciones || '',
            estado: c.estado !== undefined ? c.estado : true
          }))
      };

      if (!payload.componentes.length) {
        alert('Agrega al menos un producto o servicio antes de guardar.');
        return;
      }


      if (editingKit) {
        await updateKit(editingKit.id_kit, payload);
        setShowToastUpdtKit(true);
        setTimeout(() => setShowToastUpdtKit(false), 2000);
      } else {
        await createKit(payload);
        setShowToastSaveK(true);
        setTimeout(() => setShowToastSaveK(false), 2000);
      }
      const kitsData = await getKits();
      setKits(kitsData);
      closeKitForm();
    } catch (err) {
      console.error("Error guardando kit:", err);
      alert("Error guardando el kit");
    }

  };

  const handleDeleteProduct = async (id) => {
    const ok = window.confirm("¿Eliminar producto?");
    if (!ok) return;

    try {
      await deleteProducto(id);
      const data = await getProductos(); // recarga lista
      setShowToastDeleteP(true);
      setTimeout(() => setShowToastDeleteP(false), 2000);
      setProducts(data);
    } catch (err) {
      console.error("Error eliminando producto:", err);
      alert("No se pudo eliminar");
    }
  };


  const handleDeleteKit = async (id_kit) => {
    const ok = window.confirm("¿Eliminar kit?");
    if (!ok) return;

    try {
      await deleteKit(id_kit);
      setShowToastDeleteK(true);
      setTimeout(() => setShowToastDeleteK(false), 2000);
      const kitsData = await getKits();
      setKits(kitsData);
    } catch (err) {
      console.error("Error eliminando kit:", err);
      alert("No se pudo eliminar el kit");
    }

  };

  const confirmLogout = () => {
    const ok = window.confirm('¿Deseas cerrar sesión?');
    if (!ok) return;
    onLogout();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: `linear-gradient(180deg, ${PALETTE.light}, ${PALETTE.gray})`, boxSizing: 'border-box', fontFamily: "Inter, Roboto, -apple-system, 'Segoe UI', sans-serif", animation: 'fadeSlideIn 240ms ease' }}>

      <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: 'rgba(255,255,255,0.7)', borderBottom: `1px solid ${PALETTE.light}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onCancel} style={{ background: PALETTE.primary, color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 6px 14px rgba(43,103,119,0.18)' }}>
            <IconBack /> Volver
          </button>
          <div style={{ fontWeight: 700, color: PALETTE.primary }}>CotSys</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: PALETTE.gray, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconUser size={16} />
            </div>
            <div style={{ fontSize: 14 }}>{user.name}</div>
          </div>
          <button onClick={confirmLogout} style={{ background: PALETTE.primary, color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', boxShadow: '0 6px 14px rgba(43,103,119,0.18)' }}>Cerrar sesión</button>
        </div>
      </div>

      <div style={{ flex: 1, padding: 20 }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', animation: 'fadeSlideIn 260ms ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h2 style={{ margin: 0, color: PALETTE.primary }}>Administrar productos y kits</h2>
              <p style={{ margin: 0, color: '#445', opacity: 0.9 }}>Basado en las tablas producto, kit_solucion y componente_kit.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={openProductCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, border: 'none', background: PALETTE.primary, color: '#fff', cursor: 'pointer' }}>
                <IconPlus /> Nuevo producto
              </button>
              <button onClick={openKitCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, border: `1px solid ${PALETTE.primary}`, background: '#fff', color: PALETTE.primary, cursor: 'pointer' }}>
                <IconPlus /> Nuevo kit
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr', gap: 16 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: `1px solid ${PALETTE.light}`, boxShadow: '0 12px 30px rgba(43,103,119,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h3 style={{ margin: 0, color: PALETTE.primary }}>Productos</h3>
                <span style={{ color: '#667', fontSize: 13 }}>{products.length} en total</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#334' }}>
                      <th style={{ padding: '10px 8px' }}>ID</th>
                      <th style={{ padding: '10px 8px' }}>Nombre</th>
                      <th style={{ padding: '10px 8px' }}>Categoria</th>
                      <th style={{ padding: '10px 8px' }}>Unidad</th>
                      <th style={{ padding: '10px 8px' }}>Costo</th>
                      <th style={{ padding: '10px 8px' }}>Moneda</th>
                      <th style={{ padding: '10px 8px' }}>Tipo</th>
                      <th style={{ padding: '10px 8px' }}>Estado</th>
                      <th style={{ padding: '10px 8px' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} style={{ borderTop: '1px solid #f1f1f1' }}>
                        <td style={{ padding: '10px 8px' }}>{p.id}</td>
                        <td style={{ padding: '10px 8px' }}>{p.nombre}</td>
                        <td style={{ padding: '10px 8px' }}>{p.categoria}</td>
                        <td style={{ padding: '10px 8px' }}>{p.unidadMedida}</td>
                        <td style={{ padding: '10px 8px' }}>{Number(p.costoBase).toFixed(2)}</td>
                        <td style={{ padding: '10px 8px' }}>{p.monedaOriginal}</td>
                        <td style={{ padding: '10px 8px' }}>{p.tipo}</td>
                        <td style={{ padding: '10px 8px' }}>{p.estado ? 'Activo' : 'Inactivo'}</td>
                        <td style={{ padding: '10px 8px' }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => openProductEdit(p)} style={{ padding: '6px 8px', borderRadius: 8, border: `1px solid ${PALETTE.light}`, background: 'transparent', cursor: 'pointer' }}>Editar</button>
                            <button onClick={() => handleDeleteProduct(p.id)} style={{ padding: '6px 8px', borderRadius: 8, border: 'none', background: '#ff6b6b', color: '#fff', cursor: 'pointer' }}>Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: `1px solid ${PALETTE.light}`, boxShadow: '0 12px 30px rgba(43,103,119,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h3 style={{ margin: 0, color: PALETTE.primary }}>Kits de solución</h3>
                <span style={{ color: '#667', fontSize: 13 }}>{kits.length} definidos</span>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {kits.map(kit => (
                  <div key={kit.id_kit} style={{ border: `1px solid ${PALETTE.light}`, borderRadius: 10, padding: 12, background: '#fbfcfd' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#234' }}>{kit.nombre}</div>
                        <div style={{ fontSize: 13, color: '#556' }}>{kit.descripcion}</div>
                        <div style={{ marginTop: 4, fontSize: 12, color: kit.estado ? '#2e7d32' : '#b23b3b' }}>{kit.estado ? 'Activo' : 'Inactivo'}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => {
                            openKitEdit(kit);
                          }}
                          style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${PALETTE.light}`, background: 'transparent', cursor: 'pointer' }}>
                          Editar
                        </button>
                        <button onClick={() => handleDeleteKit(kit.id_kit)} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: '#ff6b6b', color: '#fff', cursor: 'pointer' }}>Eliminar</button>
                      </div>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#223', marginBottom: 4 }}>Componentes</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {(kit.componentes && Array.isArray(kit.componentes) ? kit.componentes : []).map(c => {
                          if (!c) return null;
                          return (
                            <ComponenteKitRow key={c.id_componente_kit} componente={c} />
                          );
                        }).filter(Boolean)}
                      </div>
                    </div>
                  </div>
                ))}
                {kits.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 20, color: '#667' }}>Sin kits definidos aún.</div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: `1px solid ${PALETTE.light}`, background: 'rgba(255,255,255,0.6)' }}>
        <div style={{ color: PALETTE.primary, fontWeight: 600 }}>J^3</div>
      </div>

      {showProductForm && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.28)' }}>
          <div style={{ width: 920, maxWidth: '96%', background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, color: PALETTE.primary }}>{editingProduct ? 'Editar producto' : 'Nuevo producto'}</h3>
              <button onClick={closeProductForm} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>Cerrar</button>
            </div>

            <form onSubmit={saveProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13 }}>Nombre</label>
                <input name="nombre" value={productForm.nombre} onChange={handleProductChange} style={inputStyle()} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13 }}>Categoria</label>
                <input name="categoria" value={productForm.categoria} onChange={handleProductChange} style={inputStyle()} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13 }}>Unidad de medida</label>
                <input name="unidadMedida" value={productForm.unidadMedida} onChange={handleProductChange} style={inputStyle()} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13 }}>Costo base</label>
                <input name="costoBase" value={productForm.costoBase} onChange={handleProductChange} type="number" step="0.01" style={inputStyle()} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13 }}>Moneda Original</label>
                <select
                  name="monedaOriginal"
                  value={productForm.monedaOriginal || ''}
                  onChange={handleProductChange}
                  style={inputStyle()}
                  required>
                  <option value="">Seleccionar</option>
                  <option value="COP">COP</option>
                  <option value="USD">USD</option>
                </select>
              </div>


              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13 }}>Tipo</label>
                <select
                  name="tipo"
                  value={productForm.tipo}
                  onChange={handleProductChange}
                  style={inputStyle()}
                  required>
                  <option value="">Seleccionar</option>
                  <option value="Producto">Producto</option>
                  <option value="Servicio">Servicio</option>
                </select>
              </div>


              <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13 }}>Descripción</label>
                <textarea name="descripcion" value={productForm.descripcion} onChange={handleProductChange} rows={3} style={{ ...inputStyle(), resize: 'vertical' }} required />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input id="estado" name="estado" type="checkbox" checked={productForm.estado} onChange={handleProductChange} />
                <label htmlFor="estado">Activo</label>
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                <button type="button" onClick={closeProductForm} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${PALETTE.light}`, background: 'transparent' }}>Cancelar</button>
                <button type="submit" style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: PALETTE.primary, color: '#fff' }}>Guardar</button>
              </div>
            </form>

          </div>
        </div>
      )}

      {showKitForm && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.28)', zIndex: 1000 }}>
          <div style={{ width: 900, maxWidth: '96%', background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, color: PALETTE.primary }}>{editingKit ? 'Editar kit' : 'Nuevo kit'}</h3>
              <button onClick={closeKitForm} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>Cerrar</button>
            </div>

            <form onSubmit={saveKit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 13 }}>Nombre</label>
                <input name="nombre" value={kitForm.nombre} onChange={handleKitChange} style={inputStyle()} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 13 }}>Descripción</label>
                <textarea name="descripcion" value={kitForm.descripcion} onChange={handleKitChange} rows={3} style={{ ...inputStyle(), resize: 'vertical' }} required />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input id="estadoKit" name="estado" type="checkbox" checked={kitForm.estado} onChange={handleKitChange} />
                <label htmlFor="estadoKit">Activo</label>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontWeight: 600, color: '#223' }}>Componentes</div>
                  <button type="button" onClick={addComponentRow} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${PALETTE.primary}`, background: '#fff', color: PALETTE.primary, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <IconPlus size={14} /> Añadir componente
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {kitForm.componentes.map((c, idx) => (
                    console.log("Renderizando componente de kit:", c),
                    <div key={c.id_componente_kit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, alignItems: 'center', border: `1px solid ${PALETTE.light}`, borderRadius: 10, padding: 8 }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: 12 }}>Producto</label>
                        <select name="productoSeleccionado" value={c.id_producto} onChange={(e) => handleComponentChange(idx, 'id_producto', e.target.value)} style={inputStyle()} required>
                          <option value="">Seleccionar</option>
                          {products.map(p => <option key={p.productoId ?? p.id} value={String(p.productoId ?? p.id)}>{p.nombre}</option>)}
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: 12 }}>Cantidad</label>
                        <input type="number" value={c.cantidad} onChange={(e) => handleComponentChange(idx, 'cantidad', e.target.value)} style={inputStyle()} required />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: 12 }}>Estado</label>
                        <select value={c.estado ? 'true' : 'false'} onChange={(e) => handleComponentChange(idx, 'estado', e.target.value === 'true')} style={inputStyle()}>
                          <option value="true">Activo</option>
                          <option value="false">Inactivo</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input value={c.instrucciones} onChange={(e) => handleComponentChange(idx, 'instrucciones', e.target.value)} placeholder="Instrucciones" style={inputStyle()} />
                        <button type="button" onClick={() => removeComponentRow(c.id_componente_kit)} style={{ padding: '6px 8px', borderRadius: 8, border: 'none', background: '#ff6b6b', color: '#fff', cursor: 'pointer' }}>X</button>
                      </div>
                    </div>
                  ))}
                  {kitForm.componentes.length === 0 && <div style={{ color: '#777', fontSize: 13 }}>Añade al menos un componente.</div>}
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                <button type="button" onClick={closeKitForm} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${PALETTE.light}`, background: 'transparent' }}>Cancelar</button>
                <button type="submit" style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: PALETTE.primary, color: '#fff' }}>Guardar kit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showToast && (
        <div style={{
          position: 'fixed',
          right: 20,
          bottom: 80,
          background: PALETTE.primary,
          color: '#fff',
          padding: '10px 14px',
          borderRadius: 10,
          boxShadow: '0 8px 20px rgba(0,0,0,0.16)'
        }}>
          Producto editado correctamente.
        </div>
      )}

      {showToastSaveP && (
        <div style={{
          position: 'fixed',
          right: 20,
          bottom: 80,
          background: PALETTE.primary,
          color: '#fff',
          padding: '10px 14px',
          borderRadius: 10,
          boxShadow: '0 8px 20px rgba(0,0,0,0.16)'
        }}>
          Producto guardado correctamente.
        </div>
      )}

      {showToastDeleteP && (
        <div style={{
          position: 'fixed',
          right: 20,
          bottom: 80,
          background: PALETTE.primary,
          color: '#fff',
          padding: '10px 14px',
          borderRadius: 10,
          boxShadow: '0 8px 20px rgba(0,0,0,0.16)'
        }}>
          Producto eliminado correctamente.
        </div>
      )}

      {showToastUpdtKit && (
        <div style={{
          position: 'fixed',
          right: 20,
          bottom: 80,
          background: PALETTE.primary,
          color: '#fff',
          padding: '10px 14px',
          borderRadius: 10,
          boxShadow: '0 8px 20px rgba(0,0,0,0.16)'
        }}>
          Kit editado correctamente.
        </div>
      )}

      {showToastSaveK && (
        <div style={{
          position: 'fixed',
          right: 20,
          bottom: 80,
          background: PALETTE.primary,
          color: '#fff',
          padding: '10px 14px',
          borderRadius: 10,
          boxShadow: '0 8px 20px rgba(0,0,0,0.16)'
        }}>
          Kit guardado correctamente.
        </div>
      )}

      {showToastDeleteK && (
        <div style={{
          position: 'fixed',
          right: 20,
          bottom: 80,
          background: PALETTE.primary,
          color: '#fff',
          padding: '10px 14px',
          borderRadius: 10,
          boxShadow: '0 8px 20px rgba(0,0,0,0.16)'
        }}>
          Kit eliminado correctamente.
        </div>
      )}

    </div>
  );
}

function inputStyle() {
  return { padding: '10px 12px', borderRadius: 8, border: `1px solid #e6eef0`, background: '#f9fafb', outline: 'none' };
}