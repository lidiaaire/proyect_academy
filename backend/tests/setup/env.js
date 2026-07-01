'use strict';

// Variables de entorno para el entorno de test.
// Este archivo se carga automáticamente antes de cada suite (setupFiles en jest config)
// para que env.js no falle al validar variables requeridas.
// MONGODB_URI es un placeholder: db.js lo sobreescribe con la URI real de MongoMemoryServer.

process.env.PORT             = '3001';
process.env.NODE_ENV         = 'test';
process.env.MONGODB_URI      = 'mongodb://localhost/placeholder-overridden-by-memorymongo';
process.env.JWT_SECRET       = 'test-secret-at-least-32-characters-long!!';
process.env.JWT_TTL_ADMIN    = '1h';
process.env.JWT_TTL_TEACHER  = '1h';
process.env.JWT_TTL_STUDENT  = '1h';
process.env.CLIENT_URL       = 'http://localhost:3001';
