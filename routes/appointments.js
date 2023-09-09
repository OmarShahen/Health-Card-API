const router = require('express').Router()
const appointmentsController = require('../controllers/appointments')
const { verifyUserId, verifyAppointmentId, verifyClinicId, verifyPatientId } = require('../middlewares/verify-routes-params')
const { verifyClinicAppointments } = require('../middlewares/verify-clinic-mode')
const authorization = require('../middlewares/verify-permission')

router.post(
    '/v1/appointments',
    authorization.allPermission,
    verifyClinicAppointments,
    (request, response) => appointmentsController.addAppointment(request, response)
)

router.get(
    '/v1/appointments/doctors/:userId',
    authorization.allPermission,
    verifyUserId, 
    (request, response) => appointmentsController.getAppointmentsByDoctorId(request, response)
)

router.get(
    '/v1/appointments/clinics/:clinicId',
    authorization.allPermission,
    verifyClinicId, 
    (request, response) => appointmentsController.getAppointmentsByClinicId(request, response)
)

router.get(
    '/v1/appointments/patients/:patientId',
    authorization.allPermission,
    verifyPatientId, 
    (request, response) => appointmentsController.getAppointmentsByPatientId(request, response)
)

router.get(
    '/v1/appointments/clinics/:clinicId/patients/:patientId',
    authorization.allPermission,
    verifyClinicId,
    verifyPatientId, 
    (request, response) => appointmentsController.getClinicAppointmentsByPatientId(request, response)
)

router.get(
    '/v1/appointments/clinics/:clinicId/status/:status',
    authorization.allPermission,
    verifyClinicId,
    (request, response) => appointmentsController.getAppointmentsByClinicIdAndStatus(request, response)
)

router.get(
    '/v1/appointments/doctors/:userId/status/:status',
    authorization.allPermission,
    verifyUserId,
    (request, response) => appointmentsController.getAppointmentsByDoctorIdAndStatus(request, response)
)

router.patch(
    '/v1/appointments/:appointmentId/status', 
    authorization.allPermission,
    verifyAppointmentId, 
    (request, response) => appointmentsController.updateAppointmentStatus(request, response)
)

router.delete(
    '/v1/appointments/:appointmentId',
    authorization.allPermission,
    verifyAppointmentId, 
    (request, response)=> appointmentsController.deleteAppointment(request, response)
)

module.exports = router