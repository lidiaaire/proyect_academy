'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { dashboardService } from '@/lib/services/dashboard.service';

export default function TeacherDashboard() {
  const { token } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    dashboardService.getTeacherDashboard(token)
      .then((res) => setData(res))
      .catch((err) => setError(err.message ?? 'Error desconocido'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p>Cargando dashboard...</p>;
  if (error)   return <p>Error cargando dashboard</p>;

  const { profile, cohortSummary, cohortGrowth, students } = data;

  return (
    <div>
      <h1>{profile.firstName} {profile.lastName}</h1>

      <section>
        <h2>Cohorte</h2>
        <p>Total de alumnos: {cohortSummary.totalStudents}</p>
        <p>Alumnos activos (7 días): {cohortSummary.activeStudents7d}</p>
        <p>Progreso medio de la cohorte: {cohortSummary.cohortProgressAvg}%</p>
        <p>Alumnos en riesgo: {cohortSummary.atRiskCount}</p>
        <p>Assessment Pass Rate: {cohortSummary.assessmentPassRate !== null ? `${cohortSummary.assessmentPassRate}%` : '—'}</p>
      </section>

      <section>
        <h2>Crecimiento</h2>
        <p>Lecciones completadas (7 días): {cohortGrowth.lessonsCompleted7d}</p>
        <p>Assessments aprobados (30 días): {cohortGrowth.assessmentsPassed30d}</p>
      </section>

      <section>
        <h2>Alumnos</h2>
        <ul>
          {students.map((s) => (
            <li key={s.studentId}>
              {s.firstName} {s.lastName}
              {' — '}
              {s.isAtRisk ? 'En riesgo' : 'Activo'}
              {' — '}
              {s.enrollments.length} {s.enrollments.length === 1 ? 'curso' : 'cursos'}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
