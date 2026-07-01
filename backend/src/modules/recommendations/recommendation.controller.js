'use strict';

const asyncHandler             = require('../../utils/asyncHandler');
const RecommendationService    = require('./recommendation.service');

const getMyRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await RecommendationService.getMyRecommendations(req.user.userId);
  res.status(200).json({ recommendations });
});

module.exports = { getMyRecommendations };
