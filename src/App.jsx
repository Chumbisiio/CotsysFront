import React, { useEffect, useMemo, useState } from 'react';
import { getAccessToken, clearTokens, getSessionUser } from './auth/tokenStore';
import Login from './components/Login';
import Home from './components/Home';
import CreateUser from './components/CreateUser';
import ManageProducts from './components/ManageProducts';
import Cotizacion from './components/Cotizacion';
import EditRoles from './components/EditRoles';

export default function App() {
  const initialView = getAccessToken() ? 'home' : 'login';
  const [view, setView] = useState(initialView);
  const [user, setUser] = useState(() => getSessionUser());

  const allowedViews = useMemo(() => {
    const normalizedRole = (user?.role || '').toUpperCase().replace(/\s+/g, '_');
      if (normalizedRole === 'ADMINISTRADOR') 
      if (normalizedRole === 'COMERCIAL') { base.add('cotizacion'); }
      if (normalizedRole === 'LIDER_TECNICO') { base.add('manageProducts'); }
      
    const role = user?.role || '';
    const base = new Set(['home']);
    if (role === 'ADMINISTRADOR') {
      ['createUser', 'manageProducts', 'cotizacion', 'editRoles'].forEach(v => base.add(v));
    }
    if (role === 'COMERCIAL') {
      base.add('cotizacion');
    }
    if (role  === 'LIDER_TECNICO') {
      base.add('manageProducts');
    }
    return base;
  }, [user]);

  useEffect(() => {
    // Si cambia el usuario/rol y la vista actual no está permitida, regresar a home.
    if (!allowedViews.has(view) && view !== 'login') {
      setView('home');
    }
  }, [allowedViews, view]);

  const handleLogout = () => {
    clearTokens();
    setUser({ name: null, email: null, role: null });
    setView('login');
  };

  const handleNavigate = (target) => {
    if (allowedViews.has(target)) {
      setView(target);
    } else {
      setView('home');
    }
  };

  const handleLoginSuccess = () => {
    const sessionUser = getSessionUser();
    setUser(sessionUser);
    setView('home');
  };

  return (
    <>
      {view === 'login' && <Login onLogin={handleLoginSuccess} />}
      {view === 'home' && (
        <Home
          user={user}
          allowedViews={allowedViews}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
      {view === 'createUser' && (
        <CreateUser
          user={user}
          onCancel={() => setView('home')}
          onLogout={handleLogout}
        />
      )}
      {view === 'manageProducts' && (
        <ManageProducts
          user={user}
          onCancel={() => setView('home')}
          onLogout={handleLogout}
        />
      )}

      {view === 'cotizacion' && (
        <Cotizacion
          user={user}
          onCancel={() => setView('home')}
          onLogout={handleLogout}
        />
      )}

      {view === 'editRoles' && (
        <EditRoles
          user={user}
          onCancel={() => setView('home')}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}