import React, { useMemo, useState } from 'react';

const PALETTE = {
  primary: '#2b6777',
  light: '#c8d8e4',
  white: '#ffffff',
  gray: '#f2f2f2',
  accent: '#52ab98'
};

const IconSave = ({size=16}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 3h14v16H5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M7 7h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
);

export default function Cotizacion({ user = { name: 'Empresa - Usuario' }, onCancel }) {
  // campos principales (visual)
  const [form, setForm] = useState({
    id_cotizacion: '',
    estado: 'Borrador',
    fechaCreacion: new Date().toISOString().slice(0,10),
    fechaValidez: '',
    margenGeneral: 10.00,
    monedaCotizacion: 'COP',
    usuario: '1',
    cliente: ''
  });

  // items (líneas)
  const [items, setItems] = useState([
    { id: 1, producto: 'Kit A', cantidad: 1, precioUnitario: 1200.00 },
    { id: 2, producto: 'Componente B', cantidad: 2, precioUnitario: 45.5 }
  ]);

  const updateForm = (e) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const updateItem = (idx, key, value) => {
    setItems(prev => prev.map((it, i) => i===idx ? { ...it, [key]: key === 'cantidad' || key === 'precioUnitario' ? Number(value) : value } : it));
  };

  const addItem = () => {
    const newId = items.length ? Math.max(...items.map(i=>i.id))+1 : 1;
    setItems(prev => [...prev, { id: newId, producto: '', cantidad: 1, precioUnitario: 0 }]);
  };
  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const subtotal = useMemo(() => items.reduce((s,it) => s + (Number(it.cantidad) * Number(it.precioUnitario || 0)), 0), [items]);
  const total = useMemo(() => subtotal * (1 + (Number(form.margenGeneral||0)/100)), [subtotal, form.margenGeneral]);

  const handleSave = (e) => {
    e.preventDefault();
    // Visual only: mostrar un toast o console
    console.log('Simulación: cotización guardada', { form, items, total });
    alert('Simulación: cotización guardada (sin backend).');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: `linear-gradient(180deg, ${PALETTE.light}, ${PALETTE.gray})`,
      boxSizing: 'border-box',
      fontFamily: "Inter, Roboto, -apple-system, 'Segoe UI', sans-serif"
    }}>
      {/* Topbar */}
      <div style={{
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', background: 'rgba(255,255,255,0.7)', borderBottom: `1px solid ${PALETTE.light}`
      }}>
        <div style={{fontWeight:700, color: PALETTE.primary}}>CotSys</div>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <div style={{width:36, height:36, borderRadius:18, background:PALETTE.gray, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{fontSize:14}}>{user.name}</div>
          </div>
          <button onClick={onCancel} style={{background:'transparent', border:'1px solid rgba(0,0,0,0.06)', padding:'8px 10px', borderRadius:8, cursor:'pointer'}}>Volver</button>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1, padding:20}}>
        <div style={{maxWidth:1200, margin:'0 auto'}}>

          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
            <div>
              <h2 style={{margin:0, color:PALETTE.primary}}>Nueva Cotización</h2>
              <p style={{margin:0, color:'#445', opacity:0.9}}>Formulario visual — basado en tu tabla de cotización.</p>
            </div>

            <div style={{display:'flex', gap:12}}>
              <button onClick={handleSave} style={{display:'inline-flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:10, border:'none', background:PALETTE.primary, color:'#fff', cursor:'pointer'}}>
                <IconSave/> Guardar (simulación)
              </button>
            </div>
          </div>

          {/* Formulario principal */}
          <form onSubmit={handleSave} style={{background:PALETTE.white, padding:16, borderRadius:12, border:`1px solid ${PALETTE.light}`, boxShadow:'0 12px 30px rgba(43,103,119,0.04)'}}>

            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12, alignItems:'center', marginBottom:12}}>
              <div style={{display:'flex', flexDirection:'column'}}>
                <label style={{fontSize:13}}>ID cotización</label>
                <input name="id_cotizacion" value={form.id_cotizacion} onChange={updateForm} placeholder="auto (opcional)" style={inputStyle()} />
              </div>

              <div style={{display:'flex', flexDirection:'column'}}>
                <label style={{fontSize:13}}>Estado</label>
                <select name="estado" value={form.estado} onChange={updateForm} style={selectStyle()}>
                  <option>Borrador</option>
                  <option>Enviado</option>
                  <option>Aceptado</option>
                  <option>Rechazado</option>
                </select>
              </div>

              <div style={{display:'flex', flexDirection:'column'}}>
                <label style={{fontSize:13}}>Moneda</label>
                <input name="monedaCotizacion" value={form.monedaCotizacion} onChange={updateForm} style={inputStyle()} />
              </div>

              <div style={{display:'flex', flexDirection:'column'}}>
                <label style={{fontSize:13}}>Fecha creación</label>
                <input type="date" name="fechaCreacion" value={form.fechaCreacion} onChange={updateForm} style={inputStyle()} />
              </div>

              <div style={{display:'flex', flexDirection:'column'}}>
                <label style={{fontSize:13}}>Fecha validez</label>
                <input type="date" name="fechaValidez" value={form.fechaValidez} onChange={updateForm} style={inputStyle()} />
              </div>

              <div style={{display:'flex', flexDirection:'column'}}>
                <label style={{fontSize:13}}>Margen general (%)</label>
                <input type="number" step="0.01" name="margenGeneral" value={form.margenGeneral} onChange={updateForm} style={inputStyle()} />
              </div>

              <div style={{gridColumn:'1 / -1', display:'flex', gap:12}}>
                <div style={{flex:1, display:'flex', flexDirection:'column'}}>
                  <label style={{fontSize:13}}>Usuario (ID)</label>
                  <input name="usuario" value={form.usuario} onChange={updateForm} style={inputStyle()} />
                </div>

                <div style={{flex:1, display:'flex', flexDirection:'column'}}>
                  <label style={{fontSize:13}}>Cliente (ID)</label>
                  <input name="cliente" value={form.cliente} onChange={updateForm} style={inputStyle()} />
                </div>
              </div>
            </div>

            {/* Items: tabla simple */}
            <div style={{marginTop:8}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
                <h4 style={{margin:0}}>Items</h4>
                <button type="button" onClick={addItem} style={{padding:'8px 10px', borderRadius:8, background:PALETTE.accent, color:'#fff', border:'none', cursor:'pointer'}}>+ Añadir ítem</button>
              </div>

              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%', borderCollapse:'collapse', minWidth:900}}>
                  <thead>
                    <tr style={{textAlign:'left', color:'#333'}}>
                      <th style={{padding:'8px 10px'}}>Producto</th>
                      <th style={{padding:'8px 10px'}}>Cantidad</th>
                      <th style={{padding:'8px 10px'}}>Precio unitario</th>
                      <th style={{padding:'8px 10px'}}>Subtotal</th>
                      <th style={{padding:'8px 10px'}}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, idx) => (
                      <tr key={it.id} style={{borderTop:'1px solid #f1f1f1'}}>
                        <td style={{padding:'8px 10px'}}>
                          <input value={it.producto} onChange={(e)=>updateItem(idx,'producto', e.target.value)} placeholder="Nombre producto" style={inputStyle()} />
                        </td>
                        <td style={{padding:'8px 10px', width:120}}>
                          <input type="number" value={it.cantidad} onChange={(e)=>updateItem(idx,'cantidad', e.target.value)} style={inputStyle()} />
                        </td>
                        <td style={{padding:'8px 10px', width:160}}>
                          <input type="number" step="0.01" value={it.precioUnitario} onChange={(e)=>updateItem(idx,'precioUnitario', e.target.value)} style={inputStyle()} />
                        </td>
                        <td style={{padding:'8px 10px', width:140}}>{(Number(it.cantidad) * Number(it.precioUnitario || 0)).toFixed(2)}</td>
                        <td style={{padding:'8px 10px', width:140}}>
                          <button type="button" onClick={()=>removeItem(it.id)} style={{padding:'6px 8px', borderRadius:8, border:'none', background:'#ff6b6b', color:'#fff', cursor:'pointer'}}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totales */}
              <div style={{display:'flex', justifyContent:'flex-end', marginTop:12}}>
                <div style={{width:320, background:'#fbfcfd', padding:12, borderRadius:8, border:`1px solid ${PALETTE.light}`}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}><div>Subtotal</div><div>{subtotal.toFixed(2)}</div></div>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}><div>Margen ({form.margenGeneral} %)</div><div>{(subtotal * (Number(form.margenGeneral||0)/100)).toFixed(2)}</div></div>
                  <div style={{height:1, background:'#eef4f6', margin:'8px 0'}} />
                  <div style={{display:'flex', justifyContent:'space-between', fontWeight:700}}><div>Total ({form.monedaCotizacion})</div><div>{total.toFixed(2)}</div></div>
                </div>
              </div>
            </div>
          </form>

        </div>
      </div>

      {/* Footer */}
      <div style={{height:56, display:'flex', alignItems:'center', justifyContent:'center', borderTop:`1px solid ${PALETTE.light}`, background:'rgba(255,255,255,0.6)'}}>
        <div style={{color:PALETTE.primary, fontWeight:600}}>J^3</div>
      </div>
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