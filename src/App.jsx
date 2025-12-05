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

  useEffect(() => {
    const sessionUser = getSessionUser();
    if (sessionUser.role !== user?.role || sessionUser.email !== user?.email || sessionUser.name !== user?.name) {
      setUser(sessionUser);
    }
  }, []);

  const allowedViews = useMemo(() => {
    const role = user?.role || '';
    const base = new Set(['home']);
    
    if (role === 'ADMINISTRADOR') {
      ['createUser', 'manageProducts', 'cotizacion', 'editRoles'].forEach(v => base.add(v));
    } else if (role === 'COMERCIAL') {
      base.add('cotizacion');
    } else if (role === 'TÉCNICO') {
      base.add('manageProducts');
    }
    
    return base;
  }, [user]);

  useEffect(() => {
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
    setTimeout(() => {
      const sessionUser = getSessionUser();
      setUser(sessionUser);
      setView('home');
    }, 100);
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