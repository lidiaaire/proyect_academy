'use client';

import { useAuth } from '@/hooks/useAuth';
import StudentDashboard from '@/components/dashboard/student/StudentDashboard';
import TeacherDashboard from '@/components/dashboard/teacher/TeacherDashboard';
import AdminDashboard   from '@/components/dashboard/admin/AdminDashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role;

  if (role === 'student') return <StudentDashboard />;
  if (role === 'teacher') return <TeacherDashboard />;
  if (role === 'admin')   return <AdminDashboard />;

  return <div>Rol no reconocido</div>;
}
