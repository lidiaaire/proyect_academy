'use strict';

const { NotFoundError } = require('../utils/ApiError');

const notFound = (req, res, next) => {
  next(new NotFoundError('ROUTE_NOT_FOUND', `Ruta ${req.method} ${req.originalUrl} no encontrada`));
};

module.exports = notFound;
