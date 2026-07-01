'use strict';

const path    = require('path');
const fs      = require('fs');
const yaml    = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const DOCS_DIR = __dirname;

const base = {
  openapi: '3.0.3',
  info: {
    title: 'Elevate Your English — Campus API',
    version: '1.0.0',
    description: 'Documentación completa de la API REST del LMS.',
  },
  servers: [{ url: '/api', description: 'Servidor actual' }],
  components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
  security: [{ bearerAuth: [] }],
  tags: [],
  paths: {},
};

function mergeSpec() {
  const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.yaml'));

  for (const file of files) {
    const doc = yaml.load(fs.readFileSync(path.join(DOCS_DIR, file), 'utf8'));

    if (doc.tags)  base.tags.push(...doc.tags);
    if (doc.paths) Object.assign(base.paths, doc.paths);

    if (doc.components) {
      for (const [section, defs] of Object.entries(doc.components)) {
        if (section === 'securitySchemes') continue;
        base.components[section] = { ...(base.components[section] ?? {}), ...defs };
      }
    }
  }

  return base;
}

const spec = mergeSpec();

const router = require('express').Router();
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(spec, { explorer: false }));

module.exports = router;
