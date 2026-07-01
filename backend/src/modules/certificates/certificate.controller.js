'use strict';

const asyncHandler          = require('../../utils/asyncHandler');
const CertificateService    = require('./certificate.service');

const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await CertificateService.getMyCertificates(req.user.userId);
  res.status(200).json({ certificates });
});

const downloadCertificatePdf = asyncHandler(async (req, res) => {
  const filePath = await CertificateService.getCertificatePdf(req.user.userId, req.params.id);
  res.download(filePath);
});

const verifyCertificate = asyncHandler(async (req, res) => {
  const data = await CertificateService.verifyCertificate(req.params.certificateNumber);
  res.status(200).json({ certificate: data });
});

module.exports = { getMyCertificates, downloadCertificatePdf, verifyCertificate };
