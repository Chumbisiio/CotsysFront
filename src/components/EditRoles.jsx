import React, { useState } from 'react';

const PALETTE = {
  primary: '#2b6777',
  light: '#c8d8e4',
  white: '#ffffff',
  gray: '#f2f2f2',
  accent: '#52ab98'
};

const rolesDisponibles = ['administrador', 'gerente', 'operador', 'invitado'];

export default function EditRoles({ user = { name: 'Empresa - Usuario' }, onCancel }) {
  // mock de usuarios (basado en tu tabla usuario)
  const [usuarios, setUsuarios] = useState([
    { id_usuario: 1, nombre: 'María Pérez', email: 'maria@empresa.com', rol: 'administrador', estado: true },
    { id_usuario: 2, nombre: 'Juan López', email: 'juan@empresa.com', rol: 'operador', estado: true },
    { id_usuario: 3, nombre: 'Ana Gómez', email: 'ana@empresa.com', rol: 'gerente', estado: false }
  ]);

  const [editBuffer, setEditBuffer] = useState({}); // cambios temporales por usuario
  const [showToast, setShowToast] = useState(false);

  const handleRoleChange = (id, newRole) => {
    setEditBuffer(prev => ({ ...prev, [id]: { ...(prev[id] || usuarios.find(u => u.id_usuario === id)), rol: newRole } }));
  };

  const handleEstadoToggle = (id, checked) => {
    setEditBuffer(prev => ({ ...prev, [id]: { ...(prev[id] || usuarios.find(u => u.id_usuario === id)), estado: checked } }));
  };

  const applyChanges = (id) => {
    const changed = editBuffer[id];
    if (!changed) return;
    setUsuarios(prev => prev.map(u => u.id_usuario === id ? { ...u, ...changed } : u));
    const next = { ...editBuffer };
    delete next[id];
    setEditBuffer(next);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };

  const applyAll = () => {
    const updated = usuarios.map(u => editBuffer[u.id_usuario] ? { ...u, ...editBuffer[u.id_usuario] } : u);
    setUsuarios(updated);
    setEditBuffer({});
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: `linear-gradient(180deg, ${PALETTE.light}, ${PALETTE.gray})`, boxSizing: 'border-box', fontFamily: "Inter, Roboto, -apple-system, 'Segoe UI', sans-serif" }}>

      {/* Topbar */}
      <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: 'rgba(255,255,255,0.7)', borderBottom: `1px solid ${PALETTE.light}` }}>
        <div style={{ fontWeight: 700, color: PALETTE.primary }}>CotSys</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: PALETTE.gray, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontSize: 14 }}>{user.name}</div>
          </div>
          <button onClick={onCancel} style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.06)', padding: '8px 10px', borderRadius: 8, cursor: 'pointer' }}>Volver</button>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ flex: 1, padding: 20 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h2 style={{ margin: 0, color: PALETTE.primary }}>Editar roles</h2>
              <p style={{ margin: 0, color: '#445', opacity: 0.9 }}>Asigna o modifica roles y el estado de los usuarios (visual).</p>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={applyAll} style={{ padding: '10px 12px', borderRadius: 10, border: 'none', background: PALETTE.primary, color: '#fff', cursor: 'pointer' }}>Aplicar todos</button>
            </div>
          </div>

          <div style={{ background: PALETTE.white, borderRadius: 12, padding: 14, border: `1px solid ${PALETTE.light}`, boxShadow: '0 12px 30px rgba(43,103,119,0.04)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#334' }}>
                  <th style={{ padding: '10px 8px' }}>ID</th>
                  <th style={{ padding: '10px 8px' }}>Nombre</th>
                  <th style={{ padding: '10px 8px' }}>Email</th>
                  <th style={{ padding: '10px 8px' }}>Rol</th>
                  <th style={{ padding: '10px 8px' }}>Estado</th>
                  <th style={{ padding: '10px 8px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => {
                  const pending = editBuffer[u.id_usuario] || {};
                  const rolValue = pending.rol ?? u.rol;
                  const estadoValue = (typeof pending.estado === 'boolean') ? pending.estado : u.estado;

                  return (
                    <tr key={u.id_usuario} style={{ borderTop: '1px solid #f1f1f1' }}>
                      <td style={{ padding: '10px 8px', width: 60 }}>{u.id_usuario}</td>
                      <td style={{ padding: '10px 8px' }}>{u.nombre}</td>
                      <td style={{ padding: '10px 8px' }}>{u.email}</td>

                      <td style={{ padding: '10px 8px', width: 200 }}>
                        <select value={rolValue} onChange={(e) => handleRoleChange(u.id_usuario, e.target.value)} style={selectStyle()}>
                          <option value="">-- seleccionar --</option>
                          {rolesDisponibles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>

                      <td style={{ padding: '10px 8px', width: 120 }}>
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          <input type="checkbox" checked={estadoValue} onChange={(e) => handleEstadoToggle(u.id_usuario, e.target.checked)} />
                          <span style={{ fontSize: 13 }}>{estadoValue ? 'Activo' : 'Inactivo'}</span>
                        </label>
                      </td>

                      <td style={{ padding: '10px 8px', width: 180 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => applyChanges(u.id_usuario)} style={{ padding: '8px 10px', borderRadius: 8, border: 'none', background: PALETTE.primary, color: '#fff', cursor: 'pointer' }}>Guardar</button>
                          <button onClick={() => { const next = { ...editBuffer }; delete next[u.id_usuario]; setEditBuffer(next); }} style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${PALETTE.light}`, background: 'transparent', cursor: 'pointer' }}>Revertir</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: `1px solid ${PALETTE.light}`, background: 'rgba(255,255,255,0.6)' }}>
        <div style={{ color: PALETTE.primary, fontWeight: 600 }}>J^3</div>
      </div>

      {/* Toast */}
      {showToast && (
        <div style={{ position: 'fixed', right: 20, bottom: 80, background: PALETTE.primary, color: '#fff', padding: '10px 14px', borderRadius: 10, boxShadow: '0 8px 20px rgba(0,0,0,0.16)' }}>Cambios aplicados (simulación)</div>
      )}

    </div>
  );
}

function selectStyle() {
  return { width: '100%', padding: '8px 10px', borderRadius: 8, border: `1px solid #e6eef0`, background: '#fff', outline: 'none' };
}
