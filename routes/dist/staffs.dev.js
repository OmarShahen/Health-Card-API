"use strict";

var router = require('express').Router();

var staffsController = require('../controllers/staffs');

var _require = require('../middlewares/verify-routes-params'),
    verifyClinicId = _require.verifyClinicId;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/staffs/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return staffsController.getClinicStaffs(request, response);
});
module.exports = router;