const {
  getSubmissionById,
  getSubmission,
  getSubmissionsByAssignmentPaginated,
} = require('./submission.service');
const { getAssignmentById } = require('../assignments/assignment.service');
const CourseRepository      = require('../../repositories/course.repository');
const { ROLES }             = require('../../config/constants');

async function canAccessSubmission(req, res, next) {
  try {
    const { userId, role } = req.user;

    // ── Rama por assignmentId ──────────────────────────────────────────────
    if (req.params.assignmentId) {
      const { assignmentId } = req.params;
      const rawPage  = parseInt(req.query.page,  10);
      const rawLimit = parseInt(req.query.limit, 10);
      const page  = rawPage  >= 1           ? rawPage  : 1;
      const limit = rawLimit >= 1 && rawLimit <= 100 ? rawLimit : 10;

      if (role === ROLES.ADMIN) {
        req.submissions = await getSubmissionsByAssignmentPaginated(assignmentId, { page, limit });
        return next();
      }

      if (role === ROLES.STUDENT) {
        const submission = await getSubmission(assignmentId, userId);
        const items = submission ? [submission] : [];
        req.submissions = { items, total: items.length, page: 1, pages: 1 };
        return next();
      }

      if (role === ROLES.TEACHER) {
        const assignmentDoc = await getAssignmentById(assignmentId);
        if (!assignmentDoc) return res.status(404).json({ message: 'Assignment not found' });

        const course = await CourseRepository.findById(assignmentDoc.course);
        if (!course || course.teacher?.toString() !== userId.toString()) {
          return res.status(403).json({ message: 'Forbidden' });
        }

        req.submissions = await getSubmissionsByAssignmentPaginated(assignmentId, { page, limit });
        return next();
      }

      return res.status(403).json({ message: 'Forbidden' });
    }

    // ── Rama por id ────────────────────────────────────────────────────────
    if (req.params.id) {
      const submission = await getSubmissionById(req.params.id);
      if (!submission) return res.status(404).json({ message: 'Submission not found' });

      if (role === ROLES.ADMIN) {
        req.submission = submission;
        return next();
      }

      if (role === ROLES.STUDENT) {
        if (submission.student.toString() !== userId.toString()) {
          return res.status(403).json({ message: 'Forbidden' });
        }
        req.submission = submission;
        return next();
      }

      if (role === ROLES.TEACHER) {
        const assignmentDoc = await getAssignmentById(submission.assignment);
        if (!assignmentDoc) return res.status(404).json({ message: 'Assignment not found' });

        const course = await CourseRepository.findById(assignmentDoc.course);
        if (!course || course.teacher?.toString() !== userId.toString()) {
          return res.status(403).json({ message: 'Forbidden' });
        }

        req.submission = submission;
        return next();
      }

      return res.status(403).json({ message: 'Forbidden' });
    }

    return res.status(400).json({ message: 'Missing resource identifier' });
  } catch (error) {
    next(error);
  }
}

module.exports = { canAccessSubmission };
