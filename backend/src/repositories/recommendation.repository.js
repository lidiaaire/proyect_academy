'use strict';

const BaseRepository   = require('./base.repository');
const Recommendation   = require('../models/recommendation.model');

class RecommendationRepository extends BaseRepository {
  constructor() {
    super(Recommendation);
  }

  async findByStudent(studentId) {
    return this.model.find({ student: studentId });
  }

  async findByStudentWithCourse(studentId) {
    return this.model
      .find({ student: studentId })
      .populate('course', '_id title level description')
      .sort({ createdAtRecommendation: -1 })
      .lean();
  }

  async findByStudentAndCourse(studentId, courseId) {
    return this.model.findOne({ student: studentId, course: courseId });
  }

  async exists(studentId, courseId) {
    return (await this.model.exists({ student: studentId, course: courseId })) !== null;
  }
}

module.exports = new RecommendationRepository();
