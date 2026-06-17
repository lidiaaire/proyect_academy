'use strict';

const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             5,
  standardHeaders: true,
  legacyHeaders:   false,
  handler: (req, res) => {
    res.status(429).json({
      error:   'TOO_MANY_REQUESTS',
      message: 'Demasiados intentos. Inténtalo en 15 minutos.',
    });
  },
});

module.exports = { loginLimiter };
