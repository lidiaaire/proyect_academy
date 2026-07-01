'use strict';

const request = require('supertest');

// app se requiere aquí (no en el módulo) para evitar que la carga del módulo
// dispare la validación de env.js antes de que setupFiles haya actuado.
// En la práctica setupFiles garantiza que env vars estén disponibles,
// pero la carga lazy es una capa adicional de seguridad.
const getApp = () => require('../../src/app');

/**
 * Realiza un POST /api/auth/login y devuelve la respuesta completa de Supertest.
 * Útil cuando los tests necesitan verificar el cuerpo o el status code del login.
 */
const login = (email, password) =>
  request(getApp())
    .post('/api/auth/login')
    .send({ email, password });

/**
 * Obtiene un token JWT válido realizando login real contra el servidor.
 * Lanza si el login falla (las credenciales deben corresponder a un usuario
 * previamente creado con user.factory en el beforeAll del test).
 *
 * @returns {Promise<string>} Token JWT
 */
const getToken = async (email, password) => {
  const res = await login(email, password);

  if (res.status !== 201) {
    throw new Error(
      `getToken: login fallido para ${email} — status ${res.status}: ${JSON.stringify(res.body)}`
    );
  }

  return res.body.token;
};

/**
 * Construye el header Authorization listo para usar con Supertest.
 * Ejemplo: .set(authHeader(token))
 *
 * @param {string} token
 * @returns {{ Authorization: string }}
 */
const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

module.exports = { login, getToken, authHeader };
