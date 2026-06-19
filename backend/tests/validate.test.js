'use strict';

const { body } = require('express-validator');
const validate = require('../src/middlewares/validate');
const { ValidationError } = require('../src/utils/ApiError');

// Ejecuta un array de middlewares de express-validator sobre un req mock.
const runMiddlewares = async (middlewares, req, res = {}) => {
  for (const mw of middlewares) {
    await new Promise((resolve, reject) => {
      mw(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};

describe('validate middleware', () => {
  test('llama next() sin errores cuando el body es válido', async () => {
    const schema = [body('name').trim().notEmpty()];
    const middlewares = validate(schema);
    const req = { body: { name: 'Ana' }, headers: {}, params: {}, query: {} };

    await expect(runMiddlewares(middlewares, req)).resolves.toBeUndefined();
  });

  test('lanza ValidationError cuando hay un campo inválido', async () => {
    const schema = [body('email').isEmail().withMessage('Email inválido')];
    const middlewares = validate(schema);
    const req = { body: { email: 'no-es-email' }, headers: {}, params: {}, query: {} };

    await expect(runMiddlewares(middlewares, req)).rejects.toBeInstanceOf(ValidationError);
  });

  test('el ValidationError tiene statusCode 400', async () => {
    const schema = [body('name').notEmpty().withMessage('Nombre requerido')];
    const middlewares = validate(schema);
    const req = { body: {}, headers: {}, params: {}, query: {} };

    let caught;
    try {
      await runMiddlewares(middlewares, req);
    } catch (err) {
      caught = err;
    }
    expect(caught.statusCode).toBe(400);
    expect(caught.code).toBe('VALIDATION_ERROR');
  });

  test('fields contiene el campo y el mensaje correcto', async () => {
    const schema = [body('email').isEmail().withMessage('Formato inválido')];
    const middlewares = validate(schema);
    const req = { body: { email: 'mal' }, headers: {}, params: {}, query: {} };

    let caught;
    try {
      await runMiddlewares(middlewares, req);
    } catch (err) {
      caught = err;
    }
    expect(caught.fields).toEqual(
      expect.arrayContaining([{ field: 'email', message: 'Formato inválido' }])
    );
  });

  test('acumula múltiples errores en fields', async () => {
    const schema = [
      body('name').notEmpty().withMessage('Nombre requerido'),
      body('email').isEmail().withMessage('Email inválido'),
    ];
    const middlewares = validate(schema);
    const req = { body: { name: '', email: 'mal' }, headers: {}, params: {}, query: {} };

    let caught;
    try {
      await runMiddlewares(middlewares, req);
    } catch (err) {
      caught = err;
    }
    expect(caught.fields.length).toBe(2);
  });

  test('devuelve un array de middlewares (chains + errorCollector)', () => {
    const schema = [body('name').notEmpty()];
    const result = validate(schema);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2); // 1 chain + 1 errorCollector
  });
});
