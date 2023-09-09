"use strict";

var router = require('express').Router();

var invoicesController = require('../controllers/invoices');

var _require = require('../middlewares/verify-routes-params'),
    verifyInvoiceId = _require.verifyInvoiceId,
    verifyClinicId = _require.verifyClinicId,
    verifyPatientId = _require.verifyPatientId,
    verifyUserId = _require.verifyUserId,
    verifyInsuranceId = _require.verifyInsuranceId;

var _require2 = require('../middlewares/verify-clinic-mode'),
    verifyClinicInvoices = _require2.verifyClinicInvoices;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/invoices', authorization.allPermission, function (request, response) {
  return invoicesController.getInvoices(request, response);
});
router.get('/v1/invoices/:invoiceId', authorization.allPermission, verifyInvoiceId, function (request, response) {
  return invoicesController.getInvoice(request, response);
});
router.get('/v1/invoices/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return invoicesController.getInvoicesByClinicId(request, response);
});
router.get('/v1/invoices/patients/:patientId', authorization.allPermission, verifyPatientId, function (request, response) {
  return invoicesController.getInvoicesByPatientId(request, response);
});
router.get('/v1/invoices/clinics/:clinicId/patients/:patientId', authorization.allPermission, verifyClinicId, verifyPatientId, function (request, response) {
  return invoicesController.getClinicInvoicesByPatientId(request, response);
});
router.get('/v1/invoices/owners/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return invoicesController.getInvoicesByOwnerId(request, response);
});
router.get('/v1/invoices/insurance-companies/:insuranceId', authorization.allPermission, verifyInsuranceId, function (request, response) {
  return invoicesController.getInvoicesByInsuranceCompanyId(request, response);
});
router.post('/v1/invoices', authorization.allPermission, verifyClinicInvoices, function (request, response) {
  return invoicesController.addInvoice(request, response);
});
router.put('/v1/invoices/:invoiceId', authorization.allPermission, verifyInvoiceId, function (request, response) {
  return invoicesController.updateInvoice(request, response);
});
router.patch('/v1/invoices/:invoiceId/status', authorization.allPermission, verifyInvoiceId, function (request, response) {
  return invoicesController.updateInvoiceStatus(request, response);
});
router.patch('/v1/invoices/:invoiceId/paid', authorization.allPermission, verifyInvoiceId, function (request, response) {
  return invoicesController.updateInvoicePaid(request, response);
});
router["delete"]('/v1/invoices/:invoiceId', authorization.allPermission, verifyInvoiceId, function (request, response) {
  return invoicesController.deleteInvoice(request, response);
});
module.exports = router;