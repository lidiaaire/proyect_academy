'use strict';

class ApiError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends ApiError {
  constructor(code = 'VALIDATION_ERROR', message = 'Datos de entrada inválidos', fields = []) {
    super(400, code, message);
    this.fields = fields;
  }
}

class UnauthorizedError extends ApiError {
  constructor(code = 'UNAUTHORIZED', message = 'No autorizado') {
    super(401, code, message);
  }
}

class ForbiddenError extends ApiError {
  constructor(code = 'FORBIDDEN', message = 'Acceso denegado') {
    super(403, code, message);
  }
}

class NotFoundError extends ApiError {
  constructor(code = 'NOT_FOUND', message = 'Recurso no encontrado') {
    super(404, code, message);
  }
}

class ConflictError extends ApiError {
  constructor(code = 'CONFLICT', message = 'Conflicto con el estado actual del recurso') {
    super(409, code, message);
  }
}

class UnprocessableError extends ApiError {
  constructor(code = 'UNPROCESSABLE', message = 'No se puede procesar la solicitud') {
    super(422, code, message);
  }
}

module.exports = {
  ApiError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableError,
};
