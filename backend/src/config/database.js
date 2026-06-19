'use strict';

const mongoose = require('mongoose');
const logger   = require('../utils/logger');
const env      = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongodbUri);
    logger.info(`MongoDB conectado: ${mongoose.connection.host}`);
  } catch (err) {
    logger.error('No se pudo conectar a MongoDB:', err.message);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
  logger.error('Error de MongoDB:', err.message);
});

module.exports = { connectDB };
