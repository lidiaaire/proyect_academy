const {
  createSubmission,
  getSubmissionById,
  getSubmission,
  getSubmissionsByAssignment,
  gradeSubmission,
} = require('./submission.service');
const { getAssignmentById } = require('../assignments/assignment.service');
const { completeLesson }   = require('../progress/progress.service');
const { ROLES }            = require('../../config/constants');
const CourseRepository     = require('../../repositories/course.repository');

async function create(req, res, next) {
  try {
    const { assignment } = req.body;
    const student = req.user.userId;

    const existing = await getSubmission(assignment, student);
    if (existing) return res.status(409).json({ message: 'Submission already exists' });

    const assignmentDoc = await getAssignmentById(assignment);
    if (!assignmentDoc) return res.status(404).json({ message: 'Assignment not found' });

    if (!assignmentDoc.isPublished) {
      return res.status(403).json({ message: 'Assignment is not published' });
    }

    if (new Date() > new Date(assignmentDoc.dueDate)) {
      return res.status(400).json({ message: 'Assignment deadline has passed' });
    }

    const submissionData = {
      assignment: req.body.assignment,
      student:    req.user.userId,
      content:    req.body.content,
    };
    const submission = await createSubmission(submissionData);
    res.status(201).json(submission);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    res.status(200).json(req.submission);
  } catch (error) {
    next(error);
  }
}

async function getByAssignment(req, res, next) {
  try {
    res.status(200).json(req.submissions);
  } catch (error) {
    next(error);
  }
}

async function grade(req, res, next) {
  try {
    const submission = await getSubmissionById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    if (submission.status === 'GRADED') {
      return res.status(409).json({ message: 'Submission has already been graded' });
    }

    const assignmentDoc = await getAssignmentById(submission.assignment);
    if (!assignmentDoc) return res.status(404).json({ message: 'Assignment not found' });

    if (req.user.role === ROLES.TEACHER) {
      const course = await CourseRepository.findById(assignmentDoc.course);
      if (!course || course.teacher?.toString() !== req.user.userId.toString()) {
        return res.status(403).json({ message: 'Teacher is not assigned to this course' });
      }
    }

    if (req.body.score !== undefined && req.body.score > assignmentDoc.maxScore) {
      return res.status(400).json({ message: 'Score exceeds assignment maximum' });
    }

    const updated = await gradeSubmission(req.params.id, { ...req.body, status: 'GRADED' });

    if (updated.score !== null && updated.score >= assignmentDoc.maxScore * 0.6) {
      await completeLesson(updated.student, assignmentDoc.lesson);
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

module.exports = { create, getById, getByAssignment, grade };
