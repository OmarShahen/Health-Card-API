"use strict";

var router = require('express').Router();

var appointmentsController = require('../controllers/appointments');

var _require = require('../middlewares/verify-routes-params'),
    verifyUserId = _require.verifyUserId,
    verifyAppointmentId = _require.verifyAppointmentId;

var authorization = require('../middlewares/verify-permission');

router.post('/v1/appointments', authorization.allPermission, function (request, response) {
  return appointmentsController.addAppointment(request, response);
});
router.get('/v1/appointments/experts/:userId/status/:status/payments/paid', authorization.allPermission, verifyUserId, function (request, response) {
  return appointmentsController.getPaidAppointmentsByExpertIdAndStatus(request, response);
});
router.get('/v1/appointments/seekers/:userId/status/:status/payments/paid', authorization.allPermission, verifyUserId, function (request, response) {
  return appointmentsController.getPaidAppointmentsBySeekerIdAndStatus(request, response);
});
router.get('/v1/appointments/:appointmentId', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.getAppointment(request, response);
});
router.patch('/v1/appointments/:appointmentId/status', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.updateAppointmentStatus(request, response);
});
router["delete"]('/v1/appointments/:appointmentId', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.deleteAppointment(request, response);
});
router.post('/v1/appointments/:appointmentId/reminder/send', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.sendAppointmentReminder(request, response);
});
module.exports = router;