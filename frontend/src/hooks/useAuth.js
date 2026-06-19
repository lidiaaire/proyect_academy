'use client';

import { useContext } from 'react';
import { AuthContext } from '@/core/context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
}
