'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { enrollmentsService } from '@/lib/services/enrollments.service';
import { buildCourseMap, buildUserMap } from '@/lib/resolvers';
import styles from '@/styles/Enrollments.module.css';

const BADGE_CLASS = {
  active:    styles.badgeActive,
  suspended: styles.badgeSuspended,
  completed: styles.badgeCompleted,
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function EnrollmentsPage() {
  const { token, user } = useAuth();

  const [enrollments, setEnrollments]   = useState([]);
  const [courseMap, setCourseMap]       = useState({});
  const [userMap, setUserMap]           = useState({});
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const resolvers = [buildCourseMap(token)];
    if (user?.role === 'admin') resolvers.push(buildUserMap(token));

    Promise.all(resolvers).then(([cMap, uMap = {}]) => {
      setCourseMap(cMap);
      setUserMap(uMap);
    }).catch(() => {});
  }, [token, user?.role]);

  const fetchEnrollments = useCallback(() => {
    setLoading(true);
    enrollmentsService.getEnrollments(token)
      .then((data) => setEnrollments(data.docs ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

  async function handleAction(id, action) {
    setActionLoading(id);
    try {
      await action(id, token);
      await fetchEnrollments();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Matrículas</h1>

      {loading && <p className={styles.status}>Cargando matrículas…</p>}
      {error   && <p className={styles.status}>Error: {error}</p>}

      {!loading && !error && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Curso</th>
              <th>Estudiante</th>
              <th>Estado</th>
              <th>Fecha de matrícula</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => {
              const busy = actionLoading === e._id;
              return (
                <tr key={e._id}>
                  <td>{courseMap[e.courseId] ?? <span className={styles.idFallback}>{e.courseId}</span>}</td>
                  <td>{userMap[e.studentId]  ?? <span className={styles.idFallback}>{e.studentId}</span>}</td>
                  <td>
                    <span className={`${styles.badge} ${BADGE_CLASS[e.status] ?? ''}`}>
                      {e.status}
                    </span>
                  </td>
                  <td>{formatDate(e.enrolledAt)}</td>
                  <td>
                    <div className={styles.actions}>
                      {e.status === 'suspended' && (
                        <button
                          className={styles.btnActivate}
                          disabled={busy}
                          onClick={() => handleAction(e._id, enrollmentsService.activateEnrollment.bind(enrollmentsService))}
                        >
                          {busy ? '…' : 'Activate'}
                        </button>
                      )}
                      {e.status === 'active' && (
                        <button
                          className={styles.btnSuspend}
                          disabled={busy}
                          onClick={() => handleAction(e._id, enrollmentsService.suspendEnrollment.bind(enrollmentsService))}
                        >
                          {busy ? '…' : 'Suspend'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {enrollments.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#9ca3af' }}>
                  No hay matrículas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
