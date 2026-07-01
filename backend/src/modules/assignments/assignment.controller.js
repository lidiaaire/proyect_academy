const {
  createAssignment,
  getAssignmentById,
  getAssignmentsByCourse,
  updateAssignment,
  deleteAssignment,
} = require('./assignment.service');

async function create(req, res, next) {
  try {
    const assignment = await createAssignment(req.body);
    res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const assignment = await getAssignmentById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.status(200).json(assignment);
  } catch (error) {
    next(error);
  }
}

async function getByCourse(req, res, next) {
  try {
    const assignments = await getAssignmentsByCourse(req.params.courseId);
    res.status(200).json(assignments);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const assignment = await updateAssignment(req.params.id, req.body);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.status(200).json(assignment);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const assignment = await deleteAssignment(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.status(200).json(assignment);
  } catch (error) {
    next(error);
  }
}

module.exports = { create, getById, getByCourse, update, remove };
