'use strict';

const bcrypt         = require('bcryptjs');
const UserRepository = require('../repositories/user.repository');
const { ROLES }      = require('../config/constants');
const { upsert }     = require('./helpers');

const SALT = 10;
const User = UserRepository.model;

module.exports = async () => {
  const [adminHash, teacherHash, studentHash] = await Promise.all([
    bcrypt.hash('Admin2024!', SALT),
    bcrypt.hash('Teacher2024!', SALT),
    bcrypt.hash('Student2024!', SALT),
  ]);

  // ── Admin ────────────────────────────────────────────────────────────────────
  await upsert(User, { email: 'admin@elevate.com' }, {
    firstName: 'Admin', lastName: 'Elevate',
    email: 'admin@elevate.com',
    passwordHash: adminHash,
    role: ROLES.ADMIN, isActive: true,
  });

  // ── Teachers ─────────────────────────────────────────────────────────────────
  // Emma: A1/A2 — James: B1/B2 — Sofía: metodología y soporte
  const [emma, james, sofia] = await Promise.all([
    upsert(User, { email: 'emma.johnson@elevate.com' }, {
      firstName: 'Emma', lastName: 'Johnson',
      email: 'emma.johnson@elevate.com',
      passwordHash: teacherHash,
      role: ROLES.TEACHER, isActive: true,
    }),
    upsert(User, { email: 'james.parker@elevate.com' }, {
      firstName: 'James', lastName: 'Parker',
      email: 'james.parker@elevate.com',
      passwordHash: teacherHash,
      role: ROLES.TEACHER, isActive: true,
    }),
    upsert(User, { email: 'sofia.reyes@elevate.com' }, {
      firstName: 'Sofía', lastName: 'Reyes',
      email: 'sofia.reyes@elevate.com',
      passwordHash: teacherHash,
      role: ROLES.TEACHER, isActive: true,
    }),
  ]);

  // ── Students — cohorte A1 (tutora: Emma) ─────────────────────────────────────
  // Sarah: completó A1 al 100% / Amara: recién matriculada / Nina: abandonó / Carlos: progreso constante
  await Promise.all([
    upsert(User, { email: 'sarah.mitchell@demo.com' }, {
      firstName: 'Sarah', lastName: 'Mitchell',
      email: 'sarah.mitchell@demo.com',
      passwordHash: studentHash,
      role: ROLES.STUDENT, isActive: true,
      assignedTeacherId: emma._id,
    }),
    upsert(User, { email: 'amara.diallo@demo.com' }, {
      firstName: 'Amara', lastName: 'Diallo',
      email: 'amara.diallo@demo.com',
      passwordHash: studentHash,
      role: ROLES.STUDENT, isActive: true,
      assignedTeacherId: emma._id,
    }),
    upsert(User, { email: 'nina.kowalski@demo.com' }, {
      firstName: 'Nina', lastName: 'Kowalski',
      email: 'nina.kowalski@demo.com',
      passwordHash: studentHash,
      role: ROLES.STUDENT, isActive: true,
      assignedTeacherId: emma._id,
    }),
    upsert(User, { email: 'carlos.rodriguez@demo.com' }, {
      firstName: 'Carlos', lastName: 'Rodríguez',
      email: 'carlos.rodriguez@demo.com',
      passwordHash: studentHash,
      role: ROLES.STUDENT, isActive: true,
      assignedTeacherId: emma._id,
    }),
  ]);

  // ── Students — cohorte A2 (tutor: James) ─────────────────────────────────────
  await Promise.all([
    upsert(User, { email: 'maria.garcia@demo.com' }, {
      firstName: 'María', lastName: 'García',
      email: 'maria.garcia@demo.com',
      passwordHash: studentHash,
      role: ROLES.STUDENT, isActive: true,
      assignedTeacherId: james._id,
    }),
    upsert(User, { email: 'diego.herrera@demo.com' }, {
      firstName: 'Diego', lastName: 'Herrera',
      email: 'diego.herrera@demo.com',
      passwordHash: studentHash,
      role: ROLES.STUDENT, isActive: true,
      assignedTeacherId: james._id,
    }),
    upsert(User, { email: 'valentina.cruz@demo.com' }, {
      firstName: 'Valentina', lastName: 'Cruz',
      email: 'valentina.cruz@demo.com',
      passwordHash: studentHash,
      role: ROLES.STUDENT, isActive: true,
      assignedTeacherId: james._id,
    }),
    upsert(User, { email: 'andres.lopez@demo.com' }, {
      firstName: 'Andrés', lastName: 'López',
      email: 'andres.lopez@demo.com',
      passwordHash: studentHash,
      role: ROLES.STUDENT, isActive: true,
      assignedTeacherId: james._id,
    }),
  ]);

  // ── Students — cohorte B1/B2 (tutora: Sofía) ─────────────────────────────────
  await Promise.all([
    upsert(User, { email: 'lucia.fernandez@demo.com' }, {
      firstName: 'Lucía', lastName: 'Fernández',
      email: 'lucia.fernandez@demo.com',
      passwordHash: studentHash,
      role: ROLES.STUDENT, isActive: true,
      assignedTeacherId: sofia._id,
    }),
    upsert(User, { email: 'miguel.sanchez@demo.com' }, {
      firstName: 'Miguel', lastName: 'Sánchez',
      email: 'miguel.sanchez@demo.com',
      passwordHash: studentHash,
      role: ROLES.STUDENT, isActive: true,
      assignedTeacherId: sofia._id,
    }),
    upsert(User, { email: 'isabella.torres@demo.com' }, {
      firstName: 'Isabella', lastName: 'Torres',
      email: 'isabella.torres@demo.com',
      passwordHash: studentHash,
      role: ROLES.STUDENT, isActive: true,
      assignedTeacherId: sofia._id,
    }),
    upsert(User, { email: 'pablo.morales@demo.com' }, {
      firstName: 'Pablo', lastName: 'Morales',
      email: 'pablo.morales@demo.com',
      passwordHash: studentHash,
      role: ROLES.STUDENT, isActive: true,
      assignedTeacherId: sofia._id,
    }),
  ]);
};

if (require.main === module) {
  require('../config/env');
  const { connectDB }  = require('../config/database');
  const mongoose       = require('mongoose');
  connectDB()
    .then(() => module.exports())
    .then(() => mongoose.disconnect())
    .catch((err) => { console.error(err); process.exit(1); });
}
