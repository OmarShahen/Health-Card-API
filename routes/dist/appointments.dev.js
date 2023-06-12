"use strict";

var router = require('express').Router();

var appointmentsController = require('../controllers/appointments');

var _require = require('../middlewares/verify-routes-params'),
    verifyUserId = _require.verifyUserId,
    verifyAppointmentId = _require.verifyAppointmentId,
    verifyClinicId = _require.verifyClinicId;

router.post('/v1/appointments', function (request, response) {
  return appointmentsController.addAppointment(request, response);
});
router.get('/v1/appointments/doctors/:userId', verifyUserId, function (request, response) {
  return appointmentsController.getAppointmentsByDoctorId(request, response);
});
router.get('/v1/appointments/clinics/:clinicId', verifyClinicId, function (request, response) {
  return appointmentsController.getAppointmentsByClinicId(request, response);
});
router.patch('/v1/appointments/:appointmentId/status', verifyAppointmentId, function (request, response) {
  return appointmentsController.updateAppointmentStatus(request, response);
});
router["delete"]('/v1/appointments/:appointmentId', verifyAppointmentId, function (request, response) {
  return appointmentsController.deleteAppointment(request, response);
});
module.exports = router;