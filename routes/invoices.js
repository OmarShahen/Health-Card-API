const router = require('express').Router()
const invoicesController = require('../controllers/invoices')
const tokenMiddleware = require('../middlewares/verify-permission')
const { verifyInvoiceId, verifyClinicId, verifyPatientId } = require('../middlewares/verify-routes-params')

router.get('/v1/invoices', (request, response) => invoicesController.getInvoices(request, response))

router.get('/v1/invoices/:invoiceId', verifyInvoiceId, (request, response) => invoicesController.getInvoice(request, response))

router.get(
    '/v1/invoices/clinics/:clinicId', 
    verifyClinicId, 
    (request, response) => invoicesController.getInvoicesByClinicId(request, response)
)

router.get(
    '/v1/invoices/patients/:patientId', 
    verifyPatientId, 
    (request, response) => invoicesController.getInvoicesByPatientId(request, response)
)


router.post('/v1/invoices', (request, response) => invoicesController.addInvoice(request, response))

router.patch(
    '/v1/invoices/:invoiceId/status',
    verifyInvoiceId,
    (request, response) => invoicesController.updateInvoiceStatus(request, response)
)

router.delete(
    '/v1/invoices/:invoiceId',
    verifyInvoiceId,
    (request, response) => invoicesController.deleteInvoice(request, response)
)

module.exports = router