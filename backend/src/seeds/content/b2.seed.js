'use strict';

const { CEFR_LEVELS, COURSE_STATUS } = require('../../config/constants');
const { upsert }                      = require('../helpers');
const CourseRepository                = require('../../repositories/course.repository');

const seedUnit1 = require('./b2/unit1.seed');
const seedUnit2 = require('./b2/unit2.seed');
const seedUnit3 = require('./b2/unit3.seed');
const seedUnit4 = require('./b2/unit4.seed');
const seedUnit5 = require('./b2/unit5.seed');
const seedUnit6 = require('./b2/unit6.seed');

const Course = CourseRepository.model;

const COURSE_B2 = {
  title:       'English in Depth',
  description: 'Alcanza el nivel avanzado con English in Depth, el curso B2 para profesionales hispanohablantes. En seis unidades progresivas dominarás el sistema condicional completo —Type 3 y condicionales mixtos—, los verbos modales para deducir, especular y evaluar decisiones pasadas, las estructuras de énfasis avanzado con cleft sentences e inversión, la pasiva impersonal y la causativa en contextos ejecutivos, los discourse markers y el hedging para argumentar con precisión, y la integración de todas estas competencias en informes, negociaciones y presentaciones de alto nivel. Gramática B2 en contexto profesional real.',
  level:       CEFR_LEVELS.B2,
  status:      COURSE_STATUS.PUBLISHED,
};

module.exports = async () => {
  const course   = await upsert(Course, { title: COURSE_B2.title }, COURSE_B2);
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
