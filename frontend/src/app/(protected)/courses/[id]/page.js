'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { coursesService } from '@/lib/services/courses.service';
import { unitsService } from '@/lib/services/units.service';
import { lessonsService } from '@/lib/services/lessons.service';
import styles from '@/styles/CourseDetail.module.css';

const BADGE_CLASS = {
  draft:     styles.badgeDraft,
  published: styles.badgePublished,
  archived:  styles.badgeArchived,
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();

  const [course, setCourse]             = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const [units, setUnits]               = useState([]);
  const [unitsLoading, setUnitsLoading] = useState(true);
  const [unitsError, setUnitsError]     = useState(null);

  // { [unitId]: { docs: [], loading: true, error: null } }
  const [lessonsMap, setLessonsMap]     = useState({});

  useEffect(() => {
    coursesService.getCourseById(id, token)
      .then((data) => setCourse(data.course ?? data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    unitsService.getUnitsByCourse(id, token)
      .then((data) => setUnits(data.docs ?? data))
      .catch((err) => setUnitsError(err.message))
      .finally(() => setUnitsLoading(false));
  }, [id, token]);

  useEffect(() => {
    if (!units.length) return;

    const initial = {};
    units.forEach((u) => {
      initial[u._id] = { docs: [], loading: true, error: null };
    });
    setLessonsMap(initial);

    units.forEach((unit) => {
      lessonsService.getLessonsByUnit(id, unit._id, token)
        .then((data) => setLessonsMap((prev) => ({
          ...prev,
          [unit._id]: { docs: data.docs ?? [], loading: false, error: null },
        })))
        .catch((err) => setLessonsMap((prev) => ({
          ...prev,
          [unit._id]: { docs: [], loading: false, error: err.message },
        })));
    });
  }, [units, id, token]);

  if (loading) return <p className={styles.status}>Cargando curso…</p>;
  if (error)   return <p className={styles.status}>Error: {error}</p>;
  if (!course) return null;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>{course.title}</h1>

        {course.description && (
          <p className={styles.description}>{course.description}</p>
        )}

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Nivel</span>
            <span className={styles.metaValue}>{course.level}</span>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Estado</span>
            <span className={`${styles.badge} ${BADGE_CLASS[course.status] ?? ''}`}>
              {course.status}
            </span>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Creado</span>
            <span className={styles.metaValue}>{formatDate(course.createdAt)}</span>
          </div>
        </div>
      </div>

      <section>
        <h2 className={styles.sectionTitle}>Unidades</h2>

        {unitsLoading && <p className={styles.status}>Cargando unidades…</p>}
        {unitsError   && <p className={styles.status}>Error: {unitsError}</p>}

        {!unitsLoading && !unitsError && (
          <ul className={styles.unitList}>
            {units.map((unit) => {
              const ls = lessonsMap[unit._id] ?? { docs: [], loading: true, error: null };
              return (
                <li key={unit._id} className={styles.unitItem}>
                  <div className={styles.unitHeader}>
                    <span className={styles.unitOrder}>{unit.order}</span>
                    <span className={styles.unitTitle}>{unit.title}</span>
                  </div>

                  {ls.loading && (
                    <p className={styles.lessonStatus}>Cargando lecciones…</p>
                  )}
                  {ls.error && (
                    <p className={styles.lessonStatus}>Error: {ls.error}</p>
                  )}
                  {!ls.loading && !ls.error && (
                    <ul className={styles.lessonList}>
                      {ls.docs.map((lesson) => (
                        <li key={lesson._id} className={styles.lessonItem}>
                          <Link
                            href={`/courses/${id}/units/${unit._id}/lessons/${lesson._id}`}
                            className={styles.lessonLink}
                          >
                            <span className={styles.lessonOrder}>{lesson.order}</span>
                            <span className={styles.lessonTitle}>{lesson.title}</span>
                          </Link>
                        </li>
                      ))}
                      {ls.docs.length === 0 && (
                        <li className={styles.unitEmpty}>Sin lecciones.</li>
                      )}
                    </ul>
                  )}
                </li>
              );
            })}
            {units.length === 0 && (
              <li className={styles.unitEmpty}>Sin unidades todavía.</li>
            )}
          </ul>
        )}
      </section>
    </div>
  );
}
