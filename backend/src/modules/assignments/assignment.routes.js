const { Router }  = require('express');
const verifyToken = require('../../middlewares/verifyToken');
const requireRole = require('../../middlewares/requireRole');
const { ROLES }    = require('../../config/constants');
const { create, getById, getByCourse, update, remove } = require('./assignment.controller');

const router = Router();

router.use(verifyToken);

const teacherOrAdmin = requireRole(ROLES.TEACHER, ROLES.ADMIN);

router.post('/', teacherOrAdmin, create);
router.get('/course/:courseId', getByCourse);
router.get('/:id', getById);
router.put('/:id', teacherOrAdmin, update);
router.delete('/:id', teacherOrAdmin, remove);

module.exports = router;
