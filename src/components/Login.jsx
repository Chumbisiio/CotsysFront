import React, { useState } from 'react';
import { login } from '../api/auth';
import { setTokens, getSessionUser } from '../auth/tokenStore';

const PALETTE = {
  primary: '#2b6777',
  light: '#c8d8e4',
  white: '#ffffff',
  gray: '#f2f2f2',
  accent: '#52ab98'
};

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setShowError(false);

    if (!email.trim() || !password.trim()) {
      setError('Por favor completa usuario y contraseña.');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      const tokens = await login({ email, password });
      setTokens(tokens.access_token, tokens.refresh_token);
      const sessionUser = getSessionUser();
      // Notificar al parent para cambiar la vista sin recargar.
      if (typeof onLogin === 'function') {
        onLogin(sessionUser);
      } else {
        // Fallback: recarga (mantendrá login porque App.jsx inicia en 'login').
        window.location.href = '/';
      }
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      let msg = typeof data === 'string' ? data : (data?.message || err.message || 'Error de autenticación');
      if (status === 401 || status === 403) msg = 'Credenciales inválidas. Verifica usuario y contraseña.';
      if (status === 0 || err.message?.includes('Network')) msg = 'No hay conexión con el servidor. Intenta de nuevo.';
      setError(msg);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

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

        <header style={{ textAlign: 'center', marginBottom: 18 }}>
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
          {showError && error && (
            <div role="alert" style={{
              marginBottom: 12,
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
          <form style={{ display: 'grid', gap: 12 }} onSubmit={handleSubmit}>

            <label style={{ fontSize: 13, color: '#223' }} htmlFor="username">Usuario</label>
            <input
              id="username"
              name="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ingresa tu usuario"
              required
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                border: `1px solid ${PALETTE.light}`,
                background: PALETTE.gray,
                outline: 'none',
                fontSize: 14
              }}
            />

            <label style={{ fontSize: 13, color: '#223' }} htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
              disabled={loading}
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
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}

          </form>
        </section>

      </main>

    </div>
  );
}