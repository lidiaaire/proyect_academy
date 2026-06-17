'use strict';

require('dotenv').config();

const env          = require('./config/env');
const { connectDB } = require('./config/database');
const app          = require('./app');
const logger       = require('./utils/logger');

const start = async () => {
  await connectDB();

  const server = app.listen(env.port, () => {
    logger.info(`Servidor escuchando en http://localhost:${env.port}`);
    logger.info(`Entorno: ${env.nodeEnv}`);
  });

  const shutdown = (signal) => {
    logger.warn(`Señal ${signal} recibida. Cerrando servidor...`);
    server.close(() => {
      logger.info('Servidor HTTP cerrado');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason);
    process.exit(1);
  });
};

start();
