'use strict';

const { Router }               = require('express');
const CertificateController    = require('./certificate.controller');
const verifyToken              = require('../../middlewares/verifyToken');

const router = Router();

router.get('/me',                            verifyToken, CertificateController.getMyCertificates);
router.get('/verify/:certificateNumber',                  CertificateController.verifyCertificate);
router.get('/:id/download',                 verifyToken, CertificateController.downloadCertificatePdf);

module.exports = router;
