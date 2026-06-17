'use strict';

const { ApiError } = require('../utils/ApiError');
const logger       = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    const body = { error: err.code, message: err.message };
    if (err.fields && err.fields.length > 0) body.fields = err.fields;
    return res.status(err.statusCode).json(body);
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'INVALID_ID', message: 'El identificador proporcionado no es válido' });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'campo';
    return res.status(409).json({ error: 'DUPLICATE_KEY', message: `Ya existe un registro con ese valor en '${field}'` });
  }

  logger.error(`${req.method} ${req.originalUrl}`, err);

  const message = process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor';
  return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message });
};

module.exports = errorHandler;
