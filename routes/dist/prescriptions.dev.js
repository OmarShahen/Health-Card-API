"use strict";

var router = require('express').Router();

var prescriptionsController = require('../controllers/prescriptions');

var _require = require('../middlewares/verify-routes-params'),
    verifyDoctorId = _require.verifyDoctorId,
    verifyPrescriptionId = _require.verifyPrescriptionId,
    verifyCardUUID = _require.verifyCardUUID,
    verifyPatientId = _require.verifyPatientId,
    verifyClinicId = _require.verifyClinicId;

var _require2 = require('../middlewares/verify-clinic-mode'),
    verifyClinicPrescriptions = _require2.verifyClinicPrescriptions;

var authorization = require('../middlewares/verify-permission');

var actionAccess = require('../middlewares/verify-action-access');

router.post('/v1/prescriptions', authorization.allPermission, verifyClinicPrescriptions, function (request, response) {
  return prescriptionsController.addPrescription(request, response);
});
router.get('/v1/prescriptions/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return prescriptionsController.getClinicPrescriptions(request, response);
});
router.get('/v1/prescriptions/doctors/:doctorId', authorization.allPermission, verifyDoctorId, function (request, response) {
  return prescriptionsController.getDoctorPrescriptions(request, response);
});
router.get('/v1/prescriptions/patients/:patientId', authorization.allPermission, verifyPatientId, function (request, response) {
  return prescriptionsController.getPatientPrescriptions(request, response);
});
router.get('/v1/prescriptions/:prescriptionId/patients/:patientId', verifyPrescriptionId, verifyPatientId, function (request, response) {
  return prescriptionsController.getPatientPrescription(request, response);
});
router.get('/v1/prescriptions/clinics/:clinicId/patients/:patientId', authorization.allPermission, verifyClinicId, verifyPatientId, function (request, response) {
  return prescriptionsController.getClinicPatientPrescriptions(request, response);
});
router.get('/v1/prescriptions/:prescriptionId', authorization.allPermission, verifyPrescriptionId, function (request, response) {
  return prescriptionsController.getPrescription(request, response);
});
router.patch('/v1/prescriptions/:prescriptionId/rate', authorization.allPermission, verifyPrescriptionId, function (request, response) {
  return prescriptionsController.ratePrescription(request, response);
});
/*router.get(
    '/v1/prescriptions/patients/cards/:cardUUID/last',
    authorization.allPermission, 
    verifyCardUUID, 
    (request, response) => prescriptionsController.getPatientLastPrescriptionByCardUUID(request, response)
)*/

router["delete"]('/v1/prescriptions/:prescriptionId', authorization.allPermission, verifyPrescriptionId, actionAccess.verifyDoctorActionAccess, function (request, response) {
  return prescriptionsController.deletePrescription(request, response);
});
router.get('/v1/prescriptions/patients/:patientId/drugs', authorization.allPermission, verifyPatientId, function (request, response) {
  return prescriptionsController.getPatientDrugs(request, response);
});
router.get('/v1/prescriptions/clinics/:clinicId/patients/:patientId/drugs', authorization.allPermission, verifyClinicId, verifyPatientId, function (request, response) {
  return prescriptionsController.getClinicPatientDrugs(request, response);
});
router.put('/v1/prescriptions/:prescriptionId', authorization.allPermission, verifyPrescriptionId, actionAccess.verifyDoctorActionAccess, function (request, response) {
  return prescriptionsController.updatePrescription(request, response);
});
router.post('/v1/prescriptions/:prescriptionId/send/whatsapp', authorization.allPermission, verifyPrescriptionId, function (request, response) {
  return prescriptionsController.sendPrescriptionThroughWhatsapp(request, response);
});
router.get('/v1/prescriptions/followup-service/clinics-subscriptions/active', authorization.allPermission, function (request, response) {
  return prescriptionsController.getFollowupRegisteredClinicsPrescriptions(request, response);
});
router.patch('/v1/prescriptions/:prescriptionId/survey', authorization.allPermission, verifyPrescriptionId, function (request, response) {
  return prescriptionsController.updatePrescriptionSurvey(request, response);
});
module.exports = router;