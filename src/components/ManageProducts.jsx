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

export default function ManageProducts({ user = { name: 'Usuario' }, onCancel }) {
  const [products, setProducts] = useState([
    { id_producto: 1, nombre: 'Kit A', descripcion: 'Kit básico', categoria: 'Soluciones', unidadMedida: 'unidad', costoBase: 1200.00, monedaOriginal: 'COP', tipo: 'kit', estado: true, cantidadKit: 1, instruccionesKit: 'Usar con cuidado', kitSolucion: 1001 },
    { id_producto: 2, nombre: 'Producto B', descripcion: 'Componente B', categoria: 'Componentes', unidadMedida: 'kg', costoBase: 45.50, monedaOriginal: 'USD', tipo: 'componente', estado: true, cantidadKit: 0, instruccionesKit: '', kitSolucion: 0 }
  ]);

  const [editing, setEditing] = useState(null); 
  const [showForm, setShowForm] = useState(false);

  // formulario local
  const emptyForm = { id_producto: '', nombre: '', descripcion: '', categoria: '', unidadMedida: '', costoBase: '', monedaOriginal: '', tipo: '', estado: true, cantidadKit: 0, instruccionesKit: '', kitSolucion: '' };
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditing(p); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(emptyForm); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editing) {
      setProducts(prev => prev.map(p => p.id_producto === editing.id_producto ? { ...editing, ...form, costoBase: Number(form.costoBase) } : p));
    } else {
      const newId = products.length ? Math.max(...products.map(p => p.id_producto)) + 1 : 1;
      setProducts(prev => [...prev, { ...form, id_producto: newId, costoBase: Number(form.costoBase) }]);
    }
    closeForm();
  };

  const handleDelete = (id) => {
    if (!window.confirm('Eliminar producto (simulación)?')) return;
    setProducts(prev => prev.filter(p => p.id_producto !== id));
  };

  return (
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', background: `linear-gradient(180deg, ${PALETTE.light}, ${PALETTE.gray})`, boxSizing: 'border-box', fontFamily: "Inter, Roboto, -apple-system, 'Segoe UI', sans-serif"}}>

      <div style={{height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: 'rgba(255,255,255,0.7)', borderBottom: `1px solid ${PALETTE.light}`}}>
        <div style={{fontWeight: 700, color: PALETTE.primary}}>CotSys</div>
        <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <div style={{width: 36, height: 36, borderRadius: 18, background: PALETTE.gray, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{fontSize: 14}}>{user.name}</div>
          </div>

          <button onClick={onCancel} style={{background: 'transparent', border: '1px solid rgba(0,0,0,0.06)', padding: '8px 10px', borderRadius: 8, cursor: 'pointer'}}>Volver</button>
        </div>
      </div>

      <div style={{flex: 1, padding: 20}}>
        <div style={{maxWidth: 1200, margin: '0 auto'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18}}>
            <div>
              <h2 style={{margin: 0, color: PALETTE.primary}}>Administrar productos</h2>
              <p style={{margin: 0, color: '#445', opacity: 0.9}}>Crea, edita o elimina productos (simulación visual).</p>
            </div>
            <div>
              <button onClick={openCreate} style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, border: 'none', background: PALETTE.primary, color: '#fff', cursor: 'pointer'}}>
                <IconPlus />
                Nuevo producto
              </button>
            </div>
          </div>

          <div style={{background: '#fff', borderRadius: 12, padding: 16, border: `1px solid ${PALETTE.light}`, boxShadow: '0 12px 30px rgba(43,103,119,0.04)'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{textAlign: 'left', color: '#334'}}>
                  <th style={{padding: '10px 8px'}}>ID</th>
                  <th style={{padding: '10px 8px'}}>Nombre</th>
                  <th style={{padding: '10px 8px'}}>Categoria</th>
                  <th style={{padding: '10px 8px'}}>Unidad</th>
                  <th style={{padding: '10px 8px'}}>Costo</th>
                  <th style={{padding: '10px 8px'}}>Moneda</th>
                  <th style={{padding: '10px 8px'}}>Tipo</th>
                  <th style={{padding: '10px 8px'}}>Estado</th>
                  <th style={{padding: '10px 8px'}}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id_producto} style={{borderTop: '1px solid #f1f1f1'}}>
                    <td style={{padding: '10px 8px'}}>{p.id_producto}</td>
                    <td style={{padding: '10px 8px'}}>{p.nombre}</td>
                    <td style={{padding: '10px 8px'}}>{p.categoria}</td>
                    <td style={{padding: '10px 8px'}}>{p.unidadMedida}</td>
                    <td style={{padding: '10px 8px'}}>{Number(p.costoBase).toFixed(2)}</td>
                    <td style={{padding: '10px 8px'}}>{p.monedaOriginal}</td>
                    <td style={{padding: '10px 8px'}}>{p.tipo}</td>
                    <td style={{padding: '10px 8px'}}>{p.estado ? 'Activo' : 'Inactivo'}</td>
                    <td style={{padding: '10px 8px'}}>
                      <div style={{display: 'flex', gap: 8}}>
                        <button onClick={() => openEdit(p)} style={{padding: '6px 8px', borderRadius: 8, border: `1px solid ${PALETTE.light}`, background: 'transparent', cursor: 'pointer'}}>Editar</button>
                        <button onClick={() => handleDelete(p.id_producto)} style={{padding: '6px 8px', borderRadius: 8, border: 'none', background: '#ff6b6b', color: '#fff', cursor: 'pointer'}}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      <div style={{height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: `1px solid ${PALETTE.light}`, background: 'rgba(255,255,255,0.6)'}}>
        <div style={{color: PALETTE.primary, fontWeight: 600}}>J^3</div>
      </div>

      {showForm && (
        <div style={{position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.28)'}}>
          <div style={{width: 920, maxWidth: '96%', background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.3)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
              <h3 style={{margin: 0, color: PALETTE.primary}}>{editing ? 'Editar producto' : 'Nuevo producto'}</h3>
              <button onClick={closeForm} style={{background: 'transparent', border: 'none', cursor: 'pointer'}}>Cerrar</button>
            </div>

            <form onSubmit={handleSave} style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12}}>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <label style={{fontSize: 13}}>ID producto</label>
                <input name="id_producto" value={form.id_producto} onChange={handleChange} placeholder="auto (opcional)" style={inputStyle()} />
              </div>

              <div style={{display: 'flex', flexDirection: 'column'}}>
                <label style={{fontSize: 13}}>Nombre</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} required style={inputStyle()} />
              </div>

              <div style={{display: 'flex', flexDirection: 'column'}}>
                <label style={{fontSize: 13}}>Categoria</label>
                <input name="categoria" value={form.categoria} onChange={handleChange} style={inputStyle()} />
              </div>

              <div style={{display: 'flex', flexDirection: 'column'}}>
                <label style={{fontSize: 13}}>Unidad de medida</label>
                <input name="unidadMedida" value={form.unidadMedida} onChange={handleChange} style={inputStyle()} />
              </div>

              <div style={{display: 'flex', flexDirection: 'column'}}>
                <label style={{fontSize: 13}}>Costo base</label>
                <input name="costoBase" value={form.costoBase} onChange={handleChange} type="number" step="0.01" style={inputStyle()} />
              </div>

              <div style={{display: 'flex', flexDirection: 'column'}}>
                <label style={{fontSize: 13}}>Moneda original</label>
                <input name="monedaOriginal" value={form.monedaOriginal} onChange={handleChange} style={inputStyle()} />
              </div>

              <div style={{gridColumn: '1 / -1', display: 'flex', flexDirection: 'column'}}>
                <label style={{fontSize: 13}}>Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} style={{...inputStyle(), resize: 'vertical'}} />
              </div>

              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <input id="estado" name="estado" type="checkbox" checked={form.estado} onChange={handleChange} />
                <label htmlFor="estado">Activo</label>
              </div>

              <div style={{display: 'flex', flexDirection: 'column'}}>
                <label>Cantidad kit</label>
                <input name="cantidadKit" value={form.cantidadKit} onChange={handleChange} type="number" style={inputStyle()} />
              </div>

              <div style={{display: 'flex', flexDirection: 'column'}}>
                <label>Instrucciones kit</label>
                <input name="instruccionesKit" value={form.instruccionesKit} onChange={handleChange} style={inputStyle()} />
              </div>

              <div style={{display: 'flex', flexDirection: 'column'}}>
                <label>Kit solución (ID)</label>
                <input name="kitSolucion" value={form.kitSolucion} onChange={handleChange} style={inputStyle()} />
              </div>

              <div style={{gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8}}>
                <button type="button" onClick={closeForm} style={{padding: '8px 12px', borderRadius: 8, border: `1px solid ${PALETTE.light}`, background: 'transparent'}}>Cancelar</button>
                <button type="submit" style={{padding: '8px 12px', borderRadius: 8, border: 'none', background: PALETTE.primary, color: '#fff'}}>Guardar</button>
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