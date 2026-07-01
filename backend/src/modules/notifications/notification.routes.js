'use strict';

const { Router }                = require('express');
const verifyToken               = require('../../middlewares/verifyToken');
const NotificationController    = require('./notification.controller');

const router = Router();

router.get('/me',           verifyToken, NotificationController.getMyNotifications);
router.patch('/read-all',  verifyToken, NotificationController.markAllAsRead);
router.patch('/:id/read',  verifyToken, NotificationController.markAsRead);

module.exports = router;
