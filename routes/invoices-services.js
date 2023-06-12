const router = require('express').Router()
const invoicesServicesController = require('../controllers/invoices-services')
const tokenMiddleware = require('../middlewares/verify-permission')
const { verifyInvoiceServiceId, verifyInvoiceId } = require('../middlewares/verify-routes-params')

router.get('/v1/invoices-services', (request, response) => invoicesServicesController.getInvoicesServices(request, response))

router.get(
    '/v1/invoices-services/invoices/:invoiceId',
    verifyInvoiceId,
    (request, response) => invoicesServicesController.getInvoiceServices(request, response)
)

router.post('/v1/invoices-services', (request, response) => invoicesServicesController.addInvoiceService(request, response))

router.delete(
    '/v1/invoices-services/:invoiceServiceId',
    verifyInvoiceServiceId,
    (request, response) => invoicesServicesController.deleteInvoiceService(request, response)
)

module.exports = router