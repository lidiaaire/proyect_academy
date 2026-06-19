'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { coursesService } from '@/lib/services/courses.service';
import styles from '@/styles/Courses.module.css';

const BADGE_CLASS = {
  draft:     styles.badgeDraft,
  published: styles.badgePublished,
  archived:  styles.badgeArchived,
};

export default function CoursesPage() {
  const { token } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    coursesService.getCourses(token)
      .then((data) => setCourses(data.docs ?? data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Cursos</h1>

      {loading && <p className={styles.status}>Cargando cursos…</p>}
      {error   && <p className={styles.status}>Error: {error}</p>}

      {!loading && !error && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Nivel</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id ?? course.id}>
                <td>
                  <Link href={`/courses/${course._id ?? course.id}`} className={styles.link}>
                    {course.title}
                  </Link>
                </td>
                <td>{course.level}</td>
                <td>
                  <span className={`${styles.badge} ${BADGE_CLASS[course.status] ?? ''}`}>
                    {course.status}
                  </span>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', color: '#9ca3af' }}>
                  No hay cursos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
