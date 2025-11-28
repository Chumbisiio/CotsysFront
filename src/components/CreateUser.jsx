import React, { useState } from 'react';
import { createUsuario } from '../api/auth';

const PALETTE = {
  primary: '#2b6777',
  light: '#c8d8e4',
  white: '#ffffff',
  gray: '#f2f2f2',
  accent: '#52ab98'
};

const IconUser = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M20 21v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export default function CreateUser({ user = { name: 'Usuario' }, onCancel }) {
  const [form, setForm] = useState({
    id_usuario: '',
    nombre: '',
    email: '',
    rol: '',
    password: '',
    activo: true
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createUsuario({
        nombre: form.nombre,
        email: form.email,
        rol: form.rol,
        password: form.password
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      setForm({nombre: '', email: '', rol: '', password: ''});
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      let base = typeof data === 'string' ? data : (data?.message || data?.error || data?.detail);
      let msg = base || err.message || 'Error al crear usuario';
      // Duplicado de email detectado por status o por mensaje
      if (status === 403 || /registrad|duplicad/i.test(msg)) {
        msg = 'El email ya está registrado';
      }
      setError(msg);
      console.error('[CreateUser] Error creación:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: `linear-gradient(180deg, ${PALETTE.light}, ${PALETTE.gray})`,
      fontFamily: "Inter, Roboto, -apple-system, 'Segoe UI', sans-serif",
      boxSizing: 'border-box'
    }}>

      <div style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        background: 'rgba(255,255,255,0.7)',
        borderBottom: `1px solid ${PALETTE.light}`
      }}>
        <div style={{ fontWeight: 700, color: PALETTE.primary }}>CotSys</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2b2b2b' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18,
              background: PALETTE.gray, display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <IconUser size={16} />
            </div>
            <div style={{ fontSize: 14 }}>{user.name}</div>
          </div>

          <button onClick={onCancel} style={{
            background: 'transparent',
            border: '1px solid rgba(0,0,0,0.06)',
            padding: '8px 10px',
            borderRadius: 8,
            cursor: 'pointer'
          }}>
            Volver
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 28 }}>
        <div style={{ maxWidth: 900, width: '100%' }}>

          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <h2 style={{ margin: 0, color: PALETTE.primary, fontSize: 26 }}>Crear usuario</h2>
            <p style={{ marginTop: 8, color: '#445', opacity: 0.9 }}>Rellena los datos del nuevo usuario.</p>
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

          <form onSubmit={handleSubmit} style={{
            background: PALETTE.white,
            padding: 20,
            borderRadius: 12,
            boxShadow: '0 12px 30px rgba(43,103,119,0.08)',
            border: `1px solid ${PALETTE.light}`
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
              alignItems: 'center'
            }}>

              <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13, marginBottom: 6 }}>Nombre</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre completo" required style={inputStyle()}/>
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13, marginBottom: 6 }}>Rol</label>
                <select name="rol" value={form.rol} onChange={handleChange} required style={selectStyle()}>
                  <option value="">Seleccionar rol</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Comercial">Usuario Comercial</option>
                  <option value="Técnico">Líder Tecnico</option>
                  <option value="Gerente">Gerente</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13, marginBottom: 6 }}>Email</label>
                <input name="email" value={form.email} onChange={handleChange} placeholder="correo@inst.com" required style={inputStyle()}/>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 13, marginBottom: 6 }}>Contraseña</label>
                <input name="password" value={form.password} onChange={handleChange} placeholder="********" type="password" required style={inputStyle()}/>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
              <button type="button" onClick={onCancel} style={{
                padding: '10px 14px',
                borderRadius: 10,
                border: `1px solid ${PALETTE.light}`,
                background: 'transparent',
                cursor: 'pointer'
              }}>
                Cancelar
              </button>

              <button type="submit" style={{
                padding: '10px 16px',
                borderRadius: 10,
                border: 'none',
                background: PALETTE.primary,
                color: PALETTE.white,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 18px rgba(43,103,119,0.12)'
              }}>
                {loading ? 'Creando usuario...' : 'Guardar usuario'}
              </button>
            </div>
          </form>

        </div>
      </div>

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
          Usuario guardado correctamente.
        </div>
      )}

    </div>
  );
}

function inputStyle() {
  return {
    padding: '12px 14px',
    borderRadius: 10,
    border: `1px solid ${PALETTE.light}`,
    background: PALETTE.gray,
    outline: 'none',
    fontSize: 14
  };
}
function selectStyle() {
  return {
    padding: '11px 12px',
    borderRadius: 10,
    border: `1px solid ${PALETTE.light}`,
    background: PALETTE.white,
    outline: 'none',
    fontSize: 14
  };
}