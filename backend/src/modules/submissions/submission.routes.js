const { Router } = require('express');
const { create, getById, getByAssignment, grade } = require('./submission.controller');
const verifyToken          = require('../../middlewares/verifyToken');
const requireRole          = require('../../middlewares/requireRole');
const { canAccessSubmission } = require('./submission.authorization');
const { ROLES }            = require('../../config/constants');

const router = Router();

router.post('/', verifyToken, requireRole(ROLES.STUDENT), create);
router.get('/assignment/:assignmentId', verifyToken, canAccessSubmission, getByAssignment);
router.get('/:id', verifyToken, canAccessSubmission, getById);
router.patch('/:id/grade', verifyToken, requireRole(ROLES.TEACHER, ROLES.ADMIN), grade);

module.exports = router;
