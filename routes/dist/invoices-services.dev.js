"use strict";

var router = require('express').Router();

var invoicesServicesController = require('../controllers/invoices-services');

var tokenMiddleware = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyInvoiceServiceId = _require.verifyInvoiceServiceId,
    verifyInvoiceId = _require.verifyInvoiceId;

router.get('/v1/invoices-services', function (request, response) {
  return invoicesServicesController.getInvoicesServices(request, response);
});
router.get('/v1/invoices-services/invoices/:invoiceId', verifyInvoiceId, function (request, response) {
  return invoicesServicesController.getInvoiceServices(request, response);
});
router.post('/v1/invoices-services', function (request, response) {
  return invoicesServicesController.addInvoiceService(request, response);
});
router["delete"]('/v1/invoices-services/:invoiceServiceId', verifyInvoiceServiceId, function (request, response) {
  return invoicesServicesController.deleteInvoiceService(request, response);
});
module.exports = router;