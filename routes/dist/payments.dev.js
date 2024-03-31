"use strict";

var router = require('express').Router();

var paymentsController = require('../controllers/payments');

var authorization = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyAppointmentId = _require.verifyAppointmentId,
    verifyUserId = _require.verifyUserId,
    verifyPaymentId = _require.verifyPaymentId;

router.post('/v1/payments/paymob', authorization.allPermission, function (request, response) {
  return paymentsController.createPaymentURL(request, response);
});
router.post('/v1/payments/paymob/mobile-wallets', authorization.allPermission, function (request, response) {
  return paymentsController.createMobileWalletPaymentURL(request, response);
});
router.post('/v1/payments/paymob/process', function (request, response) {
  return paymentsController.processPayment(request, response);
});
router.get('/v1/payments', authorization.allPermission, function (request, response) {
  return paymentsController.getPayments(request, response);
});
router.get('/v1/payments/experts/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return paymentsController.getExpertPayments(request, response);
});
router.get('/v1/payments/statistics', authorization.allPermission, function (request, response) {
  return paymentsController.getPaymentsStatistics(request, response);
});
router.get('/v1/payments/experts/:userId/statistics', authorization.allPermission, verifyUserId, function (request, response) {
  return paymentsController.getExpertPaymentsStatistics(request, response);
});
router.post('/v1/payments/refund/appointments/:appointmentId', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return paymentsController.refundPayment(request, response);
});
router.post('/v1/payments/full-refund/appointments/:appointmentId', authorization.adminAndExpertPermission, verifyAppointmentId, function (request, response) {
  return paymentsController.fullRefundPayment(request, response);
});
router.patch('/v1/payments/:paymentId/expert-paid', authorization.allPermission, verifyPaymentId, function (request, response) {
  return paymentsController.updatePaymentExpertPaid(request, response);
});
module.exports = router;