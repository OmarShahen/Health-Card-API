"use strict";

var router = require('express').Router();

var subscriptionsController = require('../controllers/subscriptions');

var authorization = require('../middlewares/verify-permission');

router.get('/v1/subscriptions', authorization.allPermission, function (request, response) {
  return subscriptionsController.getSubscriptions(request, response);
});
module.exports = router;