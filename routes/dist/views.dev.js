"use strict";

var router = require('express').Router();

var viewsController = require('../controllers/views');

var authorization = require('../middlewares/verify-permission');

router.get('/v1/views', authorization.allPermission, function (request, response) {
  return viewsController.getViews(request, response);
});
router.post('/v1/views', function (request, response) {
  return viewsController.addView(request, response);
});
module.exports = router;