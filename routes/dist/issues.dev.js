"use strict";

var router = require('express').Router();

var issuesController = require('../controllers/issues');

var _require = require('../middlewares/verify-routes-params'),
    verifyIssueId = _require.verifyIssueId,
    verifySpecialityId = _require.verifySpecialityId;

var authorization = require('../middlewares/verify-permission');

router.post('/v1/issues', authorization.allPermission, function (request, response) {
  return issuesController.addIssue(request, response);
});
router.get('/v1/issues', function (request, response) {
  return issuesController.getIssues(request, response);
});
router.get('/v1/issues/specialities/:specialityId', authorization.allPermission, verifySpecialityId, function (request, response) {
  return issuesController.getIssuesBySpecialityId(request, response);
});
router.put('/v1/issues/:issueId', authorization.allPermission, verifyIssueId, function (request, response) {
  return issuesController.updateIssue(request, response);
});
router["delete"]('/v1/issues/:issueId', authorization.allPermission, verifyIssueId, function (request, response) {
  return issuesController.deleteIssue(request, response);
});
module.exports = router;