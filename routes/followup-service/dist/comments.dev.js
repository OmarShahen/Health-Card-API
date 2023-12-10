"use strict";

var router = require('express').Router();

var commentsController = require('../../controllers/followup-service/comments');

var authorization = require('../../middlewares/verify-permission');

var _require = require('../../middlewares/verify-routes-params'),
    verifyCommentId = _require.verifyCommentId,
    verifyClinicId = _require.verifyClinicId,
    verifyUserId = _require.verifyUserId;

router.get('/v1/comments', authorization.allPermission, function (request, response) {
  return commentsController.getComments(request, response);
});
router.get('/v1/comments/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return commentsController.getCommentsByClinicId(request, response);
});
router.get('/v1/comments/owners/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return commentsController.getCommentsByOwnerId(request, response);
});
router.post('/v1/comments', authorization.allPermission, function (request, response) {
  return commentsController.addComment(request, response);
});
router.put('/v1/comments/:commentId', authorization.allPermission, verifyCommentId, function (request, response) {
  return commentsController.updateComment(request, response);
});
router["delete"]('/v1/comments/:commentId', authorization.allPermission, verifyCommentId, function (request, response) {
  return commentsController.deleteComment(request, response);
});
module.exports = router;