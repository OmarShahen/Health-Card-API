"use strict";

var router = require('express').Router();

var expertsController = require('../controllers/experts');

var _require = require('../middlewares/verify-routes-params'),
    verifySpecialityId = _require.verifySpecialityId;

router.get('/v1/experts/specialities/:specialityId', verifySpecialityId, function (request, response) {
  return expertsController.searchExperts(request, response);
});
router.get('/v1/experts/specialities/:specialityId/name/:name', verifySpecialityId, function (request, response) {
  return expertsController.searchExpertsByNameAndSpeciality(request, response);
});
module.exports = router;