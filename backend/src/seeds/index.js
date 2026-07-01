'use strict';

require('../config/env');

const mongoose   = require('mongoose');
const { connectDB } = require('../config/database');
const logger     = require('../utils/logger');

const COLLECTIONS = [
  'users',
  'courses',
  'units',
  'lessons',
  'assessments',
  'enrollments',
  'lessonprogresses',
  'assessmentattempts',
  'achievements',
];

const run = async () => {
  if (process.env.NODE_ENV !== 'development') {
    console.error('[seed] Solo se puede ejecutar en entorno development');
    process.exit(1);
  }

  await connectDB();

  await Promise.all(
    COLLECTIONS.map((col) => mongoose.connection.collection(col).deleteMany({}))
  );
  logger.info('[seed] Colecciones limpiadas');

  await require('./users.seed')();
  logger.info('[seed] Usuarios creados (1 admin, 3 teachers, 12 students)');

  await require('./content/a1.seed')();
  logger.info('[seed] Curso A1 — English Survival Kit creado');

  await require('./content/a2.seed')();
  logger.info('[seed] Curso A2 — English Every Day creado');

  await require('./content/b1.seed')();
  logger.info('[seed] Curso B1 — English Unplugged creado');

  await require('./content/b2.seed')();
  logger.info('[seed] Curso B2 — English in Depth creado');

  await require('./achievements.seed')();
  logger.info('[seed] Achievements creados (10 logros)');

  // await require('./enrollments.seed')();
  // logger.info('[seed] Matrículas y progreso creados');

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('[seed] Error fatal:', err.message);
  process.exit(1);
});
