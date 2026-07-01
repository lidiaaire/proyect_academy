'use client';

export default function AssessmentSummary({ assessmentScore, lessonsCompleted7d, progressGained7d, streakDays }) {
  return (
    <section>
      <p>Assessment score: {assessmentScore ?? '—'}</p>
      <p>Lecciones completadas (7 días): {lessonsCompleted7d}</p>
      <p>Progreso ganado (7 días): {progressGained7d}%</p>
      <p>Racha actual: {streakDays} días</p>
    </section>
  );
}
