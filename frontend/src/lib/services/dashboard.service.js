import { api } from '@/lib/api';

export const dashboardService = {
  getStudentDashboard(token) {
    return api.get('/dashboard/student', token);
  },

  getTeacherDashboard(token) {
    return api.get('/dashboard/teacher', token);
  },

  getTeacherStudentDetail(studentId, token) {
    return api.get(`/dashboard/teacher/students/${studentId}`, token);
  },

  getAdminDashboard(token) {
    return api.get('/dashboard/admin', token);
  },

  getAdminActivity(days = 30, token) {
    return api.get(`/dashboard/admin/activity?days=${days}`, token);
  },

  getAdminAtRisk(token) {
    return api.get('/dashboard/admin/at-risk', token);
  },
};
