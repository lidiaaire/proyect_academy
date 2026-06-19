'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usersService } from '@/lib/services/users.service';
import styles from '@/styles/Users.module.css';

export default function UsersPage() {
  const { token } = useAuth();

  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    usersService.getUsers(token)
      .then((data) => setUsers(data.users ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function handleAction(id, action) {
    setActionLoading(id);
    try {
      await action(id, token);
      await fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Usuarios</h1>

      {loading && <p className={styles.status}>Cargando usuarios…</p>}
      {error   && <p className={styles.status}>Error: {error}</p>}

      {!loading && !error && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const busy = actionLoading === u._id;
              return (
                <tr key={u._id}>
                  <td>{u.firstName} {u.lastName}</td>
                  <td>{u.email}</td>
                  <td><span className={styles.roleBadge}>{u.role}</span></td>
                  <td>
                    <span className={u.isActive ? styles.badgeActive : styles.badgeInactive}>
                      {u.isActive ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {!u.isActive && (
                        <button
                          className={styles.btnActivate}
                          disabled={busy}
                          onClick={() => handleAction(u._id, usersService.activateUser.bind(usersService))}
                        >
                          {busy ? '…' : 'Activate'}
                        </button>
                      )}
                      {u.isActive && (
                        <button
                          className={styles.btnDeactivate}
                          disabled={busy}
                          onClick={() => handleAction(u._id, usersService.deactivateUser.bind(usersService))}
                        >
                          {busy ? '…' : 'Deactivate'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#9ca3af' }}>
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
