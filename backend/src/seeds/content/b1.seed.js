'use strict';

const { CEFR_LEVELS, COURSE_STATUS } = require('../../config/constants');
const { upsert }                      = require('../helpers');
const CourseRepository                = require('../../repositories/course.repository');

const seedUnit1 = require('./b1/unit1.seed');
const seedUnit2 = require('./b1/unit2.seed');
const seedUnit3 = require('./b1/unit3.seed');
const seedUnit4 = require('./b1/unit4.seed');
const seedUnit5 = require('./b1/unit5.seed');
const seedUnit6 = require('./b1/unit6.seed');

const Course = CourseRepository.model;

const COURSE_B1 = {
  title:       'English Unplugged',
  description: 'Lleva tu inglés al nivel intermedio con English Unplugged, el curso B1 para hispanohablantes. En seis unidades progresivas aprenderás a narrar historias con los tiempos del pasado, hablar del futuro con precisión, expresar opiniones y debatir con argumentos sólidos, usar la voz pasiva y los medios de comunicación, describir viajes y diferencias culturales con cláusulas de relativo y el conditional type 2, y comunicarte con eficacia en entornos profesionales usando el estilo indirecto. Gramática B1 integrada, vídeo auténtico y práctica contextualizada en cada unidad.',
  level:       CEFR_LEVELS.B1,
  status:      COURSE_STATUS.PUBLISHED,
};

module.exports = async () => {
  const course   = await upsert(Course, { title: COURSE_B1.title }, COURSE_B1);
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
