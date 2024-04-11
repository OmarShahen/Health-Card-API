"use strict";

var router = require('express').Router();

var customersController = require('../controllers/customers');

var _require = require('../middlewares/verify-routes-params'),
    verifyCustomerId = _require.verifyCustomerId,
    verifyUserId = _require.verifyUserId;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/customers', authorization.allPermission, function (request, response) {
  return customersController.getCustomers(request, response);
});
router.get('/v1/customers/experts/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return customersController.getCustomersByExpertId(request, response);
});
router.get('/v1/customers/experts/:userId/seekers/search', authorization.allPermission, verifyUserId, function (request, response) {
  return customersController.searchCustomersByExpertIdAndSeekerName(request, response);
});
router.post('/v1/customers', authorization.allPermission, function (request, response) {
  return customersController.addCustomer(request, response);
});
router["delete"]('/v1/customers/:customerId', authorization.allPermission, verifyCustomerId, function (request, response) {
  return customersController.deleteCustomer(request, response);
});
module.exports = router;