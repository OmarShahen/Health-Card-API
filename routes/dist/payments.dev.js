"use strict";

var router = require('express').Router();

var paymentsController = require('../controllers/payments');

router.post('/v1/payments/paymob/process', function (request, response) {
  return paymentsController.processPayment(request, response);
});
module.exports = router;