import React, { useState } from 'react';

const PALETTE_HOME = {
  primary: '#2b6777',
  light: '#c8d8e4',
  white: '#ffffff',
  gray: '#f2f2f2',
  accent: '#52ab98'
};

const IconPlus = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconBox = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M3 7.5L12 3l9 4.5v7L12 21 3 14.5v-7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

const IconUser = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M20 21v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const IconProduct = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Home({ user = { name: 'Usuario' }, onLogout, onNavigate }) {
  const cards = [
    { id: 1, title: 'Crear cotización', color: PALETTE_HOME.primary, icon: <IconPlus /> },
    { id: 2, title: 'Administrar productos', color: PALETTE_HOME.primary, icon: <IconProduct /> },
    { id: 3, title: 'Crear usuarios', color: PALETTE_HOME.primary, icon: <IconUser /> },
    { id: 4, title: 'Editar roles', color: PALETTE_HOME.primary, icon: <IconBox /> }
  ];

  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: `linear-gradient(180deg, ${PALETTE_HOME.light}, ${PALETTE_HOME.gray})`,
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
        borderBottom: `1px solid ${PALETTE_HOME.light}`
      }}>
        <div style={{ fontWeight: 700, color: PALETTE_HOME.primary }}>CotSys</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2b2b2b' }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: PALETTE_HOME.gray, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconUser size={18} />
            </div>
            <div style={{ fontSize: 14 }}>{user.name}</div>
          </div>

          <button onClick={onLogout} style={{
            background: 'transparent',
            border: '1px solid rgba(0,0,0,0.06)',
            padding: '8px 10px',
            borderRadius: 8,
            cursor: 'pointer'
          }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ maxWidth: 1100, width: '100%' }}>

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0, color: PALETTE_HOME.primary, fontSize: 28 }}>Bienvenido a CotSys</h2>
            <p style={{ marginTop: 8, color: '#445', opacity: 0.9 }}>¿Qué desea realizar hoy?</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {cards.map(card => (
              <div
                key={card.id}
                role={(card.id === 2 || card.id === 3) ? 'button' : undefined}
                onClick={() => {
                  if (card.id === 1 && onNavigate) onNavigate('cotizacion');
                  if (card.id === 3 && onNavigate) onNavigate('createUser');
                  if (card.id === 2 && onNavigate) onNavigate('manageProducts');
                  if (card.id === 4 && onNavigate) onNavigate('editRoles');
                }}
                onMouseEnter={() => setHovered(card.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  minHeight: 180,
                  borderRadius: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 24,
                  boxShadow: hovered === card.id ? '0 14px 34px rgba(0,0,0,0.12)' : '0 8px 20px rgba(0,0,0,0.06)',
                  transform: hovered === card.id ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
                  transition: 'all 220ms cubic-bezier(.2,.9,.2,1)',
                  background: '#fff',
                  border: `1px solid ${PALETTE_HOME.light}`,
                  color: '#123',
                  textAlign: 'center',
                  cursor: (card.id === 2 || card.id === 3) ? 'pointer' : 'default'
                }}
              >
                <div style={{
                  width: 84,
                  height: 84,
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: card.color,
                  color: '#fff',
                  marginBottom: 14
                }}>
                  {card.icon}
                </div>

                <div style={{ fontSize: 16, fontWeight: 700, color: '#234' }}>{card.title}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: `1px solid ${PALETTE_HOME.light}`, background: 'rgba(255,255,255,0.6)' }}>
        <div style={{ color: PALETTE_HOME.primary, fontWeight: 600 }}>J^3</div>
      </div>
    </div>
  );
}