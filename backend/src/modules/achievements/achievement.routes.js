'use strict';

const { Router }             = require('express');
const AchievementController  = require('./achievement.controller');
const verifyToken            = require('../../middlewares/verifyToken');

const router = Router();

router.get('/me', verifyToken, AchievementController.listUserAchievements);

module.exports = router;
