'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { progressService } from '@/lib/services/progress.service';
import { buildCourseMap } from '@/lib/resolvers';
import styles from '@/styles/Progress.module.css';

export default function ProgressPage() {
  const { token } = useAuth();

  const [overview, setOverview]     = useState([]);
  const [courseMap, setCourseMap]   = useState({});
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    Promise.all([
      progressService.getOverview(token),
      buildCourseMap(token),
    ])
      .then(([progressData, map]) => {
        setOverview(progressData.overview ?? []);
        setCourseMap(map);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Mi progreso</h1>

      {loading && <p className={styles.status}>Cargando progreso…</p>}
      {error   && <p className={styles.status}>Error: {error}</p>}

      {!loading && !error && (
        overview.length === 0
          ? <p className={styles.empty}>No hay cursos con progreso registrado.</p>
          : (
            <div className={styles.list}>
              {overview.map((item) => (
                <div key={item.enrollmentId} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.courseName}>
                      {courseMap[item.courseId] ?? item.courseId}
                    </span>
                    <span className={styles.percent}>{item.overallProgress}%</span>
                  </div>

                  <div className={styles.track}>
                    <div
                      className={styles.bar}
                      style={{ width: `${item.overallProgress}%` }}
                    />
                  </div>

                  <div className={styles.stats}>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Completadas</span>
                      <span className={styles.statValue}>{item.completedLessons}</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Total</span>
                      <span className={styles.statValue}>{item.totalLessons}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
      )}
    </div>
  );
}
