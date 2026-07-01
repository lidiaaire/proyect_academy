const Assignment = require('../../models/assignment.model');

async function createAssignment(data) {
  return Assignment.create(data);
}

async function getAssignmentById(id) {
  return Assignment.findById(id);
}

async function getAssignmentsByCourse(courseId) {
  return Assignment.find({ course: courseId }).sort({ dueDate: 1 });
}

async function updateAssignment(id, data) {
  return Assignment.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

async function deleteAssignment(id) {
  return Assignment.findByIdAndDelete(id);
}

module.exports = {
  createAssignment,
  getAssignmentById,
  getAssignmentsByCourse,
  updateAssignment,
  deleteAssignment,
};
