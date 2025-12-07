import React, { useState, useEffect } from 'react';
import { getUsuarios, updateUsuarios } from '../api/user';

const PALETTE = {
  primary: '#2b6777',
  light: '#c8d8e4',
  white: '#ffffff',
  gray: '#f2f2f2',
  accent: '#52ab98'
};

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

const rolesDisponibles = ['Administrador', 'Comercial', 'Técnico'];

export default function EditRoles({ user = { name: 'Empresa - Usuario' }, onCancel, onLogout = () => {} }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editBuffer, setEditBuffer] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUsuarios();
        console.log('[EditRoles] Data raw del backend:', data);
        console.log('[EditRoles] Tipo de data:', typeof data, 'Es array?', Array.isArray(data));
        if (data.length > 0) {
          console.log('[EditRoles] Primer usuario completo:', data[0]);
          console.log('[EditRoles] Claves del primer usuario:', Object.keys(data[0]));
        }
        
        const normalized = (Array.isArray(data) ? data : []).map(u => ({
          id_usuario: u.usuarioId ?? u.id_usuario ?? u.id ?? null,
          nombre: u.nombre ?? '',
          email: u.email ?? '',
          rol: u.rol ?? '',
          estado: u.estado ?? false
        })).filter(u => u.id_usuario !== null);
        
        console.log('[EditRoles] Usuarios normalizados:', normalized);
        setUsuarios(normalized);
      } catch (err) {
        const msg = err?.response?.data?.message || err.message || 'Error al cargar usuarios';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const handleRoleChange = (id, newRole) => {
    setEditBuffer(prev => ({ ...prev, [id]: { ...(prev[id] || usuarios.find(u => u.id_usuario === id)), rol: newRole } }));
  };

  const handleEstadoToggle = (id, checked) => {
    setEditBuffer(prev => ({ ...prev, [id]: { ...(prev[id] || usuarios.find(u => u.id_usuario === id)), estado: checked } }));
  };

  const applyChanges = async (id) => {
    const changed = editBuffer[id];
    if (!changed) return;
    
    setSaving(true);
    setError(null);
    try {
      const payload = [{
        email: changed.email,
        rol: changed.rol,
        estado: changed.estado
      }];
      
      await updateUsuarios(payload);
      
      // Recarga la lista de usuarios desde el backend
      const data = await getUsuarios();
      const normalized = (Array.isArray(data) ? data : []).map(u => ({
        id_usuario: u.usuarioId ?? u.id_usuario ?? u.id ?? null,
        nombre: u.nombre ?? '',
        email: u.email ?? '',
        rol: u.rol ?? '',
        estado: u.estado ?? false
      })).filter(u => u.id_usuario !== null);
      
      setUsuarios(normalized);
      const next = { ...editBuffer };
      delete next[id];
      setEditBuffer(next);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1800);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Error al guardar cambios';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const applyAll = async () => {
    if (Object.keys(editBuffer).length === 0) return;
    
    setSaving(true);
    setError(null);
    try {
      const payload = Object.values(editBuffer).map(u => ({
        email: u.email,
        rol: u.rol,
        estado: u.estado
      }));
      
      await updateUsuarios(payload);
      
      // Recarga la lista de usuarios desde el backend
      const data = await getUsuarios();
      const normalized = (Array.isArray(data) ? data : []).map(u => ({
        id_usuario: u.usuarioId ?? u.id_usuario ?? u.id ?? null,
        nombre: u.nombre ?? '',
        email: u.email ?? '',
        rol: u.rol ?? '',
        estado: u.estado ?? false
      })).filter(u => u.id_usuario !== null);
      
      setUsuarios(normalized);
      setEditBuffer({});
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1800);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Error al guardar cambios';
      setError(msg);
    } finally {
      setSaving(false);
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
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h2 style={{ margin: 0, color: PALETTE.primary }}>Editar roles </h2>
              <p style={{ margin: 0, color: '#445', opacity: 0.9 }}>Asigna o modifica roles y el estado de los usuarios.</p>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={applyAll} disabled={saving} style={{ padding: '10px 12px', borderRadius: 10, border: 'none', background: PALETTE.primary, color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>{saving ? 'Guardando...' : 'Aplicar todos'}</button>
            </div>
          </div>

          <div style={{ background: PALETTE.white, borderRadius: 12, padding: 14, border: `1px solid ${PALETTE.light}`, boxShadow: '0 12px 30px rgba(43,103,119,0.04)' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: PALETTE.primary }}>
                <div style={{ marginBottom: 12 }}>Cargando usuarios...</div>
              </div>
            ) : usuarios.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#667' }}>
                No hay usuarios disponibles
              </div>
            ) : (
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
                          <button onClick={() => applyChanges(u.id_usuario)} disabled={saving} style={{ padding: '8px 10px', borderRadius: 8, border: 'none', background: PALETTE.primary, color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>{saving ? 'Guardando...' : 'Guardar'}</button>
                          <button onClick={() => { const next = { ...editBuffer }; delete next[u.id_usuario]; setEditBuffer(next); }} style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${PALETTE.light}`, background: 'transparent', cursor: 'pointer' }}>Revertir</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            )}
          </div>

        </div>
      </div>

      <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: `1px solid ${PALETTE.light}`, background: 'rgba(255,255,255,0.6)' }}>
        <div style={{ color: PALETTE.primary, fontWeight: 600 }}>J^3</div>
      </div>

      {showToast && (
        <div style={{ position: 'fixed', right: 20, bottom: 80, background: PALETTE.primary, color: '#fff', padding: '10px 14px', borderRadius: 10, boxShadow: '0 8px 20px rgba(0,0,0,0.16)' }}>Cambios aplicados</div>
      )}

    </div>
  );
}

function selectStyle() {
  return { width: '100%', padding: '8px 10px', borderRadius: 8, border: `1px solid #e6eef0`, background: '#fff', outline: 'none' };
}
