"use strict";

var router = require('express').Router();

var settingsController = require('../controllers/settings');

var authorization = require('../middlewares/verify-permission');

router.get('/v1/settings', authorization.allPermission, function (request, response) {
  return settingsController.getSettings(request, response);
});
router.get('/v1/settings/users/seekers', function (request, response) {
  return settingsController.getSeekerSettings(request, response);
});
router.put('/v1/settings', authorization.allPermission, function (request, response) {
  return settingsController.updateSettings(request, response);
});
module.exports = router;