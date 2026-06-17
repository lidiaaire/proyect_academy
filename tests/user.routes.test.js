'use strict';

process.env.PORT          = '3000';
process.env.NODE_ENV      = 'test';
process.env.MONGODB_URI   = 'mongodb://localhost:27017/test';
process.env.JWT_SECRET    = 'test-secret-32chars-minimum-length';
process.env.JWT_TTL_ADMIN   = '1h';
process.env.JWT_TTL_TEACHER = '1h';
process.env.JWT_TTL_STUDENT = '1h';
process.env.CLIENT_URL    = 'http://localhost:3000';

const router         = require('../src/modules/users/user.routes');
const userController = require('../src/modules/users/user.controller');

// Rutas registradas con sus stacks completos
const getRouteLayers = (r) =>
  r.stack.filter((l) => l.route).map((l) => ({
    path:     l.route.path,
    methods:  Object.keys(l.route.methods).map((m) => m.toUpperCase()),
    stack:    l.route.stack,
    handlers: l.route.stack.map((s) => s.handle.name || '<anon>'),
    fns:      l.route.stack.map((s) => s.handle),
  }));

const findRoute = (r, method, path) =>
  getRouteLayers(r).find((rt) => rt.path === path && rt.methods.includes(method.toUpperCase()));

describe('user.routes — estructura', () => {
  test('el router exporta un Express Router', () => {
    expect(typeof router).toBe('function');
    expect(Array.isArray(router.stack)).toBe(true);
  });

  test('define exactamente 6 rutas', () => {
    expect(getRouteLayers(router).length).toBe(6);
  });

  describe('rutas registradas', () => {
    test.each([
      ['GET',   '/'],
      ['GET',   '/:id'],
      ['POST',  '/'],
      ['PATCH', '/:id/activate'],
      ['PATCH', '/:id/deactivate'],
      ['PATCH', '/:id'],
    ])('%s %s existe', (method, path) => {
      expect(findRoute(router, method, path)).toBeDefined();
    });
  });

  test('/:id/activate y /:id/deactivate registrados ANTES que /:id (sin shadowing)', () => {
    const paths = getRouteLayers(router).map((l) => l.path);
    const activateIdx   = paths.indexOf('/:id/activate');
    const deactivateIdx = paths.indexOf('/:id/deactivate');
    const patchIdIdx    = paths.lastIndexOf('/:id');
    expect(activateIdx).toBeLessThan(patchIdIdx);
    expect(deactivateIdx).toBeLessThan(patchIdIdx);
  });

  describe('requireActiveUser en rutas de escritura', () => {
    test.each([
      ['POST',  '/'],
      ['PATCH', '/:id/activate'],
      ['PATCH', '/:id/deactivate'],
      ['PATCH', '/:id'],
    ])('%s %s incluye requireActiveUser', (method, path) => {
      expect(findRoute(router, method, path).handlers).toContain('requireActiveUser');
    });
  });

  test('GET / no incluye requireActiveUser (lectura)', () => {
    expect(findRoute(router, 'GET', '/').handlers).not.toContain('requireActiveUser');
  });

  test('GET /:id no incluye requireActiveUser (lectura)', () => {
    expect(findRoute(router, 'GET', '/:id').handlers).not.toContain('requireActiveUser');
  });

  // Verificación de controllers por referencia de función — independiente del nombre
  describe('controllers correctos por referencia', () => {
    test('GET  /          → listUsers',     () => {
      const route = findRoute(router, 'GET', '/');
      expect(route.fns).toContain(userController.listUsers);
    });
    test('GET  /:id       → getUserById',   () => {
      const route = findRoute(router, 'GET', '/:id');
      expect(route.fns).toContain(userController.getUserById);
    });
    test('POST /          → createUser',    () => {
      const route = findRoute(router, 'POST', '/');
      expect(route.fns).toContain(userController.createUser);
    });
    test('PATCH /:id/activate   → activateUser',  () => {
      const route = findRoute(router, 'PATCH', '/:id/activate');
      expect(route.fns).toContain(userController.activateUser);
    });
    test('PATCH /:id/deactivate → deactivateUser', () => {
      const route = findRoute(router, 'PATCH', '/:id/deactivate');
      expect(route.fns).toContain(userController.deactivateUser);
    });
    test('PATCH /:id      → updateUser',    () => {
      const route = findRoute(router, 'PATCH', '/:id');
      expect(route.fns).toContain(userController.updateUser);
    });
  });
});
