const router = require('express').Router()
const customersController = require('../controllers/customers')
const { verifyCustomerId, verifyUserId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')

router.get(
    '/v1/customers',
    authorization.allPermission,
    (request, response) => customersController.getCustomers(request, response)
)

router.get(
    '/v1/customers/experts/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => customersController.getCustomersByExpertId(request, response)
)

router.get(
    '/v1/customers/experts/:userId/seekers/search',
    authorization.allPermission,
    verifyUserId,
    (request, response) => customersController.searchCustomersByExpertIdAndSeekerName(request, response)
)

router.post(
    '/v1/customers',
    authorization.allPermission,
    (request, response) => customersController.addCustomer(request, response)
)

router.delete(
    '/v1/customers/:customerId',
    authorization.allPermission,
    verifyCustomerId,
    (request, response) => customersController.deleteCustomer(request, response)
)

module.exports = router