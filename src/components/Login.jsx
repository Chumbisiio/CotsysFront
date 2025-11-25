import React, { useState } from 'react';

const PALETTE = {
  primary: '#2b6777',
  light: '#c8d8e4',
  white: '#ffffff',
  gray: '#f2f2f2',
  accent: '#52ab98'
};

export default function Login({ onLogin }) {
  const [userVal, setUserVal] = useState('');
  const [passVal, setPassVal] = useState('');

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(180deg, ${PALETTE.light}, ${PALETTE.gray})`,
      fontFamily: "Inter, Roboto, -apple-system, 'Segoe UI', sans-serif",
      padding: 24,
      boxSizing: 'border-box'
    }}>

      <main style={{
        width: 420,
        maxWidth: '96%',
        background: PALETTE.white,
        borderRadius: 14,
        boxShadow: '0 12px 30px rgba(43,103,119,0.12)',
        padding: 34,
        border: `1px solid ${PALETTE.light}`
      }}>

        <header style={{textAlign: 'center', marginBottom: 18}}>
          <h1 style={{
            margin: 0,
            fontSize: 28,
            lineHeight: '1.05',
            color: PALETTE.primary,
            fontWeight: 700
          }}>CotSys</h1>

          <div style={{
            marginTop: 6,
            fontSize: 13,
            color: PALETTE.primary,
            opacity: 0.85,
            fontWeight: 500
          }}>J^3</div>
        </header>

        <section aria-labelledby="login-form">
          <form style={{display: 'grid', gap: 12}} onSubmit={(e)=>{e.preventDefault(); onLogin && onLogin();}}>

            <label style={{fontSize: 13, color: '#223'}} htmlFor="username">Usuario</label>
            <input
              id="username"
              name="username"
              value={userVal}
              onChange={(e)=>setUserVal(e.target.value)}
              placeholder="ingresa tu usuario"
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                border: `1px solid ${PALETTE.light}`,
                background: PALETTE.gray,
                outline: 'none',
                fontSize: 14
              }}
            />

            <label style={{fontSize: 13, color: '#223'}} htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={passVal}
              onChange={(e)=>setPassVal(e.target.value)}
              placeholder="••••••••"
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                border: `1px solid ${PALETTE.light}`,
                background: PALETTE.gray,
                outline: 'none',
                fontSize: 14
              }}
            />

            <button
              type="submit"
              style={{
                marginTop: 6,
                padding: '12px 14px',
                borderRadius: 10,
                border: 'none',
                background: PALETTE.primary,
                color: PALETTE.white,
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer'
              }}
            >
              Iniciar sesión
            </button>

          </form>
        </section>

      </main>

    </div>
  );
}