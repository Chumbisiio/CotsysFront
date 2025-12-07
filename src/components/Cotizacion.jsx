import React, { useMemo, useState, useEffect } from 'react';
import { getClientes } from '../api/cliente';
import { getProductos, getKits, getComponentesKit, getProductoById } from '../api/producto';
import { createCotizacion, getCotizaciones, getItemsCotizacion, getImpuestosCotizacion } from '../api/cotizacion';

const PALETTE = {
  primary: '#2b6777',
  light: '#c8d8e4',
  white: '#ffffff',
  gray: '#f2f2f2',
  accent: '#52ab98'
};

const IconSave = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 3h14v16H5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M7 7h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
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

const IconList = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconPlus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Cotizacion({ user = { name: 'Empresa - Usuario', email: null }, onCancel, onLogout = () => { } }) {
  const [vistaActual, setVistaActual] = useState('crear'); // 'crear' o 'listar'
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [kits, setKits] = useState([]);
  const [loadingKits, setLoadingKits] = useState(true);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loadingCotizaciones, setLoadingCotizaciones] = useState(false);
  const [cotizacionesDetalle, setCotizacionesDetalle] = useState({});

  const [form, setForm] = useState({
    estado: 'Borrador',
    fechaCreacion: new Date().toISOString().slice(0, 10),
    fechaValidez: '',
    margenGeneral: 10.00,
    monedaCotizacion: 'COP',
    usuario: '',
    cliente: '',
    kitSeleccionado: ''
  });

  const [items, setItems] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      setLoadingClientes(true);
      try {
        const data = await getClientes();
        setClientes(data);
      } catch (err) {
        console.error('[Cotizacion] Error cargando clientes:', err);
      } finally {
        setLoadingClientes(false);
      }
    };
    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoadingProductos(true);
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (err) {
        console.error('[Cotizacion] Error cargando productos:', err);
      } finally {
        setLoadingProductos(false);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    const fetchKits = async () => {
      setLoadingKits(true);
      try {
        const data = await getKits();
        setKits(data);
      } catch (err) {
        console.error('[Cotizacion] Error cargando kits:', err);
      } finally {
        setLoadingKits(false);
      }
    };
    fetchKits();
  }, []);

  const handleKitSelection = async (kitId) => {
    if (!kitId) {
      setForm(prev => ({ ...prev, kitSeleccionado: '' }));
      return;
    }

    // Asegura que el id sea numérico para el endpoint
    const kitIdNum = Number(kitId);
    setForm(prev => ({ ...prev, kitSeleccionado: kitId }));

    try {
      // Obtiene los componentes del kit (solo IDs y cantidades)
      const componentes = await getComponentesKit(kitIdNum);

      // Para cada componente, obtiene los datos completos del producto
      const newItems = await Promise.all(
        componentes.map(async (comp, idx) => {
          try {
            const producto = await getProductoById(comp.producto);
            return {
              // Guardamos el ID real del producto para que el select lo resuelva por nombre
              id: Math.max(...items.map(i => i.id), 0) + idx + 1,
              producto: producto.id,
              cantidad: comp.cantidad ?? 1,
              precioUnitario: producto.costoBase ?? 0
            };
          } catch (err) {
            console.error(`Error cargando producto ${comp.id_producto}:`, err);
            return {
              id: Math.max(...items.map(i => i.id), 0) + idx + 1,
              producto: comp.id_producto,
              cantidad: comp.cantidad ?? 1,
              precioUnitario: 0
            };
          }
        })
      );

      // Añade los items del kit a la lista existente
      setItems(prev => [...prev, ...newItems]);

      // Limpia la selección del kit para permitir agregar otro
      setForm(prev => ({ ...prev, kitSeleccionado: '' }));
    } catch (err) {
      console.error('[Cotizacion] Error cargando componentes del kit:', err);
    }
  };

  const updateForm = (e) => {
    const { name, value, type } = e.target;
    if (name === 'kitSeleccionado') {
      handleKitSelection(value);
    } else if (name === 'cliente') {
      setForm(prev => ({ ...prev, cliente: value }));
      // Busca el cliente seleccionado en la lista de clientes
      console.log('Buscando cliente para ID:', value);
      const cliente = clientes.find(c => String(c.id_cliente) === String(value));
      setClienteSeleccionado(cliente || null);
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    }
  };

  const updateItem = (idx, key, value) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [key]: key === 'cantidad' || key === 'precioUnitario' ? Number(value) : value } : it));
  };

  const addItem = () => {
    const newId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems(prev => [...prev, { id: newId, producto: '', cantidad: 1, precioUnitario: 0 }]);
  };
  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const subtotal = useMemo(() => items.reduce((s, it) => s + (Number(it.cantidad) * Number(it.precioUnitario || 0)), 0), [items]);
  const subtotalMargen = useMemo(() => subtotal * (1 + Number(form.margenGeneral || 0) / 100), [subtotal, form.margenGeneral]);
  const iva = useMemo(() => subtotalMargen * 0.19, [subtotalMargen]);
  const retencion = useMemo(() => {
    // Solo aplica retención si el cliente tiene autorrentenedor = true
    if (clienteSeleccionado?.autorrentenedor === true) {
      return subtotalMargen * 0.10; // 10% de retención en la fuente
    }
    return 0;
  }, [subtotalMargen, clienteSeleccionado]);
  const total = useMemo(() => subtotalMargen + iva - retencion, [subtotalMargen, iva, retencion]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!items.length) {
      setLoading(false);
      alert('Agrega al menos un producto o servicio antes de guardar.');
      return;
    }

    try {
      // Construye la estructura esperada por el backend
      const cotizacionData = {
        cotizacion: {
          usuario: user.userId || 1, // Usa el userId del usuario logeado
          cliente: Number(form.cliente),
          estado: form.estado,
          fechaCreacion: form.fechaCreacion,
          fechaValidez: form.fechaValidez,
          margenGeneral: Number(form.margenGeneral),
          monedaCotizacion: form.monedaCotizacion
        },
        items: items.map(it => ({
          producto: Number(it.producto),
          cantidad: Number(it.cantidad),
          precioUnitario: Number(it.precioUnitario)
        }))
      };

      await createCotizacion(cotizacionData);

      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);

      // Limpia el formulario
      setForm({
        estado: 'Borrador',
        fechaCreacion: new Date().toISOString().slice(0, 10),
        fechaValidez: '',
        margenGeneral: 10.00,
        monedaCotizacion: 'COP',
        usuario: '',
        cliente: '',
        kitSeleccionado: ''
      });
      setItems([]);
    } catch (err) {
      console.error('[Cotizacion] Error creando cotización:', err);
      setError(err.message || 'Error al crear la cotización');
    } finally {
      setLoading(false);
    }
  };

  const confirmLogout = () => {
    const ok = window.confirm('¿Deseas cerrar sesión?');
    if (!ok) return;
    onLogout();
  };

  const fetchCotizacionesConDetalle = async () => {
    setLoadingCotizaciones(true);
    try {
      const cotizacionesData = await getCotizaciones();
      setCotizaciones(cotizacionesData);

      // Carga items e impuestos para cada cotización
      const detalles = {};
      for (const cot of cotizacionesData) {
        const [items, impuestos] = await Promise.all([
          getItemsCotizacion(cot.id),
          getImpuestosCotizacion(cot.id)
        ]);
        detalles[cot.id] = { items, impuestos };
      }
      setCotizacionesDetalle(detalles);
    } catch (err) {
      console.error('[Cotizacion] Error cargando cotizaciones:', err);
      setError(err.message || 'Error al cargar cotizaciones');
    } finally {
      setLoadingCotizaciones(false);
    }
  };

  useEffect(() => {
    if (vistaActual === 'listar') {
      fetchCotizacionesConDetalle();
    }
  }, [vistaActual]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: `linear-gradient(180deg, ${PALETTE.light}, ${PALETTE.gray})`,
      boxSizing: 'border-box',
      fontFamily: "Inter, Roboto, -apple-system, 'Segoe UI', sans-serif",
      animation: 'fadeSlideIn 240ms ease'
    }}>
      <div style={{
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', background: 'rgba(255,255,255,0.7)', borderBottom: `1px solid ${PALETTE.light}`
      }}>
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

      {/* Main */}
      <div style={{ flex: 1, padding: 20 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h2 style={{ margin: 0, color: PALETTE.primary }}>
                {vistaActual === 'crear' ? 'Nueva Cotización' : 'Lista de Cotizaciones'}
              </h2>
              <p style={{ margin: 0, color: '#445', opacity: 0.9 }}>
                {vistaActual === 'crear' ? 'Formulario visual' : 'Ver cotizaciones guardadas'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              {vistaActual === 'crear' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setVistaActual('listar')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, border: 'none', background: PALETTE.accent, color: '#fff', cursor: 'pointer' }}
                  >
                    <IconList /> Ver cotizaciones
                  </button>
                  <button type="submit" form="cotizacion-form" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, border: 'none', background: PALETTE.primary, color: '#fff', cursor: 'pointer' }}>
                    <IconSave /> {loading ? 'Creando cotización...' : 'Guardar cotización'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setVistaActual('crear')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, border: 'none', background: PALETTE.primary, color: '#fff', cursor: 'pointer' }}
                >
                  <IconPlus /> Nueva cotización
                </button>
              )}
            </div>
          </div>

          {error && (
            <div role="alert" style={{
              margin: '0 0 12px 0',
              background: '#ffe5e5',
              color: '#9b1c1c',
              border: '1px solid #ffc9c9',
              padding: '10px 12px',
              borderRadius: 10,
              fontWeight: 600
            }}>
              {error}
            </div>
          )}

          {vistaActual === 'crear' ? (
            /* Formulario principal */
            <form id="cotizacion-form" onSubmit={handleSave} style={{ background: PALETTE.white, padding: 16, borderRadius: 12, border: `1px solid ${PALETTE.light}`, boxShadow: '0 12px 30px rgba(43,103,119,0.04)' }}>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, alignItems: 'center', marginBottom: 12 }}>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: 13 }}>Estado</label>
                  <select name="estado" value={form.estado} onChange={updateForm} style={selectStyle()}>
                    <option>Borrador</option>
                    <option>Enviado</option>
                    <option>Aceptado</option>
                    <option>Rechazado</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: 13 }}>Moneda</label>
                  <select name="monedaCotizacion" value={form.monedaCotizacion} onChange={updateForm} style={selectStyle()}>
                    <option>COP</option>
                    <option>USD</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: 13 }}>Fecha creación</label>
                  <input type="date" name="fechaCreacion" value={form.fechaCreacion} onChange={updateForm} style={inputStyle()} required />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: 13 }}>Fecha validez</label>
                  <input type="date" name="fechaValidez" value={form.fechaValidez} onChange={updateForm} style={inputStyle()} required />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: 13 }}>Margen general (%)</label>
                  <input type="number" step="0.01" name="margenGeneral" value={form.margenGeneral} onChange={updateForm} style={inputStyle()} required />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: 13 }}>Usuario</label>
                  <input name="usuario" value={user.email} onChange={updateForm} style={inputStyle()} readOnly />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: 13 }}>Cliente</label>
                    <select name="cliente" value={form.cliente} onChange={updateForm} style={selectStyle()} disabled={loadingClientes} required>
                      <option value="">{loadingClientes ? 'Cargando clientes...' : '-- Seleccionar cliente --'}</option>
                      {clientes.map(c => (
                        <option key={c.id_cliente} value={c.id_cliente}>
                          {c.nit} - {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: 13 }}>Incluir Kit</label>
                    <select name="kitSeleccionado" value={form.kitSeleccionado} onChange={updateForm} style={selectStyle()} disabled={loadingKits}>
                      <option value="">{loadingKits ? 'Cargando kits...' : '-- Seleccionar kit --'}</option>
                      {kits.map(k => (
                        <option key={k.id_kit} value={k.id_kit}>
                          {k.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Items: tabla simple */}
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ margin: 0 }}>Items</h4>
                  <button type="button" onClick={addItem} style={{ padding: '8px 10px', borderRadius: 8, background: PALETTE.accent, color: '#fff', border: 'none', cursor: 'pointer' }}>+ Añadir ítem</button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  {items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#667' }}>
                      Ingresa el primer producto/servicio :)
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                      <thead>
                        <tr style={{ textAlign: 'left', color: '#333' }}>
                          <th style={{ padding: '8px 10px' }}>Producto / Servicio</th>
                          <th style={{ padding: '8px 10px' }}>Cantidad</th>
                          <th style={{ padding: '8px 10px' }}>Precio unitario</th>
                          <th style={{ padding: '8px 10px' }}>Subtotal</th>
                          <th style={{ padding: '8px 10px' }}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((it, idx) => (
                          <tr key={it.id} style={{ borderTop: '1px solid #f1f1f1' }}>
                            <td style={{ padding: '8px 10px', width: "auto" }}>
                              <select name="productoSeleccionado" value={it.producto} onChange={(e) => updateItem(idx, 'producto', e.target.value)} style={selectStyle()} disabled={loadingProductos} required>
                                <option value="">{loadingProductos ? 'Cargando productos y servicios...' : '-- Seleccionar item --'}</option>
                                {productos.map(p => (
                                  <option key={p.productoId ?? p.id} value={p.productoId ?? p.id}>
                                    {p.nombre}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td style={{ padding: '8px 10px', width: 'auto' }}>
                              <input type="number" value={it.cantidad} onChange={(e) => updateItem(idx, 'cantidad', e.target.value)} style={inputStyle()} required />
                            </td>
                            <td style={{ padding: '8px 10px', width: 'auto' }}>
                              <input type="number" step="0.01" value={it.precioUnitario} onChange={(e) => updateItem(idx, 'precioUnitario', e.target.value)} style={inputStyle()} required />
                            </td>
                            <td style={{ padding: '8px 10px', width: 'auto' }}>{(Number(it.cantidad) * Number(it.precioUnitario || 0)).toFixed(2)}</td>
                            <td style={{ padding: '8px 10px', width: 'auto' }}>
                              <button type="button" onClick={() => removeItem(it.id)} style={{ padding: '6px 8px', borderRadius: 8, border: 'none', background: '#ff6b6b', color: '#fff', cursor: 'pointer' }}>Eliminar</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Totales crear cotización*/}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                  <div style={{ width: 400, background: '#fdfefe', padding: 20, borderRadius: 12, border: `1px solid ${PALETTE.light}`, boxShadow: '0 10px 30px rgba(43,103,119,0.08)' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: 15, color: '#2d3748' }}>Resumen de cotización</h4>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#4a5568', fontSize: 14 }}>
                      <div>Suma de productos</div>
                      <div style={{ fontWeight: 600 }}>${subtotal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#4a5568', fontSize: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>Margen de ganancia</span>
                        <span style={{ fontSize: 12, background: '#e6f3f0', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{form.margenGeneral}%</span>
                      </div>
                      <div style={{ fontWeight: 600 }}>+${(subtotal * (Number(form.margenGeneral || 0) / 100)).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>

                    <div style={{ height: 1, background: '#e9f0f4', margin: '12px 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#2d3748', fontSize: 14 }}>
                      <div style={{ fontWeight: 600 }}>Subtotal antes de impuestos</div>
                      <div style={{ fontWeight: 700 }}>${subtotalMargen.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#4a5568', fontSize: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>IVA</span>
                        <span style={{ fontSize: 12, background: '#f0f0f0', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>19%</span>
                      </div>
                      <div style={{ fontWeight: 600 }}>+${iva.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>

                    {clienteSeleccionado?.autorrentenedor === true && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#c05621', fontSize: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>Retención en la fuente</span>
                          <span style={{ fontSize: 12, background: '#fff5f0', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>10%</span>
                        </div>
                        <div style={{ fontWeight: 600 }}>-${retencion.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      </div>
                    )}

                    <div style={{ height: 2, background: PALETTE.primary, margin: '14px 0', opacity: 0.2 }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div style={{ color: '#2d3748', fontWeight: 700, fontSize: 16 }}>Total a pagar</div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: PALETTE.primary }}>
                        ${total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#4a5568', marginLeft: 6 }}>{form.monedaCotizacion}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            /* Vista de lista de cotizaciones */
            <div style={{ background: PALETTE.white, padding: 16, borderRadius: 12, border: `1px solid ${PALETTE.light}`, boxShadow: '0 12px 30px rgba(43,103,119,0.04)' }}>
              {loadingCotizaciones ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#667' }}>
                  Cargando cotizaciones...
                </div>
              ) : cotizaciones.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#667' }}>
                  No hay cotizaciones registradas.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {cotizaciones.map(cot => {
                    const detalle = cotizacionesDetalle[cot.id] || { items: [], impuestos: [] };
                    const clienteCotizacion = clientes.find(c => (c.clienteId ?? c.id) === cot.cliente);
                    const clienteNombre = clienteCotizacion?.nombre || `Cliente ${cot.cliente}`;

                    // Calcular totales
                    const subtotal = detalle.items.reduce((s, it) => s + (it.cantidad * it.precioUnitario), 0);
                    const subtotalMargen = subtotal * (1 + cot.margenGeneral / 100);
                    const ivaImpuesto = detalle.impuestos.find(imp => imp.tipo === 'IVA');
                    const retencionImpuesto = detalle.impuestos.find(imp => imp.tipo === 'RETEFUENTE');
                    const iva = ivaImpuesto ? subtotalMargen * (ivaImpuesto.porcentaje / 100) : 0;
                    const retencion = retencionImpuesto ? subtotalMargen * (retencionImpuesto.porcentaje / 100) : 0;
                    const total = subtotalMargen + iva - retencion;

                    return (
                      <div key={cot.id} style={{ border: `1px solid ${PALETTE.light}`, borderRadius: 10, padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                          <div>
                            <h3 style={{ margin: '0 0 4px 0', color: PALETTE.primary }}>Cotización #{cot.id}</h3>
                            <p style={{ margin: 0, fontSize: 14, color: '#667' }}>
                              Cliente: <strong>{clienteNombre}</strong> | Estado: <strong>{cot.estado}</strong>
                            </p>
                            <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#889' }}>
                              Creación: {cot.fechaCreacion} | Validez: {cot.fechaValidez} | Margen: {cot.margenGeneral}%
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 24, fontWeight: 800, color: PALETTE.primary }}>
                              ${total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {cot.monedaCotizacion}
                            </div>
                          </div>
                        </div>

                        {/* Items */}
                        <div style={{ marginTop: 12 }}>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#445' }}>Items:</h4>
                          {detalle.items.length === 0 ? (
                            <p style={{ margin: 0, fontSize: 13, color: '#889' }}>Sin items</p>
                          ) : (
                            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                  <th style={{ padding: '4px 8px' }}>Producto</th>
                                  <th style={{ padding: '4px 8px' }}>Cant.</th>
                                  <th style={{ padding: '4px 8px' }}>P. Unit.</th>
                                  <th style={{ padding: '4px 8px' }}>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {detalle.items.map(it => {
                                  const productoNombre = productos.find(p => (p.productoId ?? p.id) === it.producto)?.nombre || `Producto ${it.producto}`;
                                  return (
                                    <tr key={it.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                      <td style={{ padding: '4px 8px' }}>{productoNombre}</td>
                                      <td style={{ padding: '4px 8px' }}>{it.cantidad}</td>
                                      <td style={{ padding: '4px 8px' }}>{it.precioUnitario.toFixed(2)}</td>
                                      <td style={{ padding: '4px 8px' }}>{(it.cantidad * it.precioUnitario).toFixed(2)}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          )}
                        </div>

                        {/* Totales ver cotizaciones*/}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                          <div style={{ width: 400, background: '#fdfefe', padding: 20, borderRadius: 12, border: `1px solid ${PALETTE.light}`, boxShadow: '0 10px 30px rgba(43,103,119,0.08)' }}>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: 15, color: '#2d3748' }}>Resumen de cotización</h4>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#4a5568', fontSize: 14 }}>
                              <div>Suma de productos</div>
                              <div style={{ fontWeight: 600 }}>${subtotal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#4a5568', fontSize: 14 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span>Margen de ganancia</span>
                                <span style={{ fontSize: 12, background: '#e6f3f0', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{cot.margenGeneral}%</span>
                              </div>
                              <div style={{ fontWeight: 600 }}>+${(subtotal * (Number(cot.margenGeneral || 0) / 100)).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            </div>

                            <div style={{ height: 1, background: '#e9f0f4', margin: '12px 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#2d3748', fontSize: 14 }}>
                              <div style={{ fontWeight: 600 }}>Subtotal antes de impuestos</div>
                              <div style={{ fontWeight: 700 }}>${subtotalMargen.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#4a5568', fontSize: 14 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span>IVA</span>
                                <span style={{ fontSize: 12, background: '#f0f0f0', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{ivaImpuesto ? `${ivaImpuesto.porcentaje}%` : '0%'}</span>
                              </div>
                              <div style={{ fontWeight: 600 }}>+${iva.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            </div>

                            {retencionImpuesto && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#c05621', fontSize: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <span>Retención en la fuente</span>
                                  <span style={{ fontSize: 12, background: '#fff5f0', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{retencionImpuesto.porcentaje}%</span>
                                </div>
                                <div style={{ fontWeight: 600 }}>-${retencion.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                              </div>
                            )}

                            <div style={{ height: 2, background: PALETTE.primary, margin: '14px 0', opacity: 0.2 }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <div style={{ color: '#2d3748', fontWeight: 700, fontSize: 16 }}>Total a pagar</div>
                              <div style={{ fontSize: 26, fontWeight: 800, color: PALETTE.primary }}>
                                ${total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                <span style={{ fontSize: 14, fontWeight: 600, color: '#4a5568', marginLeft: 6 }}>{cot.monedaCotizacion}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: `1px solid ${PALETTE.light}`, background: 'rgba(255,255,255,0.6)' }}>
        <div style={{ color: PALETTE.primary, fontWeight: 600 }}>J^3</div>
      </div>

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
          Cotización guardada correctamente.
        </div>
      )}

    </div>
  );
}

/* helpers */
function inputStyle() {
  return { padding: '10px 12px', borderRadius: 8, border: `1px solid #e6eef0`, background: '#fff', outline: 'none' };
}
function selectStyle() {
  return { padding: '10px 12px', borderRadius: 8, border: `1px solid #e6eef0`, background: '#fff', outline: 'none' };
}