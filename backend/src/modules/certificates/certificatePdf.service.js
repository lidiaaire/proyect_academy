'use strict';

/**
 * modules/certificates/certificatePdf.service.js
 *
 * Responsabilidad: Generación de PDFs para certificados emitidos.
 *
 * Métodos:
 *
 *   generateCertificatePdf(certificate)
 *     → Espera certificate con student y course populados.
 *     → Genera un PDF en memoria y devuelve un Buffer.
 *     → No escribe archivos en disco.
 */

const PDFDocument = require('pdfkit');
const QRCode      = require('qrcode');

const generateCertificatePdf = async (certificate) => {
  if (!certificate) {
    throw new Error('certificate es requerido');
  }

  const qrUrl    = `/api/certificates/verify/${certificate.certificateNumber}`;
  const qrBuffer = await QRCode.toBuffer(qrUrl, { width: 100 });

  return new Promise((resolve, reject) => {
    const doc    = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data',  (chunk) => chunks.push(chunk));
    doc.on('end',   () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const { width, height } = doc.page;
    const margin = 40;

    // Borde simple alrededor de la página
    doc.rect(margin, margin, width - margin * 2, height - margin * 2).stroke();

    const studentName = `${certificate.student.firstName} ${certificate.student.lastName}`;
    const issueDate   = new Date(certificate.issueDate).toLocaleDateString('en-GB');

    // Título
    doc.moveDown(2);
    doc.fontSize(28).text('Elevate Your English Campus', { align: 'center' });

    doc.moveDown(1);

    // Subtítulo
    doc.fontSize(18).text('Certificate of Completion', { align: 'center' });

    doc.moveDown(2);

    // Cuerpo del certificado
    doc.fontSize(14)
      .text(`Student: ${studentName}`,             { align: 'center' })
      .moveDown(0.5)
      .text(`Course: ${certificate.course.title}`, { align: 'center' })
      .moveDown(0.5)
      .text(`Level: ${certificate.course.level}`,  { align: 'center' })
      .moveDown(0.5)
      .text(`Final Score: ${certificate.finalScore}%`, { align: 'center' });

    doc.moveDown(2);

    // Datos de emisión
    doc.fontSize(11)
      .text(`Certificate Number: ${certificate.certificateNumber}`, { align: 'center' })
      .moveDown(0.5)
      .text(`Issue Date: ${issueDate}`, { align: 'center' });

    doc.moveDown(3);

    // Sección de verificación
    const separador = '----------------------------------------';
    doc.fontSize(10)
      .text(separador, { align: 'center' })
      .moveDown(0.5)
      .text('Verification', { align: 'center' })
      .moveDown(0.5)
      .text(`Certificate Number: ${certificate.certificateNumber}`, { align: 'center' })
      .moveDown(0.5)
      .text('This certificate can be verified using its unique certificate number.', { align: 'center' })
      .moveDown(0.5)
      .text(separador, { align: 'center' });

    // QR centrado debajo de la sección de verificación
    doc.moveDown(1);
    const qrSize = 100;
    const qrX    = (width - qrSize) / 2;
    doc.image(qrBuffer, qrX, doc.y, { width: qrSize, height: qrSize });

    doc.end();
  });
};

module.exports = { generateCertificatePdf };
