const Submission = require('../../models/submission.model');

async function createSubmission(data) {
  return Submission.create(data);
}

async function getSubmissionById(id) {
  return Submission.findById(id);
}

async function getSubmission(assignmentId, studentId) {
  return Submission.findOne({ assignment: assignmentId, student: studentId });
}

async function getSubmissionsByAssignment(assignmentId) {
  return Submission.find({ assignment: assignmentId }).sort({ submittedAt: 1 });
}

async function getSubmissionsByAssignmentPaginated(assignmentId, { page = 1, limit = 10 } = {}) {
  const skip  = (page - 1) * limit;
  const query = { assignment: assignmentId };

  const [items, total] = await Promise.all([
    Submission.find(query).sort({ submittedAt: 1 }).skip(skip).limit(limit),
    Submission.countDocuments(query),
  ]);

  return {
    items,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

async function gradeSubmission(id, data) {
  const { status, score, feedback } = data;
  return Submission.findByIdAndUpdate(
    id,
    { status, score, feedback },
    { new: true, runValidators: true }
  );
}

module.exports = {
  createSubmission,
  getSubmissionById,
  getSubmission,
  getSubmissionsByAssignment,
  getSubmissionsByAssignmentPaginated,
  gradeSubmission,
};
