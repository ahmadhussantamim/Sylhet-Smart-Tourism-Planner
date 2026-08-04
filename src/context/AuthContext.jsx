// context/AuthContext.jsx
// -----------------------------------------------------------------------
// React's Context API lets us share "who is logged in" across the whole
// app without passing props down manually through every component
// (this is called "prop drilling", and Context avoids it).
//
// Any component can call useAuth() to read the current user, or to
// call login()/logout().
// -----------------------------------------------------------------------

import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // On first load, check if a user was already saved from a previous session
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so components write `useAuth()` instead of
// `useContext(AuthContext)` everywhere.
export function useAuth() {
  return useContext(AuthContext);
}
