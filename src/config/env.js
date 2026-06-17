'use strict';

require('dotenv').config();

const REQUIRED = [
  'PORT',
  'NODE_ENV',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_TTL_ADMIN',
  'JWT_TTL_TEACHER',
  'JWT_TTL_STUDENT',
  'CLIENT_URL',
];

const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`\n[FATAL] Variables de entorno faltantes: ${missing.join(', ')}`);
  console.error('[FATAL] Copia .env.example a .env y completa todos los valores\n');
  process.exit(1);
}

module.exports = Object.freeze({
  port:          parseInt(process.env.PORT, 10),
  nodeEnv:       process.env.NODE_ENV,
  mongodbUri:    process.env.MONGODB_URI,
  jwtSecret:     process.env.JWT_SECRET,
  jwtTtlAdmin:   process.env.JWT_TTL_ADMIN,
  jwtTtlTeacher: process.env.JWT_TTL_TEACHER,
  jwtTtlStudent: process.env.JWT_TTL_STUDENT,
  clientUrl:     process.env.CLIENT_URL,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction:  process.env.NODE_ENV === 'production',
});
