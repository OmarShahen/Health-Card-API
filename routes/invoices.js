const router = require('express').Router()
const invoicesController = require('../controllers/invoices')
const { verifyInvoiceId, verifyClinicId, verifyPatientId, verifyUserId } = require('../middlewares/verify-routes-params')
const { verifyClinicInvoices } = require('../middlewares/verify-clinic-mode')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/invoices', 
    authorization.allPermission,
    (request, response) => invoicesController.getInvoices(request, response)
)

router.get(
    '/v1/invoices/:invoiceId', 
    authorization.allPermission,
    verifyInvoiceId, 
    (request, response) => invoicesController.getInvoice(request, response)
)

router.get(
    '/v1/invoices/clinics/:clinicId', 
    authorization.allPermission,
    verifyClinicId, 
    (request, response) => invoicesController.getInvoicesByClinicId(request, response)
)

router.get(
    '/v1/invoices/patients/:patientId', 
    authorization.allPermission,
    verifyPatientId, 
    (request, response) => invoicesController.getInvoicesByPatientId(request, response)
)

router.get(
    '/v1/invoices/owners/:userId', 
    authorization.allPermission,
    verifyUserId, 
    (request, response) => invoicesController.getInvoicesByOwnerId(request, response)
)

router.post(
    '/v1/invoices',
    authorization.allPermission,
    verifyClinicInvoices,
    (request, response) => invoicesController.addInvoice(request, response)
)

router.post(
    '/v1/invoices/:invoiceId/checkout', 
    authorization.allPermission,
    verifyInvoiceId,
    (request, response) => invoicesController.addInvoiceCheckout(request, response)
)

router.put(
    '/v1/invoices/:invoiceId',
    authorization.allPermission,
    verifyInvoiceId,
    (request, response) => invoicesController.updateInvoice(request, response)
)

router.patch(
    '/v1/invoices/:invoiceId/status',
    authorization.allPermission,
    verifyInvoiceId,
    (request, response) => invoicesController.updateInvoiceStatus(request, response)
)

router.patch(
    '/v1/invoices/:invoiceId/paid',
    authorization.allPermission,
    verifyInvoiceId,
    (request, response) => invoicesController.updateInvoicePaid(request, response)
)

router.delete(
    '/v1/invoices/:invoiceId',
    authorization.allPermission,
    verifyInvoiceId,
    (request, response) => invoicesController.deleteInvoice(request, response)
)

module.exports = router