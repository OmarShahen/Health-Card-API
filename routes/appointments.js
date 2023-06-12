const router = require('express').Router()
const appointmentsController = require('../controllers/appointments')
const { verifyUserId, verifyAppointmentId, verifyClinicId } = require('../middlewares/verify-routes-params')

router.post('/v1/appointments', (request, response) => appointmentsController.addAppointment(request, response))

router.get('/v1/appointments/doctors/:userId', verifyUserId, (request, response) => appointmentsController.getAppointmentsByDoctorId(request, response))

router.get('/v1/appointments/clinics/:clinicId', verifyClinicId, (request, response) => appointmentsController.getAppointmentsByClinicId(request, response))

router.patch('/v1/appointments/:appointmentId/status', verifyAppointmentId, (request, response) => appointmentsController.updateAppointmentStatus(request, response))

router.delete(
    '/v1/appointments/:appointmentId', 
    verifyAppointmentId, 
    (request, response)=> appointmentsController.deleteAppointment(request, response)
)

module.exports = router