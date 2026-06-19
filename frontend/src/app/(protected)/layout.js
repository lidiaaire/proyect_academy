'use client';

import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import styles from '@/styles/ProtectedLayout.module.css';

export default function ProtectedLayout({ children }) {
  const { isAuthenticated } = useProtectedRoute();

  if (!isAuthenticated) return null;

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <Navbar />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
