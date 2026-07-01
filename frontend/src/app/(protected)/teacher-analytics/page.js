'use client';

import { useEffect, useState } from 'react';
import { useAuth }                    from '@/hooks/useAuth';
import { dashboardService }           from '@/lib/services/dashboard.service';
import { teacherAnalyticsService }    from '@/lib/services/teacher-analytics.service';
import CohortComparisonTable          from '@/components/teacher-analytics/CohortComparisonTable';
import InactivityRanking              from '@/components/teacher-analytics/InactivityRanking';
import AssessmentBreakdownTable       from '@/components/teacher-analytics/AssessmentBreakdownTable';
import StudentWeeklyTrendPanel        from '@/components/teacher-analytics/StudentWeeklyTrendPanel';

export default function TeacherAnalyticsPage() {
  const { token } = useAuth();

  const [teacherDashboard,  setTeacherDashboard]  = useState(null);
  const [assessments,       setAssessments]        = useState(null);
  const [loading,           setLoading]            = useState(true);
  const [error,             setError]              = useState(null);

  const [selectedStudentId, setSelectedStudentId]  = useState(null);
  const [weeklyTrend,       setWeeklyTrend]        = useState(null);
  const [trendLoading,      setTrendLoading]       = useState(false);

  useEffect(() => {
    Promise.all([
      dashboardService.getTeacherDashboard(token),
      teacherAnalyticsService.getAssessmentBreakdown(token),
    ])
      .then(([dashboard, breakdown]) => {
        setTeacherDashboard(dashboard);
        setAssessments(breakdown);
      })
      .catch((err) => setError(err.message ?? 'Error desconocido'))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!selectedStudentId) return;

    setTrendLoading(true);
    teacherAnalyticsService.getWeeklyTrend(selectedStudentId, token)
      .then((res) => setWeeklyTrend(res))
      .finally(() => setTrendLoading(false));
  }, [token, selectedStudentId]);

  if (loading) return <p>Cargando Teacher Analytics...</p>;
  if (error)   return <p>Error cargando Teacher Analytics</p>;

  return (
    <div>
      <h1>Teacher Analytics</h1>

      <CohortComparisonTable
        students={teacherDashboard.students}
        cohortProgressAvg={teacherDashboard.cohortSummary.cohortProgressAvg}
        onSelectStudent={setSelectedStudentId}
      />

      <InactivityRanking students={teacherDashboard.students} />

      <AssessmentBreakdownTable assessments={assessments} />

      {selectedStudentId && (
        <>
          <p>Tendencia semanal del alumno seleccionado</p>
          {trendLoading
            ? <p>Cargando tendencia...</p>
            : <StudentWeeklyTrendPanel weeklyTrend={weeklyTrend ?? []} />
          }
        </>
      )}
    </div>
  );
}
