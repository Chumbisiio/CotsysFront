import React, { useState } from 'react';
import { createUsuario } from '../api/user';
import {getClientes, createCliente, updateCliente, deleteCliente} from '../api/client';


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

const IconClient = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M4 7h16v10H4V7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M8 11h8M8 14h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M7 4h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const IconBack = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function CreateUser({ user = { name: 'Usuario' }, onCancel, onLogout = () => {} }) {
  const [form, setForm] = useState({
    id_usuario: '',
    nombre: '',
    email: '',
    rol: '',
    password: '',
    activo: true
  });
  const [clientForm, setClientForm] = useState({
    id_cliente: '',
    nombre: '',
    nit: '',
    direccion: '',
    tipoRegimen: '',
    municipio: '',
    autorrentenedor: false,
  });

  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [section, setSection] = useState('usuarios');

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getClientes();   // ← Llama la API real del backend
        setClients(data);                   // ← Guarda los clientes del backend en el estado
      } catch (err) {
        console.error("Error cargando clientes:", err);
        setError("No se pudieron cargar los clientes.");
      }
    }

    load();
  }, []); 

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
      setToastMessage('Usuario guardado correctamente.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      setForm({nombre: '', email: '', rol: '', password: ''});
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      let base = typeof data === 'string' ? data : (data?.message || data?.error || data?.detail);
      let msg = base || err.message || 'Error al crear usuario';
      if (status === 403 || /registrad|duplicad/i.test(msg)) {
        msg = 'El email ya está registrado';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleClientChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClientForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (!clientForm.nombre || !clientForm.nit) {
      setError("Completa al menos nombre y NIT del cliente.");
      setLoading(false);
      return;
    }
    try {
      await createCliente({
        nombre: clientForm.nombre.trim(),
        nit: clientForm.nit.trim(),
        direccion: clientForm.direccion?.trim() || '',
        tipoRegimen: clientForm.tipoRegimen?.trim() || '',
        municipio: clientForm.municipio?.trim() || '',
        autorrentenedor: clientForm.autorrentenedor || false
      });
      
      // Recargar la lista de clientes
      const data = await getClientes();
      setClients(data);
      
      setClientForm({
        id_cliente: '',
        nombre: '',
        nit: '',
        direccion: '',
        tipoRegimen: '',
        autorrentenedor: false,
        municipio: '',
      });
      setToastMessage('Cliente guardado correctamente.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      const msg =
      err?.response?.data?.message ||
      err?.response?.data ||
      "Error al crear cliente";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const confirmLogout = () => {
    const ok = window.confirm('¿Deseas cerrar sesión?');
    if (!ok) return;
    onLogout();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: `linear-gradient(180deg, ${PALETTE.light}, ${PALETTE.gray})`,
      fontFamily: "Inter, Roboto, -apple-system, 'Segoe UI', sans-serif",
      boxSizing: 'border-box',
      animation: 'fadeSlideIn 240ms ease'
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onCancel} style={{
            background: PALETTE.primary,
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: 8,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 6px 14px rgba(43,103,119,0.18)'
          }}>
            <IconBack /> Volver
          </button>
          <div style={{ fontWeight: 700, color: PALETTE.primary }}>CotSys</div>
        </div>
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

          <button onClick={confirmLogout} style={{
            background: PALETTE.primary,
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: 8,
            cursor: 'pointer',
            boxShadow: '0 6px 14px rgba(43,103,119,0.18)'
          }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 28 }}>
        <div style={{ maxWidth: 900, width: '100%' }}>

        <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <h2 style={{ margin: 0, color: PALETTE.primary, fontSize: 26 }}>Administrar usuarios/clientes</h2>
            <p style={{ marginTop: 8, color: '#445', opacity: 0.9 }}>Selecciona la opción para gestionar usuarios o clientes.</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => setSection('usuarios')}
              style={{
                minWidth: 180,
                padding: 14,
                borderRadius: 12,
                border: section === 'usuarios' ? '2px solid #2b6777' : `1px solid ${PALETTE.light}`,
                background: section === 'usuarios' ? PALETTE.primary : '#fff',
                color: section === 'usuarios' ? '#fff' : '#234',
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: section === 'usuarios' ? '0 10px 24px rgba(43,103,119,0.18)' : '0 8px 20px rgba(0,0,0,0.06)'
              }}>
              <IconUser size={18} /> Usuarios
            </button>
            <button
              type="button"
              onClick={() => setSection('clientes')}
              style={{
                minWidth: 180,
                padding: 14,
                borderRadius: 12,
                border: section === 'clientes' ? '2px solid #2b6777' : `1px solid ${PALETTE.light}`,
                background: section === 'clientes' ? PALETTE.primary : '#fff',
                color: section === 'clientes' ? '#fff' : '#234',
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: section === 'clientes' ? '0 10px 24px rgba(43,103,119,0.18)' : '0 8px 20px rgba(0,0,0,0.06)'
              }}>
              <IconClient size={18} /> Clientes
            </button>
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

          {section === 'usuarios' && (
            <form onSubmit={handleSubmit} style={{
              background: PALETTE.white,
              padding: 20,
              borderRadius: 12,
              boxShadow: '0 12px 30px rgba(43,103,119,0.08)',
              border: `1px solid ${PALETTE.light}`,
              animation: 'fadeSlideIn 180ms ease'
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
                    <option value="ADMINISTRADOR">Administrador</option>
                    <option value="COMERCIAL">Usuario Comercial</option>
                    <option value="LIDER_TECNICO">Líder Técnico</option>
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
          )}

          {section === 'clientes' && (
            <div style={{ display: 'grid', gap: 12, animation: 'fadeSlideIn 180ms ease' }}>
              <form onSubmit={handleClientSubmit} style={{
                background: PALETTE.white,
                padding: 20,
                borderRadius: 12,
                boxShadow: '0 12px 30px rgba(43,103,119,0.08)',
                border: `1px solid ${PALETTE.light}`
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: 13 }}>ID cliente</label>
                    <input name="id_cliente" value={clientForm.id_cliente} onChange={handleClientChange} placeholder="auto (opcional)" style={inputStyle()} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: 13 }}>Nombre</label>
                    <input name="nombre" value={clientForm.nombre} onChange={handleClientChange} required style={inputStyle()} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: 13 }}>NIT</label>
                    <input name="nit" value={clientForm.nit} onChange={handleClientChange} required style={inputStyle()} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: 13 }}>Dirección</label>
                    <input name="direccion" value={clientForm.direccion} onChange={handleClientChange} style={inputStyle()} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: 13 }}>Tipo de régimen</label>
                    <input name="tipoRegimen" value={clientForm.tipoRegimen} onChange={handleClientChange} placeholder="ej: Común" style={inputStyle()} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: 13 }}>Municipio</label>
                    <input name="municipio" value={clientForm.municipio} onChange={handleClientChange} style={inputStyle()} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input id="autorrentenedor" name="autorrentenedor" type="checkbox" checked={clientForm.autorrentenedor} onChange={handleClientChange} />
                    <label htmlFor="autorrentenedor">Autorretenedor</label>
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

                  <button type="submit" disabled={loading} style={{
                    padding: '10px 16px',
                    borderRadius: 10,
                    border: 'none',
                    background: loading ? '#ccc' : PALETTE.primary,
                    color: PALETTE.white,
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 8px 18px rgba(43,103,119,0.12)'
                  }}>
                    {loading ? 'Guardando cliente...' : 'Guardar cliente'}
                  </button>
                </div>
              </form>

              <div style={{ background: '#fff', borderRadius: 12, padding: 14, border: `1px solid ${PALETTE.light}`, boxShadow: '0 12px 30px rgba(43,103,119,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ margin: 0, color: PALETTE.primary }}>Clientes</h3>
                  <span style={{ color: '#667', fontSize: 13 }}>{clients.length} en total</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
                    <thead>
                      <tr style={{ textAlign: 'left', color: '#334' }}>
                        <th style={{ padding: '8px 6px' }}>ID</th>
                        <th style={{ padding: '8px 6px' }}>Nombre</th>
                        <th style={{ padding: '8px 6px' }}>NIT</th>
                        <th style={{ padding: '8px 6px' }}>Dirección</th>
                        <th style={{ padding: '8px 6px' }}>Municipio</th>
                        <th style={{ padding: '8px 6px' }}>Régimen</th>
                        <th style={{ padding: '8px 6px' }}>Autorretenedor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map(c => (
                        <tr key={c.id_cliente} style={{ borderTop: '1px solid #f1f1f1' }}>
                          <td style={{ padding: '8px 6px' }}>{c.id_cliente}</td>
                          <td style={{ padding: '8px 6px' }}>{c.nombre}</td>
                          <td style={{ padding: '8px 6px' }}>{c.nit}</td>
                          <td style={{ padding: '8px 6px' }}>{c.direccion}</td>
                          <td style={{ padding: '8px 6px' }}>{c.municipio}</td>
                          <td style={{ padding: '8px 6px' }}>{c.tipoRegimen}</td>
                          <td style={{ padding: '8px 6px' }}>{c.autorrentenedor ? 'Sí' : 'No'}</td>
                        </tr>
                      ))}
                      {clients.length === 0 && (
                        <tr><td colSpan={7} style={{ textAlign: 'center', padding: 12, color: '#777' }}>Sin clientes aún.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

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
          {toastMessage}
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