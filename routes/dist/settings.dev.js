"use strict";

var router = require('express').Router();

var settingsController = require('../controllers/settings');

var _require = require('../middlewares/verify-routes-params'),
    verifySpecialityId = _require.verifySpecialityId;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/settings', function (request, response) {
  return settingsController.getSettings(request, response);
});
module.exports = router;