"use strict";

var router = require('express').Router();

var commentsController = require('../../controllers/followup-service/comments');

var authorization = require('../../middlewares/verify-permission');

var _require = require('../../middlewares/verify-routes-params'),
    verifyCommentId = _require.verifyCommentId;

router.get('/v1/comments', authorization.allPermission, function (request, response) {
  return commentsController.getComments(request, response);
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