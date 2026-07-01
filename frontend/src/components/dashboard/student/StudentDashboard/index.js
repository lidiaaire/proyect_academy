'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { dashboardService } from '@/lib/services/dashboard.service';
import CourseProgressCard  from '@/components/dashboard/student/CourseProgressCard';
import AssessmentSummary   from '@/components/dashboard/student/AssessmentSummary';
import SkillProgressList   from '@/components/dashboard/student/SkillProgressList';

export default function StudentDashboard() {
  const { token } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    dashboardService.getStudentDashboard(token)
      .then((res) => setData(res))
      .catch((err) => setError(err.message ?? 'Error desconocido'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p>Cargando dashboard...</p>;
  if (error)   return <p>Error cargando dashboard</p>;

  const { profile, summary, growth, skillProgress, enrollments } = data;

  return (
    <div>
      <h1>{profile.firstName} {profile.lastName}</h1>

      <section>
        <h2>Resumen</h2>
        <p>Progreso global: {summary.overallProgressAvg}%</p>
      </section>

      <SkillProgressList skillProgress={skillProgress} />

      <AssessmentSummary
        assessmentScore={skillProgress.assessmentScore}
        lessonsCompleted7d={growth.lessonsCompleted7d}
        progressGained7d={growth.progressGained7d}
        streakDays={summary.streakDays}
      />

      <section>
        <h2>Cursos matriculados</h2>
        <ul>
          {enrollments.map((e) => (
            <CourseProgressCard
              key={e.enrollmentId}
              courseTitle={e.courseTitle}
              overallProgress={e.overallProgress}
              completedLessons={e.completedLessons}
              totalLessons={e.totalLessons}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
