"use strict";

var router = require('express').Router();

var encountersController = require('../controllers/encounters');

var _require = require('../middlewares/verify-routes-params'),
    verifyPatientId = _require.verifyPatientId,
    verifyUserId = _require.verifyUserId,
    verifyEncounterId = _require.verifyEncounterId,
    verifyClinicId = _require.verifyClinicId;

var _require2 = require('../middlewares/verify-clinic-mode'),
    verifyClinicEncounters = _require2.verifyClinicEncounters;

var authorization = require('../middlewares/verify-permission');

var actionAccess = require('../middlewares/verify-action-access');

router.post('/v1/encounters', authorization.allPermission, verifyClinicEncounters, function (request, response) {
  return encountersController.addEncounter(request, response);
});
router.get('/v1/encounters/patients/:patientId', authorization.allPermission, verifyPatientId, function (request, response) {
  return encountersController.getPatientEncounters(request, response);
});
router.get('/v1/encounters/clinics/:clinicId/patients/:patientId', authorization.allPermission, verifyClinicId, verifyPatientId, function (request, response) {
  return encountersController.getClinicPatientEncounters(request, response);
});
router.get('/v1/encounters/doctors/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return encountersController.getDoctorEncounters(request, response);
});
router.get('/v1/encounters/:encounterId', authorization.allPermission, verifyEncounterId, function (request, response) {
  return encountersController.getEncounter(request, response);
});
router["delete"]('/v1/encounters/:encounterId', authorization.allPermission, verifyEncounterId, actionAccess.verifyDoctorActionAccess, function (request, response) {
  return encountersController.deleteEncounter(request, response);
});
router.put('/v1/encounters/:encounterId', authorization.allPermission, verifyEncounterId, actionAccess.verifyDoctorActionAccess, function (request, response) {
  return encountersController.updateEncounter(request, response);
});
module.exports = router;