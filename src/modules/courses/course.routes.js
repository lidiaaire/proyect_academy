'use strict';

/**
 * modules/courses/course.routes.js
 *
 * Montado en app.js bajo /api/courses
 * Monta unit.routes bajo /:courseId/units con mergeParams: true
 *
 *   GET    /api/courses                     → list
 *   POST   /api/courses                     → create       [admin]
 *   GET    /api/courses/:courseId           → getById
 *   PATCH  /api/courses/:courseId           → update       [admin]
 *   PATCH  /api/courses/:courseId/publish   → publish      [admin]
 *   PATCH  /api/courses/:courseId/archive   → archive      [admin]
 *   DELETE /api/courses/:courseId           → remove       [admin]
 *
 *   /api/courses/:courseId/units/**  → unitRouter (mergeParams)
 */

const { Router }        = require('express');
const CourseController  = require('./course.controller');
const { idParamSchema, createCourseSchema, updateCourseSchema, listCoursesSchema } = require('./course.validator');
const validate          = require('../../middlewares/validate');
const verifyToken       = require('../../middlewares/verifyToken');
const requireRole       = require('../../middlewares/requireRole');
const { ROLES }         = require('../../config/constants');
const unitRoutes        = require('../units/unit.routes');

const router = Router();

const adminOnly = requireRole(ROLES.ADMIN);

router.get('/',                    verifyToken, ...validate(listCoursesSchema),  CourseController.list);
router.post('/',                   verifyToken, adminOnly, ...validate(createCourseSchema), CourseController.create);
router.get('/:id',                 verifyToken, ...validate(idParamSchema),      CourseController.getById);
router.patch('/:id',               verifyToken, adminOnly, ...validate(idParamSchema), ...validate(updateCourseSchema), CourseController.update);
router.patch('/:id/publish',       verifyToken, adminOnly, ...validate(idParamSchema), CourseController.publish);
router.patch('/:id/archive',       verifyToken, adminOnly, ...validate(idParamSchema), CourseController.archive);

router.use('/:courseId/units', unitRoutes);

module.exports = router;
