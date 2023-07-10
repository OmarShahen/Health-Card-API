"use strict";

var router = require('express').Router();

var invoicesServicesController = require('../controllers/invoices-services');

var _require = require('../middlewares/verify-routes-params'),
    verifyInvoiceServiceId = _require.verifyInvoiceServiceId,
    verifyInvoiceId = _require.verifyInvoiceId;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/invoices-services', authorization.allPermission, function (request, response) {
  return invoicesServicesController.getInvoicesServices(request, response);
});
router.get('/v1/invoices-services/invoices/:invoiceId', authorization.allPermission, verifyInvoiceId, function (request, response) {
  return invoicesServicesController.getInvoiceServices(request, response);
});
router.post('/v1/invoices-services', authorization.allPermission, function (request, response) {
  return invoicesServicesController.addInvoiceService(request, response);
});
router["delete"]('/v1/invoices-services/:invoiceServiceId', authorization.allPermission, verifyInvoiceServiceId, function (request, response) {
  return invoicesServicesController.deleteInvoiceService(request, response);
});
module.exports = router;