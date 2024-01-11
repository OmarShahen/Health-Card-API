"use strict";

var router = require('express').Router();

var paymentsController = require('../controllers/payments');

var authorization = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyAppointmentId = _require.verifyAppointmentId;

router.post('/v1/payments/paymob', authorization.allPermission, function (request, response) {
  return paymentsController.createPaymentURL(request, response);
});
router.post('/v1/payments/paymob/process', function (request, response) {
  return paymentsController.processPayment(request, response);
});
router.get('/v1/payments', authorization.allPermission, function (request, response) {
  return paymentsController.getPayments(request, response);
});
router.post('/v1/payments/refund/appointments/:appointmentId', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return paymentsController.refundPayment(request, response);
});
router.post('/v1/payments/full-refund/appointments/:appointmentId', authorization.adminAndExpertPermission, verifyAppointmentId, function (request, response) {
  return paymentsController.refundPayment(request, response);
});
module.exports = router;