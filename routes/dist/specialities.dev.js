"use strict";

var router = require('express').Router();

var specialitiesController = require('../controllers/specialities');

var _require = require('../middlewares/verify-routes-params'),
    verifySpecialityId = _require.verifySpecialityId;

router.get('/v1/specialities', function (request, response) {
  return specialitiesController.getSpecialities(request, response);
});
router.post('/v1/specialities', function (request, response) {
  return specialitiesController.addSpeciality(request, response);
});
router.put('/v1/specialities/:specialityId', verifySpecialityId, function (request, response) {
  return specialitiesController.updateSpeciality(request, response);
});
router["delete"]('/v1/specialities/:specialityId', verifySpecialityId, function (request, response) {
  return specialitiesController.deleteSpeciality(request, response);
});
router["delete"]('/v1/specialities', function (request, response) {
  return specialitiesController.deleteSpecialities(request, response);
});
module.exports = router;