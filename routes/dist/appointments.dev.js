"use strict";

var router = require('express').Router();

var appointmentsController = require('../controllers/appointments');

var _require = require('../middlewares/verify-routes-params'),
    verifyUserId = _require.verifyUserId,
    verifyAppointmentId = _require.verifyAppointmentId,
    verifyClinicId = _require.verifyClinicId;

var _require2 = require('../middlewares/verify-clinic-mode'),
    verifyClinicAppointments = _require2.verifyClinicAppointments;

var authorization = require('../middlewares/verify-permission');

router.post('/v1/appointments', authorization.staffPermission, verifyClinicAppointments, function (request, response) {
  return appointmentsController.addAppointment(request, response);
});
router.get('/v1/appointments/doctors/:userId', authorization.doctorPermission, verifyUserId, function (request, response) {
  return appointmentsController.getAppointmentsByDoctorId(request, response);
});
router.get('/v1/appointments/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return appointmentsController.getAppointmentsByClinicId(request, response);
});
router.patch('/v1/appointments/:appointmentId/status', authorization.staffPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.updateAppointmentStatus(request, response);
});
router["delete"]('/v1/appointments/:appointmentId', authorization.staffPermission, verifyAppointmentId, function (request, response) {
  return appointmentsController.deleteAppointment(request, response);
});
module.exports = router;