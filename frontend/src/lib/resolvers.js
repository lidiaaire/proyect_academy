import { coursesService } from '@/lib/services/courses.service';
import { usersService } from '@/lib/services/users.service';

export async function buildCourseMap(token) {
  const data = await coursesService.getCourses(token);
  const docs = data.docs ?? [];
  return Object.fromEntries(docs.map((c) => [c._id, c.title]));
}

export async function buildUserMap(token) {
  const data = await usersService.getUsers(token);
  const users = data.users ?? [];
  return Object.fromEntries(
    users.map((u) => [u._id, `${u.firstName} ${u.lastName}`])
  );
}
