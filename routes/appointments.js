const router = require('express').Router()
const appointmentsController = require('../controllers/appointments')
const { verifyUserId, verifyAppointmentId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')

router.post(
    '/v1/appointments',
    authorization.allPermission,
    (request, response) => appointmentsController.addAppointment(request, response)
)

router.get(
    '/v1/appointments',
    authorization.allPermission,
    (request, response) => appointmentsController.getAppointments(request, response)
)

router.get(
    '/v1/stats/appointments',
    authorization.allPermission,
    (request, response) => appointmentsController.getAppointmentsStats(request, response)
)

router.get(
    '/v1/stats/appointments/growth',
    authorization.allPermission,
    (request, response) => appointmentsController.getAppointmentsGrowthStats(request, response)
)

router.get(
    '/v1/appointments/experts/:userId/status/:status/payments/paid',
    authorization.allPermission,
    verifyUserId,
    (request, response) => appointmentsController.getPaidAppointmentsByExpertIdAndStatus(request, response)
)

router.get(
    '/v1/appointments/seekers/:userId/status/:status/payments/paid',
    authorization.allPermission,
    verifyUserId,
    (request, response) => appointmentsController.getAppointmentsBySeekerIdAndStatus(request, response)
)

router.get(
    '/v1/appointments/:appointmentId',
    authorization.allPermission,
    verifyAppointmentId,
    (request, response) => appointmentsController.getAppointment(request, response)
)

router.get(
    '/v1/appointments/search/name',
    authorization.allPermission,
    (request, response) => appointmentsController.searchAppointmentsByExpertAndSeekerName(request, response)
)

router.patch(
    '/v1/appointments/:appointmentId/status', 
    authorization.allPermission,
    verifyAppointmentId, 
    (request, response) => appointmentsController.updateAppointmentStatus(request, response)
)

router.patch(
    '/v1/appointments/:appointmentId/meeting-link', 
    authorization.allPermission,
    verifyAppointmentId, 
    (request, response) => appointmentsController.updateAppointmentMeetingLink(request, response)
)

router.patch(
    '/v1/appointments/:appointmentId/payment-verification', 
    authorization.allPermission,
    verifyAppointmentId, 
    (request, response) => appointmentsController.updateAppointmentPaymentVerification(request, response)
)

router.patch(
    '/v1/appointments/:appointmentId/verification', 
    authorization.allPermission,
    verifyAppointmentId, 
    (request, response) => appointmentsController.updateAppointmentVerificationStatus(request, response)
)

router.delete(
    '/v1/appointments/:appointmentId',
    authorization.allPermission,
    verifyAppointmentId, 
    (request, response)=> appointmentsController.deleteAppointment(request, response)
)

router.post(
    '/v1/appointments/:appointmentId/reminder/send',
    authorization.allPermission,
    verifyAppointmentId,
    (request, response)=> appointmentsController.sendAppointmentReminder(request, response)
)


module.exports = router