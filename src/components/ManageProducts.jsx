import React, { useState } from 'react';

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

export default function ManageProducts({ user = { name: 'Usuario' }, onCancel, onLogout = () => {} }) {
  const [products, setProducts] = useState([
    { id_producto: 1, nombre: 'Kit A', descripcion: 'Kit básico', categoria: 'Soluciones', unidadMedida: 'unidad', costoBase: 1200.00, monedaOriginal: 'COP', tipo: 'kit', estado: true, cantidadKit: 1, instruccionesKit: 'Usar con cuidado', kitSolucion: 1001 },
    { id_producto: 2, nombre: 'Producto B', descripcion: 'Componente B', categoria: 'Componentes', unidadMedida: 'kg', costoBase: 45.50, monedaOriginal: 'USD', tipo: 'componente', estado: true, cantidadKit: 0, instruccionesKit: '', kitSolucion: 0 },
    { id_producto: 3, nombre: 'Producto C', descripcion: 'Componente C', categoria: 'Componentes', unidadMedida: 'unidad', costoBase: 30.00, monedaOriginal: 'USD', tipo: 'componente', estado: true, cantidadKit: 0, instruccionesKit: '', kitSolucion: 0 }
  ]);

  const [kits, setKits] = useState([
    {
      id_kit_solucion: 1001,
      nombre: 'Kit de solución A',
      descripcion: 'Agrupa componentes críticos',
      estado: true,
      componentes: [
        { id_componente_kit: 5001, id_producto: 2, cantidad: 2, instrucciones: 'Montar en serie', estado: true },
        { id_componente_kit: 5002, id_producto: 3, cantidad: 1, instrucciones: 'Integrar al final', estado: true }
      ]
    }
  ]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingKit, setEditingKit] = useState(null);
  const [showKitForm, setShowKitForm] = useState(false);

  const emptyProductForm = { id_producto: '', nombre: '', descripcion: '', categoria: '', unidadMedida: '', costoBase: '', monedaOriginal: '', tipo: '', estado: true, cantidadKit: 0, instruccionesKit: '', kitSolucion: '' };
  const [productForm, setProductForm] = useState(emptyProductForm);

  const emptyKitForm = { id_kit_solucion: '', nombre: '', descripcion: '', estado: true, componentes: [{ id_componente_kit: Date.now(), id_producto: '', cantidad: 1, instrucciones: '', estado: true }] };
  const [kitForm, setKitForm] = useState(emptyKitForm);

  const openProductCreate = () => { setProductForm(emptyProductForm); setEditingProduct(null); setShowProductForm(true); };
  const openProductEdit = (p) => { setProductForm({ ...p }); setEditingProduct(p); setShowProductForm(true); };
  const closeProductForm = () => { setShowProductForm(false); setEditingProduct(null); setProductForm(emptyProductForm); };

  const openKitCreate = () => { setKitForm(emptyKitForm); setEditingKit(null); setShowKitForm(true); };
  const openKitEdit = (k) => { setKitForm({ ...k, componentes: k.componentes.map(c => ({ ...c })) }); setEditingKit(k); setShowKitForm(true); };
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
      componentes: [...prev.componentes, { id_componente_kit: Date.now(), id_producto: '', cantidad: 1, instrucciones: '', estado: true }]
    }));
  };

  const removeComponentRow = (id) => {
    setKitForm(prev => ({ ...prev, componentes: prev.componentes.filter(c => c.id_componente_kit !== id) }));
  };

  const saveProduct = (e) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id_producto === editingProduct.id_producto ? { ...editingProduct, ...productForm, costoBase: Number(productForm.costoBase) } : p));
    } else {
      const newId = products.length ? Math.max(...products.map(p => p.id_producto)) + 1 : 1;
      setProducts(prev => [...prev, { ...productForm, id_producto: newId, costoBase: Number(productForm.costoBase) }]);
    }
    closeProductForm();
  };

  const saveKit = (e) => {
    e.preventDefault();
    if (editingKit) {
      setKits(prev => prev.map(k => k.id_kit_solucion === editingKit.id_kit_solucion ? { ...editingKit, ...kitForm } : k));
    } else {
      const newId = kits.length ? Math.max(...kits.map(k => k.id_kit_solucion)) + 1 : 1001;
      setKits(prev => [...prev, { ...kitForm, id_kit_solucion: newId }]);
    }
    closeKitForm();
  };

  const handleDeleteProduct = (id) => {
    if (!window.confirm('Eliminar producto (simulación)?')) return;
    setProducts(prev => prev.filter(p => p.id_producto !== id));
  };

  const handleDeleteKit = (id) => {
    if (!window.confirm('Eliminar kit (simulación)?')) return;
    setKits(prev => prev.filter(k => k.id_kit_solucion !== id));
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
                      <tr key={p.id_producto} style={{ borderTop: '1px solid #f1f1f1' }}>
                        <td style={{ padding: '10px 8px' }}>{p.id_producto}</td>
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
                            <button onClick={() => handleDeleteProduct(p.id_producto)} style={{ padding: '6px 8px', borderRadius: 8, border: 'none', background: '#ff6b6b', color: '#fff', cursor: 'pointer' }}>Eliminar</button>
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
                  <div key={kit.id_kit_solucion} style={{ border: `1px solid ${PALETTE.light}`, borderRadius: 10, padding: 12, background: '#fbfcfd' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#234' }}>{kit.nombre}</div>
                        <div style={{ fontSize: 13, color: '#556' }}>{kit.descripcion}</div>
                        <div style={{ marginTop: 4, fontSize: 12, color: kit.estado ? '#2e7d32' : '#b23b3b' }}>{kit.estado ? 'Activo' : 'Inactivo'}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openKitEdit(kit)} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${PALETTE.light}`, background: 'transparent', cursor: 'pointer' }}>Editar</button>
                        <button onClick={() => handleDeleteKit(kit.id_kit_solucion)} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: '#ff6b6b', color: '#fff', cursor: 'pointer' }}>Eliminar</button>
                      </div>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#223', marginBottom: 4 }}>Componentes (componente_kit)</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {kit.componentes.map(c => {
                          const prod = products.find(p => p.id_producto === Number(c.id_producto)) || products.find(p => p.id_producto === c.id_producto);
                          const nombreProd = prod ? prod.nombre : `ID ${c.id_producto}`;
                          return (
                            <div key={c.id_componente_kit} style={{ padding: 8, borderRadius: 8, background: '#fff', border: `1px solid ${PALETTE.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ fontWeight: 600 }}>{nombreProd}</div>
                                <div style={{ fontSize: 12, color: '#556' }}>Cant: {c.cantidad} · Instr: {c.instrucciones || 'N/A'}</div>
                              </div>
                              <div style={{ fontSize: 12, color: c.estado ? '#2e7d32' : '#b23b3b' }}>{c.estado ? 'Activo' : 'Inactivo'}</div>
                            </div>
                          );
                        })}
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
                <label style={{ fontSize: 13 }}>ID producto</label>
                <input name="id_producto" value={productForm.id_producto} onChange={handleProductChange} placeholder="auto (opcional)" style={inputStyle()} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13 }}>Nombre</label>
                <input name="nombre" value={productForm.nombre} onChange={handleProductChange} required style={inputStyle()} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13 }}>Categoria</label>
                <input name="categoria" value={productForm.categoria} onChange={handleProductChange} style={inputStyle()} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13 }}>Unidad de medida</label>
                <input name="unidadMedida" value={productForm.unidadMedida} onChange={handleProductChange} style={inputStyle()} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13 }}>Costo base</label>
                <input name="costoBase" value={productForm.costoBase} onChange={handleProductChange} type="number" step="0.01" style={inputStyle()} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13 }}>Moneda original</label>
                <input name="monedaOriginal" value={productForm.monedaOriginal} onChange={handleProductChange} style={inputStyle()} />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13 }}>Descripción</label>
                <textarea name="descripcion" value={productForm.descripcion} onChange={handleProductChange} rows={3} style={{ ...inputStyle(), resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input id="estado" name="estado" type="checkbox" checked={productForm.estado} onChange={handleProductChange} />
                <label htmlFor="estado">Activo</label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label>Cantidad kit</label>
                <input name="cantidadKit" value={productForm.cantidadKit} onChange={handleProductChange} type="number" style={inputStyle()} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label>Instrucciones kit</label>
                <input name="instruccionesKit" value={productForm.instruccionesKit} onChange={handleProductChange} style={inputStyle()} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label>Kit solución (ID)</label>
                <input name="kitSolucion" value={productForm.kitSolucion} onChange={handleProductChange} style={inputStyle()} />
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
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.28)' }}>
          <div style={{ width: 900, maxWidth: '96%', background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, color: PALETTE.primary }}>{editingKit ? 'Editar kit' : 'Nuevo kit'}</h3>
              <button onClick={closeKitForm} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>Cerrar</button>
            </div>

            <form onSubmit={saveKit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13 }}>ID kit_solución</label>
                <input name="id_kit_solucion" value={kitForm.id_kit_solucion} onChange={handleKitChange} placeholder="auto (opcional)" style={inputStyle()} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input id="estadoKit" name="estado" type="checkbox" checked={kitForm.estado} onChange={handleKitChange} />
                <label htmlFor="estadoKit">Activo</label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 13 }}>Nombre</label>
                <input name="nombre" value={kitForm.nombre} onChange={handleKitChange} required style={inputStyle()} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 13 }}>Descripción</label>
                <textarea name="descripcion" value={kitForm.descripcion} onChange={handleKitChange} rows={3} style={{ ...inputStyle(), resize: 'vertical' }} />
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
                    <div key={c.id_componente_kit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, alignItems: 'center', border: `1px solid ${PALETTE.light}`, borderRadius: 10, padding: 8 }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: 12 }}>Producto (id_producto)</label>
                        <select value={c.id_producto} onChange={(e) => handleComponentChange(idx, 'id_producto', e.target.value)} style={inputStyle()}>
                          <option value="">Seleccionar</option>
                          {products.map(p => <option key={p.id_producto} value={p.id_producto}>{p.id_producto} - {p.nombre}</option>)}
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: 12 }}>Cantidad</label>
                        <input type="number" value={c.cantidad} onChange={(e) => handleComponentChange(idx, 'cantidad', e.target.value)} style={inputStyle()} />
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

    </div>
  );
}

function inputStyle() {
  return { padding: '10px 12px', borderRadius: 8, border: `1px solid #e6eef0`, background: '#f9fafb', outline: 'none' };
}