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
const bookingRoutes      = require('./modules/bookings/booking.routes');
const availabilityRoutes = require('./modules/availability/availability.routes');

const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth',     authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/courses',  courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/teachers', availabilityRoutes);

// 404 y error handler — SIEMPRE al final
app.use(notFound);
app.use(errorHandler);

module.exports = app;
