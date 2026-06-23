'use strict';

const { CEFR_LEVELS, COURSE_STATUS } = require('../../config/constants');
const { upsert }                      = require('../helpers');
const CourseRepository                = require('../../repositories/course.repository');

const seedUnit1 = require('./a2/unit1.seed');
const seedUnit2 = require('./a2/unit2.seed');
const seedUnit3 = require('./a2/unit3.seed');
const seedUnit4 = require('./a2/unit4.seed');
const seedUnit5 = require('./a2/unit5.seed');
const seedUnit6 = require('./a2/unit6.seed');

const Course = CourseRepository.model;

const COURSE_A2 = {
  title:       'English Every Day',
  description: 'Da el salto del inglés de supervivencia al inglés cotidiano con English Every Day, el curso A2 para hispanohablantes. En seis unidades aprenderás a hablar del pasado con el Past Simple, comparar productos y precios, moverte con confianza en el sistema sanitario, viajar y usar el transporte, describir el tiempo y las estaciones, y hablar de tu trabajo y tus aficiones. Gramática progresiva, vídeo auténtico y práctica contextualizada en cada unidad.',
  level:       CEFR_LEVELS.A2,
  status:      COURSE_STATUS.PUBLISHED,
};

module.exports = async () => {
  const course   = await upsert(Course, { title: COURSE_A2.title }, COURSE_A2);
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
