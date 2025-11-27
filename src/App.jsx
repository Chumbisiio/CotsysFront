import React, { useState } from 'react';
import { getAccessToken, clearTokens } from './auth/tokenStore';
import Login from './components/Login';
import Home from './components/Home';
import CreateUser from './components/CreateUser';
import ManageProducts from './components/ManageProducts';
import Cotizacion from './components/Cotizacion';
import EditRoles from './components/EditRoles';

export default function App() {
  const initialView = getAccessToken() ? 'home' : 'login';
  const [view, setView] = useState(initialView);
  const fakeUser = { name: 'Empresa - Usuario' };

  return (
    <>
      {view === 'login' && <Login onLogin={() => setView('home')} />}
      {view === 'home' && (
        <Home
          user={fakeUser}
          onLogout={() => {
            clearTokens();
            setView('login');
          }}
          onNavigate={(v) => setView(v)}
        />
      )}
      {view === 'createUser' && (
        <CreateUser user={fakeUser} onCancel={() => setView('home')} />
      )}
      {view === 'manageProducts' && (
        <ManageProducts user={fakeUser} onCancel={() => setView('home')} />
      )}

{view === 'cotizacion' && <Cotizacion user={fakeUser} onCancel={() => setView('home')} />}

{view === 'editRoles' && <EditRoles user={fakeUser} onCancel={() => setView('home')} />}
    </>
  );
}