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

  await require('./phase1.seed')();
  logger.info('[seed] phase1 completado');

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('[seed] Error fatal:', err.message);
  process.exit(1);
});
