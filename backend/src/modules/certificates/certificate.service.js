'use strict';

/**
 * modules/certificates/certificate.service.js
 *
 * Responsabilidad: Emisión de certificados académicos.
 *
 * Métodos:
 *
 *   issueCertificate(studentId, courseId, finalScore)
 *     → Si el certificado ya existe, lo devuelve.
 *     → Si no existe, genera un certificateNumber único, crea el certificado,
 *       genera el PDF, lo guarda en disco y actualiza pdfUrl.
 */

const fs   = require('fs');
const path = require('path');

const CertificateRepository      = require('../../repositories/certificate.repository');
const CourseRepository           = require('../../repositories/course.repository');
const { generateCertificatePdf } = require('./certificatePdf.service');
const { NotFoundError, ForbiddenError } = require('../../utils/ApiError');
const { createNotification }     = require('../notifications/notification.service');

const UPLOADS_DIR = path.join(__dirname, '../../../../uploads/certificates');

// Formato: CERT-<timestamp en base36 mayúsculas>-<5 chars aleatorios en base36>
// Ejemplo: CERT-LK8XJB3K-A7F2C
const _generateCertificateNumber = () => {
  const ts     = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `CERT-${ts}-${random}`;
};

const issueCertificate = async (studentId, courseId, finalScore) => {
  const existing = await CertificateRepository.findByStudentAndCourse(studentId, courseId);
  if (existing) return existing;

  const certificate = await CertificateRepository.create({
    student:           studentId,
    course:            courseId,
    finalScore,
    certificateNumber: _generateCertificateNumber(),
    pdfUrl:            null,
  });

  const populated = await CertificateRepository.findByCertificateNumber(certificate.certificateNumber);
  const pdfBuffer = await generateCertificatePdf(populated);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(UPLOADS_DIR, `${certificate.certificateNumber}.pdf`),
    pdfBuffer,
  );

  const pdfUrl    = `/uploads/certificates/${certificate.certificateNumber}.pdf`;
  const updated   = await CertificateRepository.updateById(certificate._id, { pdfUrl }, { new: true });

  const course = await CourseRepository.findById(courseId);
  await createNotification(
    studentId,
    'CERTIFICATE',
    'Certificate issued',
    `Your certificate for ${course?.title ?? 'the course'} is ready.`,
    {
      certificateId:     certificate._id,
      certificateNumber: certificate.certificateNumber,
      courseId:          courseId,
    },
  );

  return updated;
};

const getMyCertificates = async (studentId) => {
  const docs = await CertificateRepository.findByStudentWithCourse(studentId);
  return docs.map((c) => ({
    certificateNumber: c.certificateNumber,
    issueDate:         c.issueDate,
    finalScore:        c.finalScore,
    pdfUrl:            c.pdfUrl,
    course: {
      _id:   c.course._id,
      title: c.course.title,
      level: c.course.level,
    },
  }));
};

const getCertificatePdf = async (studentId, certificateId) => {
  const certificate = await CertificateRepository.findById(certificateId);

  if (!certificate) {
    throw new NotFoundError('CERTIFICATE_NOT_FOUND', 'Certificado no encontrado');
  }

  if (certificate.student.toString() !== studentId.toString()) {
    throw new ForbiddenError('CERTIFICATE_FORBIDDEN', 'No tienes acceso a este certificado');
  }

  if (!certificate.pdfUrl) {
    throw new NotFoundError('CERTIFICATE_PDF_NOT_FOUND', 'El PDF de este certificado no está disponible');
  }

  return path.join(UPLOADS_DIR, `${certificate.certificateNumber}.pdf`);
};

const verifyCertificate = async (certificateNumber) => {
  const certificate = await CertificateRepository.findByCertificateNumber(certificateNumber);

  if (!certificate) {
    throw new NotFoundError('CERTIFICATE_NOT_FOUND', 'Certificado no encontrado');
  }

  return {
    certificateNumber: certificate.certificateNumber,
    issueDate:         certificate.issueDate,
    finalScore:        certificate.finalScore,
    student: {
      firstName: certificate.student.firstName,
      lastName:  certificate.student.lastName,
    },
    course: {
      title: certificate.course.title,
      level: certificate.course.level,
    },
  };
};

module.exports = { issueCertificate, getMyCertificates, getCertificatePdf, verifyCertificate };
