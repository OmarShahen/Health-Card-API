const router = require('express').Router()
const prescriptionsController = require('../controllers/prescriptions')
const { verifyDoctorId, verifyPrescriptionId, verifyCardUUID, verifyPatientId, verifyClinicId } = require('../middlewares/verify-routes-params')
const { verifyClinicPrescriptions } = require('../middlewares/verify-clinic-mode')
const authorization = require('../middlewares/verify-permission')
const actionAccess = require('../middlewares/verify-action-access')


router.post(
    '/v1/prescriptions', 
    authorization.allPermission,
    verifyClinicPrescriptions,
    (request, response) => prescriptionsController.addPrescription(request, response)
)


router.get(
    '/v1/prescriptions/clinics/:clinicId', 
    authorization.allPermission,
    verifyClinicId, 
    (request, response) => prescriptionsController.getClinicPrescriptions(request, response)
)

router.get(
    '/v1/prescriptions/doctors/:doctorId', 
    authorization.allPermission,
    verifyDoctorId, 
    (request, response) => prescriptionsController.getDoctorPrescriptions(request, response)
)

router.get(
    '/v1/prescriptions/patients/:patientId', 
    authorization.allPermission,
    verifyPatientId, 
    (request, response) => prescriptionsController.getPatientPrescriptions(request, response)
)

router.get(
    '/v1/prescriptions/:prescriptionId/patients/:patientId',
    verifyPrescriptionId,
    verifyPatientId,
    (request, response) => prescriptionsController.getPatientPrescription(request, response)
)

router.get(
    '/v1/prescriptions/clinics/:clinicId/patients/:patientId', 
    authorization.allPermission,
    verifyClinicId,
    verifyPatientId, 
    (request, response) => prescriptionsController.getClinicPatientPrescriptions(request, response)
)

router.get(
    '/v1/prescriptions/:prescriptionId', 
    authorization.allPermission,
    verifyPrescriptionId, 
    (request, response) => prescriptionsController.getPrescription(request, response)
)

router.patch(
    '/v1/prescriptions/:prescriptionId/rate', 
    authorization.allPermission,
    verifyPrescriptionId, 
    (request, response) => prescriptionsController.ratePrescription(request, response)
)

/*router.get(
    '/v1/prescriptions/patients/cards/:cardUUID/last',
    authorization.allPermission, 
    verifyCardUUID, 
    (request, response) => prescriptionsController.getPatientLastPrescriptionByCardUUID(request, response)
)*/

router.delete(
    '/v1/prescriptions/:prescriptionId',
    authorization.allPermission,
    verifyPrescriptionId,
    actionAccess.verifyDoctorActionAccess,
    (request, response) => prescriptionsController.deletePrescription(request, response)
)

router.get(
    '/v1/prescriptions/patients/:patientId/drugs',
    authorization.allPermission,
    verifyPatientId,
    (request, response) => prescriptionsController.getPatientDrugs(request, response)
)

router.get(
    '/v1/prescriptions/clinics/:clinicId/patients/:patientId/drugs',
    authorization.allPermission,
    verifyClinicId,
    verifyPatientId,
    (request, response) => prescriptionsController.getClinicPatientDrugs(request, response)
)

router.put(
    '/v1/prescriptions/:prescriptionId',
    authorization.allPermission,
    verifyPrescriptionId,
    actionAccess.verifyDoctorActionAccess,
    (request, response) => prescriptionsController.updatePrescription(request, response) 
)

module.exports = router