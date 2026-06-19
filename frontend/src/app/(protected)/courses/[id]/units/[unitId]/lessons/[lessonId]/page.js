'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { lessonsService } from '@/lib/services/lessons.service';
import styles from '@/styles/LessonDetail.module.css';

const BADGE_CLASS = {
  text:  styles.badgeText,
  video: styles.badgeVideo,
};

export default function LessonDetailPage() {
  const { id: courseId, unitId, lessonId } = useParams();
  const { token } = useAuth();

  const [lesson, setLesson]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    lessonsService.getLessonById(courseId, unitId, lessonId, token)
      .then((data) => setLesson(data.lesson))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId, unitId, lessonId, token]);

  if (loading) return <p className={styles.status}>Cargando lección…</p>;
  if (error)   return <p className={styles.status}>Error: {error}</p>;
  if (!lesson) return null;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{lesson.title}</h1>
          <div className={styles.meta}>
            <span className={`${styles.badge} ${BADGE_CLASS[lesson.type] ?? ''}`}>
              {lesson.type}
            </span>
            <span className={styles.metaItem}>
              Lección <strong>{lesson.order}</strong>
            </span>
            <span className={styles.metaItem}>
              Unidad <strong>{lesson.unitId}</strong>
            </span>
            {lesson.duration && (
              <span className={styles.metaItem}>
                <strong>{lesson.duration}</strong> min
              </span>
            )}
          </div>
        </div>

        <hr className={styles.divider} />

        {lesson.type === 'text' && (
          lesson.content
            ? <p className={styles.content}>{lesson.content}</p>
            : <p className={styles.noContent}>Esta lección no tiene contenido todavía.</p>
        )}

        {lesson.type === 'video' && (
          lesson.videoUrl
            ? <iframe
                className={styles.videoFrame}
                src={lesson.videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={lesson.title}
              />
            : <p className={styles.noContent}>Esta lección no tiene vídeo todavía.</p>
        )}
      </div>
    </div>
  );
}
