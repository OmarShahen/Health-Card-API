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
router.patch('/v1/appointments/:appointmentId/promo-codes/apply', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.applyAppointmentPromoCode(request, response);
});
router.patch('/v1/appointments/:appointmentId/promo-codes/remove', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.removeAppointmentPromoCode(request, response);
});
router.get('/v1/appointments', authorization.allPermission, function (request, response) {
  return appointmentsController.getAppointments(request, response);
});
router.get('/v1/appointments/experts/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return appointmentsController.getAppointmentsByExpertId(request, response);
});
router.get('/v1/stats/appointments', authorization.allPermission, function (request, response) {
  return appointmentsController.getAppointmentsStats(request, response);
});
router.get('/v1/stats/appointments/experts/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return appointmentsController.getAppointmentsStatsByExpertId(request, response);
});
router.get('/v1/stats/appointments/growth', authorization.allPermission, function (request, response) {
  return appointmentsController.getAppointmentsGrowthStats(request, response);
});
router.get('/v1/appointments/experts/:userId/status/:status', authorization.allPermission, verifyUserId, function (request, response) {
  return appointmentsController.getAppointmentsByExpertIdAndStatus(request, response);
});
router.get('/v1/appointments/seekers/:userId/status/:status', authorization.allPermission, verifyUserId, function (request, response) {
  return appointmentsController.getAppointmentsBySeekerIdAndStatus(request, response);
});
router.get('/v1/appointments/:appointmentId', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.getAppointment(request, response);
});
router.get('/v1/appointments/search/name', authorization.allPermission, function (request, response) {
  return appointmentsController.searchAppointmentsByExpertAndSeekerName(request, response);
});
router.get('/v1/appointments/experts/:userId/search/name', authorization.allPermission, verifyUserId, function (request, response) {
  return appointmentsController.searchAppointmentsByExpertIdAndSeekerName(request, response);
});
router.patch('/v1/appointments/:appointmentId/status', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.updateAppointmentStatus(request, response);
});
router.patch('/v1/appointments/:appointmentId/meeting-link', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.updateAppointmentMeetingLink(request, response);
});
router.patch('/v1/appointments/:appointmentId/payment-verification', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.updateAppointmentPaymentVerification(request, response);
});
router.patch('/v1/appointments/:appointmentId/verification', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.updateAppointmentVerificationStatus(request, response);
});
router.patch('/v1/appointments/:appointmentId/status/cancellation/free', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.cancelFreeSession(request, response);
});
router.patch('/v1/appointments/:appointmentId/payment', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.updateAppointmentPaymentStatus(request, response);
});
router["delete"]('/v1/appointments/:appointmentId', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.deleteAppointment(request, response);
});
router.post('/v1/appointments/:appointmentId/reminder/send', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.sendAppointmentReminder(request, response);
});
router.post('/v1/appointments/:appointmentId/meeting-link/send', authorization.allPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.sendAppointmentMeetingLink(request, response);
});
router.post('/v1/appointments/reminder/send', authorization.allPermission, function (request, response) {
  return appointmentsController.sendReminderForUpcomingAppointments(request, response);
});
module.exports = router;