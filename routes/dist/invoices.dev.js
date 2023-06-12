"use strict";

var router = require('express').Router();

var invoicesController = require('../controllers/invoices');

var tokenMiddleware = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyInvoiceId = _require.verifyInvoiceId,
    verifyClinicId = _require.verifyClinicId,
    verifyPatientId = _require.verifyPatientId;

router.get('/v1/invoices', function (request, response) {
  return invoicesController.getInvoices(request, response);
});
router.get('/v1/invoices/:invoiceId', verifyInvoiceId, function (request, response) {
  return invoicesController.getInvoice(request, response);
});
router.get('/v1/invoices/clinics/:clinicId', verifyClinicId, function (request, response) {
  return invoicesController.getInvoicesByClinicId(request, response);
});
router.get('/v1/invoices/patients/:patientId', verifyPatientId, function (request, response) {
  return invoicesController.getInvoicesByPatientId(request, response);
});
router.post('/v1/invoices', function (request, response) {
  return invoicesController.addInvoice(request, response);
});
router.patch('/v1/invoices/:invoiceId/status', verifyInvoiceId, function (request, response) {
  return invoicesController.updateInvoiceStatus(request, response);
});
router["delete"]('/v1/invoices/:invoiceId', verifyInvoiceId, function (request, response) {
  return invoicesController.deleteInvoice(request, response);
});
module.exports = router;