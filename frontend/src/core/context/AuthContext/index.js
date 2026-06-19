'use client';

import { createContext, useState } from 'react';
import { authService } from '@/lib/services/auth.service';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);

  async function login(credentials) {
    const data = await authService.login(credentials);
    setUser(data.user);
    setToken(data.token);
  }

  async function logout() {
    try {
      await authService.logout(token);
    } finally {
      setUser(null);
      setToken(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

