'use client';

export default function CourseProgressCard({ courseTitle, overallProgress, completedLessons, totalLessons }) {
  return (
    <li>
      <strong>{courseTitle}</strong>
      <p>Progreso: {overallProgress}%</p>
      <p>Lecciones: {completedLessons} / {totalLessons}</p>
    </li>
  );
}
