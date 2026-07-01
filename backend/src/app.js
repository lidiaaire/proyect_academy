'use strict';

const express = require('express');
const cors    = require('cors');

const env          = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');
const notFound     = require('./middlewares/notFound');

const authRoutes         = require('./modules/auth/auth.routes');
const userRoutes         = require('./modules/users/user.routes');
const courseRoutes       = require('./modules/courses/course.routes');
const enrollmentRoutes   = require('./modules/enrollments/enrollment.routes');
const progressRoutes     = require('./modules/progress/progress.routes');
const dashboardRoutes          = require('./modules/dashboard/dashboard.routes');
const teacherAnalyticsRoutes   = require('./modules/teacher-analytics/teacher-analytics.routes');
const bookingRoutes            = require('./modules/bookings/booking.routes');
const availabilityRoutes    = require('./modules/availability/availability.routes');
const achievementRoutes     = require('./modules/achievements/achievement.routes');
const certificateRoutes       = require('./modules/certificates/certificate.routes');
const recommendationRoutes    = require('./modules/recommendations/recommendation.routes');
const notificationRoutes      = require('./modules/notifications/notification.routes');
const liveSessionRoutes       = require('./modules/liveSessions/liveSession.routes');
const attendanceRoutes        = require('./modules/attendance/attendance.routes');
const assignmentRoutes        = require('./modules/assignments/assignment.routes');
const submissionRoutes        = require('./modules/submissions/submission.routes');

const swaggerRouter = require('./docs/swagger');

const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth',      authRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/courses',   courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress',  progressRoutes);
app.use('/api/dashboard',          dashboardRoutes);
app.use('/api/teacher-analytics',  teacherAnalyticsRoutes);
app.use('/api/bookings',           bookingRoutes);
app.use('/api/availability',  availabilityRoutes);
app.use('/api/achievements',  achievementRoutes);
app.use('/api/certificates',    certificateRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/notifications',   notificationRoutes);
app.use('/api/live-sessions',   liveSessionRoutes);
app.use('/api/attendance',      attendanceRoutes);
app.use('/api/assignments',     assignmentRoutes);
app.use('/api/submissions',     submissionRoutes);

app.use('/api/docs', swaggerRouter);

// 404 y error handler — SIEMPRE al final
app.use(notFound);
app.use(errorHandler);

module.exports = app;
