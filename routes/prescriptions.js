const router = require('express').Router()
const prescriptionsController = require('../controllers/prescriptions')
const tokenMiddleware = require('../middlewares/verify-permission')
const { verifyDoctorId, verifyPrescriptionId, verifyCardUUID, verifyPatientId } = require('../middlewares/verify-routes-params')

router.post('/v1/prescriptions', (request, response) => prescriptionsController.addPrescription(request, response))

router.post('/v1/prescriptions/cardsId/:cardId', (request, response) => prescriptionsController.addPrescriptionByPatientCardId(request, response))

router.get('/v1/prescriptions/doctors/:doctorId', verifyDoctorId, (request, response) => prescriptionsController.getDoctorPrescriptions(request, response))

router.get('/v1/prescriptions/patients/:patientId', verifyPatientId, (request, response) => prescriptionsController.getPatientPrescriptions(request, response))

router.get('/v1/prescriptions/:prescriptionId', verifyPrescriptionId, (request, response) => prescriptionsController.getPrescription(request, response))

router.patch('/v1/prescriptions/:prescriptionId/rate', verifyPrescriptionId, (request, response) => prescriptionsController.ratePrescription(request, response))

router.get(
    '/v1/prescriptions/patients/cards/:cardUUID/last', 
    verifyCardUUID, 
    (request, response) => prescriptionsController.getPatientLastPrescriptionByCardUUID(request, response)
)

router.delete(
    '/v1/prescriptions/:prescriptionId',
    verifyPrescriptionId,
    (request, response) => prescriptionsController.deletePrescription(request, response)
)

router.get(
    '/v1/prescriptions/patients/:patientId/drugs',
    verifyPatientId,
    (request, response) => prescriptionsController.getPatientDrugs(request, response)
)

module.exports = router