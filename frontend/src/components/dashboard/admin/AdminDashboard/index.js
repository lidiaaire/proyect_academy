'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { dashboardService } from '@/lib/services/dashboard.service';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    Promise.all([
      dashboardService.getAdminDashboard(token),
      dashboardService.getAdminActivity(30, token),
      dashboardService.getAdminAtRisk(token),
    ])
      .then(([dashboard, activity, atRisk]) => setData({ dashboard, activity, atRisk }))
      .catch((err) => setError(err.message ?? 'Error desconocido'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p>Cargando dashboard...</p>;
  if (error)   return <p>Error cargando dashboard</p>;

  const { platform, platformGrowth, coursesSummary } = data.dashboard;
  const { series } = data.activity;
  const { threshold, count, students: atRiskStudents } = data.atRisk;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Usuarios</h2>
        <p>Total: {platform.users.total}</p>
        <p>Admin: {platform.users.admin}</p>
        <p>Teacher: {platform.users.teacher}</p>
        <p>Student: {platform.users.student}</p>
        <p>Activos: {platform.users.activeTotal}</p>
      </section>

      <section>
        <h2>Matrículas</h2>
        <p>Total: {platform.enrollments.total}</p>
        <p>Active: {platform.enrollments.active}</p>
        <p>Suspended: {platform.enrollments.suspended}</p>
        <p>Completed: {platform.enrollments.completed}</p>
      </section>

      <section>
        <h2>Cursos</h2>
        <p>Total: {platform.courses.total}</p>
        <p>Published: {platform.courses.published}</p>
        <p>Draft: {platform.courses.draft}</p>
        <p>Archived: {platform.courses.archived}</p>
      </section>

      <section>
        <h2>Assessments</h2>
        <p>Total attempts: {platform.assessments.totalAttempts}</p>
        <p>Pass rate: {platform.assessments.passRate !== null ? `${platform.assessments.passRate}%` : '—'}</p>
        <p>Average score: {platform.assessments.avgScore !== null ? `${platform.assessments.avgScore}%` : '—'}</p>
      </section>

      <section>
        <h2>Platform Growth</h2>
        <p>New enrollments (7d): {platformGrowth.newEnrollments7d}</p>
        <p>New enrollments (30d): {platformGrowth.newEnrollments30d}</p>
        <p>Lessons completed (7d): {platformGrowth.lessonsCompleted7d}</p>
        <p>Lessons completed (30d): {platformGrowth.lessonsCompleted30d}</p>
        <p>Assessments passed (30d): {platformGrowth.assessmentsPassed30d}</p>
        <p>Active users (7d): {platformGrowth.activeUsers7d}</p>
        <p>Active users (30d): {platformGrowth.activeUsers30d}</p>
      </section>

      <section>
        <h2>Lista de cursos</h2>
        <ul>
          {coursesSummary.map((c) => (
            <li key={c.courseId}>
              <strong>{c.title}</strong> ({c.level})
              <p>Matrículas totales: {c.totalEnrollments}</p>
              <p>Matrículas activas: {c.activeEnrollments}</p>
              <p>Progreso medio: {c.avgProgress}%</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Actividad reciente</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Lessons Completed</th>
            </tr>
          </thead>
          <tbody>
            {series.map((row) => (
              <tr key={row.date}>
                <td>{row.date}</td>
                <td>{row.lessonsCompleted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Alumnos en riesgo</h2>
        <p>Threshold — Days: {threshold.days} · Progress Below: {threshold.progressBelow}%</p>
        <p>Count: {count}</p>
        {count === 0 ? (
          <p>No hay alumnos en riesgo.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Última actividad</th>
                <th>Días sin actividad</th>
                <th>Progreso medio</th>
                <th>Profesor asignado</th>
              </tr>
            </thead>
            <tbody>
              {atRiskStudents.map((s) => (
                <tr key={s.studentId}>
                  <td>{s.firstName} {s.lastName}</td>
                  <td>{s.lastActivityAt ? s.lastActivityAt.slice(0, 10) : '—'}</td>
                  <td>{s.daysSinceLastActivity ?? '—'}</td>
                  <td>{s.overallProgressAvg}%</td>
                  <td>{s.assignedTeacher ? `${s.assignedTeacher.firstName} ${s.assignedTeacher.lastName}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
