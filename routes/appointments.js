const router = require('express').Router()
const appointmentsController = require('../controllers/appointments')
const { verifyUserId, verifyAppointmentId, verifyClinicId } = require('../middlewares/verify-routes-params')
const { verifyClinicAppointments } = require('../middlewares/verify-clinic-mode')
const authorization = require('../middlewares/verify-permission')

router.post(
    '/v1/appointments',
    authorization.staffPermission,
    verifyClinicAppointments,
    (request, response) => appointmentsController.addAppointment(request, response)
)

router.get(
    '/v1/appointments/doctors/:userId',
    authorization.doctorPermission,
    verifyUserId, 
    (request, response) => appointmentsController.getAppointmentsByDoctorId(request, response)
)

router.get(
    '/v1/appointments/clinics/:clinicId',
    authorization.allPermission,
    verifyClinicId, 
    (request, response) => appointmentsController.getAppointmentsByClinicId(request, response)
)

router.patch(
    '/v1/appointments/:appointmentId/status', 
    authorization.staffPermission,
    verifyAppointmentId, 
    (request, response) => appointmentsController.updateAppointmentStatus(request, response)
)

router.delete(
    '/v1/appointments/:appointmentId',
    authorization.staffPermission,
    verifyAppointmentId, 
    (request, response)=> appointmentsController.deleteAppointment(request, response)
)

module.exports = router