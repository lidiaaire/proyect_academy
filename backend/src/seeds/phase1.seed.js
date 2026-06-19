'use strict';

const bcrypt = require('bcryptjs');

const UserRepository              = require('../repositories/user.repository');
const CourseRepository            = require('../repositories/course.repository');
const UnitRepository              = require('../repositories/unit.repository');
const LessonRepository            = require('../repositories/lesson.repository');
const AssessmentRepository        = require('../repositories/assessment.repository');
const EnrollmentRepository        = require('../repositories/enrollment.repository');
const LessonProgressRepository    = require('../repositories/lessonProgress.repository');
const AssessmentAttemptRepository = require('../repositories/assessmentAttempt.repository');

const {
  ROLES,
  COURSE_STATUS,
  LESSON_TYPES,
  CEFR_LEVELS,
  ENROLLMENT_STATUS,
  PROGRESS_STATUS,
} = require('../config/constants');

const SALT = 10;

const upsert = (Model, filter, data) =>
  Model.findOneAndUpdate(filter, data, { upsert: true, new: true, setDefaultsOnInsert: true });

module.exports = async () => {
  const User     = UserRepository.model;
  const Course   = CourseRepository.model;
  const Unit     = UnitRepository.model;
  const Lesson   = LessonRepository.model;
  const Assess   = AssessmentRepository.model;
  const Enroll   = EnrollmentRepository.model;
  const LP       = LessonProgressRepository.model;
  const Attempt  = AssessmentAttemptRepository.model;

  // ── 1. Admin + Teacher ──────────────────────────────────────────────────────
  const [admin, teacher] = await Promise.all([
    upsert(User, { email: 'admin@test.com' }, {
      firstName: 'Admin', lastName: 'Seed',
      email: 'admin@test.com',
      passwordHash: await bcrypt.hash('Admin1234', SALT),
      role: ROLES.ADMIN, isActive: true,
    }),
    upsert(User, { email: 'teacher@test.com' }, {
      firstName: 'Teacher', lastName: 'Seed',
      email: 'teacher@test.com',
      passwordHash: await bcrypt.hash('Teacher1234', SALT),
      role: ROLES.TEACHER, isActive: true,
    }),
  ]);

  // ── 2. Students ─────────────────────────────────────────────────────────────
  const [student1, , student3] = await Promise.all([
    upsert(User, { email: 'student1@test.com' }, {
      firstName: 'Student', lastName: 'One',
      email: 'student1@test.com',
      passwordHash: await bcrypt.hash('Student1234', SALT),
      role: ROLES.STUDENT, isActive: true,
      assignedTeacherId: teacher._id,
    }),
    upsert(User, { email: 'student2@test.com' }, {
      firstName: 'Student', lastName: 'Two',
      email: 'student2@test.com',
      passwordHash: await bcrypt.hash('Student1234', SALT),
      role: ROLES.STUDENT, isActive: true,
      assignedTeacherId: teacher._id,
    }),
    upsert(User, { email: 'student3@test.com' }, {
      firstName: 'Student', lastName: 'Three',
      email: 'student3@test.com',
      passwordHash: await bcrypt.hash('Student1234', SALT),
      role: ROLES.STUDENT, isActive: true,
      assignedTeacherId: teacher._id,
    }),
  ]);

  // ── 3. Curso ─────────────────────────────────────────────────────────────────
  const course = await upsert(Course, { title: 'English B1 Foundations' }, {
    title:       'English B1 Foundations',
    description: 'Curso de prueba para validación end-to-end',
    level:       CEFR_LEVELS.B1,
    status:      COURSE_STATUS.PUBLISHED,
  });

  // ── 4. Unidades ──────────────────────────────────────────────────────────────
  const [unit1, unit2] = await Promise.all([
    upsert(Unit, { courseId: course._id, order: 1 }, {
      courseId: course._id, title: 'Unit 1 — Greetings', order: 1, sequentialUnlock: true,
    }),
    upsert(Unit, { courseId: course._id, order: 2 }, {
      courseId: course._id, title: 'Unit 2 — Daily Life', order: 2, sequentialUnlock: true,
    }),
  ]);

  // ── 5. Lecciones ─────────────────────────────────────────────────────────────
  const [lesson11, lesson12, lesson21, lesson22] = await Promise.all([
    upsert(Lesson, { unitId: unit1._id, order: 1 }, {
      unitId: unit1._id, courseId: course._id,
      title: 'Lesson 1.1 — Hello World', type: LESSON_TYPES.TEXT,
      content: 'Contenido de prueba 1.1', order: 1,
    }),
    upsert(Lesson, { unitId: unit1._id, order: 2 }, {
      unitId: unit1._id, courseId: course._id,
      title: 'Lesson 1.2 — Introductions', type: LESSON_TYPES.TEXT,
      content: 'Contenido de prueba 1.2', order: 2,
    }),
    upsert(Lesson, { unitId: unit2._id, order: 1 }, {
      unitId: unit2._id, courseId: course._id,
      title: 'Lesson 2.1 — Morning Routine', type: LESSON_TYPES.TEXT,
      content: 'Contenido de prueba 2.1', order: 1,
    }),
    upsert(Lesson, { unitId: unit2._id, order: 2 }, {
      unitId: unit2._id, courseId: course._id,
      title: 'Lesson 2.2 — At the Office', type: LESSON_TYPES.TEXT,
      content: 'Contenido de prueba 2.2', order: 2,
    }),
  ]);

  // ── 6. Assessment (Unit 1) ───────────────────────────────────────────────────
  const assessment = await upsert(Assess, { unitId: unit1._id }, {
    unitId:       unit1._id,
    courseId:     course._id,
    title:        'Unit 1 Assessment',
    passingScore: 50,
    maxAttempts:  3,
    questions: [
      {
        text:         '¿Cómo se saluda en inglés?',
        options:      ['Hello', 'Hola', 'Bonjour', 'Ciao'],
        correctIndex: 0,
      },
      {
        text:         '¿Cuál es el saludo de la mañana?',
        options:      ['Good night', 'Good morning', 'Goodbye', 'See you'],
        correctIndex: 1,
      },
    ],
  });

  // ── 7. Enrollment student1 (active) ──────────────────────────────────────────
  const enrollment1 = await upsert(Enroll, { studentId: student1._id, courseId: course._id }, {
    studentId: student1._id, courseId: course._id, status: ENROLLMENT_STATUS.ACTIVE,
  });

  // ── 8. Enrollment student3 (suspended) ───────────────────────────────────────
  await upsert(Enroll, { studentId: student3._id, courseId: course._id }, {
    studentId: student3._id, courseId: course._id, status: ENROLLMENT_STATUS.SUSPENDED,
  });

  // ── 9. LessonProgress student1 (4 lecciones, not_started) ────────────────────
  await LessonProgressRepository.bulkCreate([
    { enrollmentId: enrollment1._id, studentId: student1._id, lessonId: lesson11._id, unitId: unit1._id, courseId: course._id, status: PROGRESS_STATUS.NOT_STARTED },
    { enrollmentId: enrollment1._id, studentId: student1._id, lessonId: lesson12._id, unitId: unit1._id, courseId: course._id, status: PROGRESS_STATUS.NOT_STARTED },
    { enrollmentId: enrollment1._id, studentId: student1._id, lessonId: lesson21._id, unitId: unit2._id, courseId: course._id, status: PROGRESS_STATUS.NOT_STARTED },
    { enrollmentId: enrollment1._id, studentId: student1._id, lessonId: lesson22._id, unitId: unit2._id, courseId: course._id, status: PROGRESS_STATUS.NOT_STARTED },
  ]).catch((err) => { if (err.code !== 11000 && err.name !== 'BulkWriteError') throw err; });

  // ── 10. Marcar Lesson 1.1 y 1.2 como completed ───────────────────────────────
  const now = new Date();
  await Promise.all([
    LP.findOneAndUpdate(
      { studentId: student1._id, lessonId: lesson11._id },
      { $set: { status: PROGRESS_STATUS.COMPLETED, completedAt: now } }
    ),
    LP.findOneAndUpdate(
      { studentId: student1._id, lessonId: lesson12._id },
      { $set: { status: PROGRESS_STATUS.COMPLETED, completedAt: now } }
    ),
  ]);

  // ── 11. AssessmentAttempt aprobado (student1, Unit 1) ────────────────────────
  const assessmentWithAnswers = await Assess.findById(assessment._id).select('+questions.correctIndex');
  const answers = assessmentWithAnswers.questions.map((q) => ({
    questionId: q._id,
    selected:   q.correctIndex,
    isCorrect:  true,
  }));

  await upsert(Attempt, { studentId: student1._id, assessmentId: assessment._id, attemptNumber: 1 }, {
    assessmentId:  assessment._id,
    studentId:     student1._id,
    attemptNumber: 1,
    answers,
    score:         100,
    passed:        true,
    submittedAt:   now,
  });
};
