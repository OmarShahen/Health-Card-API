const router = require('express').Router()
const invoicesServicesController = require('../controllers/invoices-services')
const { verifyInvoiceServiceId, verifyInvoiceId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/invoices-services', 
    authorization.allPermission,
    (request, response) => invoicesServicesController.getInvoicesServices(request, response)
)

router.get(
    '/v1/invoices-services/invoices/:invoiceId',
    authorization.allPermission,
    verifyInvoiceId,
    (request, response) => invoicesServicesController.getInvoiceServices(request, response)
)

router.post(
    '/v1/invoices-services', 
    authorization.allPermission,
    (request, response) => invoicesServicesController.addInvoiceService(request, response)
)

router.delete(
    '/v1/invoices-services/:invoiceServiceId',
    authorization.allPermission,
    verifyInvoiceServiceId,
    (request, response) => invoicesServicesController.deleteInvoiceService(request, response)
)

module.exports = router