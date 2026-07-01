'use strict';

const { Router }                  = require('express');
const RecommendationController    = require('./recommendation.controller');
const verifyToken                 = require('../../middlewares/verifyToken');

const router = Router();

router.get('/me', verifyToken, RecommendationController.getMyRecommendations);

module.exports = router;
