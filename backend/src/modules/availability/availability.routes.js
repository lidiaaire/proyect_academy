'use strict';

const { Router }               = require('express');
const verifyToken              = require('../../middlewares/verifyToken');
const requireRole               = require('../../middlewares/requireRole');
const validate                  = require('../../middlewares/validate');
const AvailabilityController   = require('./availability.controller');
const { createAvailabilitySchema } = require('./availability.validator');
const { ROLES }                 = require('../../config/constants');

const router = Router();

const teacherOnly = requireRole(ROLES.TEACHER);

router.get('/me',  verifyToken, teacherOnly, AvailabilityController.getMyAvailability);
router.post('/',   verifyToken, teacherOnly, ...validate(createAvailabilitySchema), AvailabilityController.createAvailability);

module.exports = router;
