'use strict';

const { CEFR_LEVELS, COURSE_STATUS } = require('../../config/constants');
const { upsert }                      = require('../helpers');
const CourseRepository                = require('../../repositories/course.repository');

const seedUnit1 = require('./a1/unit1.seed');
const seedUnit2 = require('./a1/unit2.seed');
const seedUnit3 = require('./a1/unit3.seed');
const seedUnit4 = require('./a1/unit4.seed');
const seedUnit5 = require('./a1/unit5.seed');
const seedUnit6 = require('./a1/unit6.seed');

const Course = CourseRepository.model;

const COURSE_A1 = {
  title:       'English Survival Kit',
  description: 'Aprende inglés desde cero con English Survival Kit, el curso A1 diseñado para hispanohablantes. En seis unidades progresivas aprenderás a saludarte y presentarte, hablar de números y tiempo, describir personas y relaciones, contar tu rutina diaria, moverte por una ciudad y pedir comida en un restaurante. Vocabulario, gramática, vídeo y práctica interactiva en cada unidad, con evaluación final para confirmar tu progreso.',
  level:       CEFR_LEVELS.A1,
  status:      COURSE_STATUS.PUBLISHED,
};

module.exports = async () => {
  const course   = await upsert(Course, { title: COURSE_A1.title }, COURSE_A1);
  const courseId = course._id;

  await seedUnit1(courseId);
  await seedUnit2(courseId);
  await seedUnit3(courseId);
  await seedUnit4(courseId);
  await seedUnit5(courseId);
  await seedUnit6(courseId);
};

if (require.main === module) {
  require('../../config/env');
  const { connectDB } = require('../../config/database');
  const mongoose      = require('mongoose');
  connectDB()
    .then(() => module.exports())
    .then(() => mongoose.disconnect())
    .catch((err) => { console.error(err); process.exit(1); });
}
