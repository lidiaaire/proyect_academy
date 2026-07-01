import { api } from '@/lib/api';

export const teacherAnalyticsService = {
  getAssessmentBreakdown(token) {
    return api.get('/teacher-analytics/assessment-breakdown', token);
  },

  getWeeklyTrend(studentId, token) {
    return api.get(`/teacher-analytics/students/${studentId}/weekly-trend`, token);
  },
};
