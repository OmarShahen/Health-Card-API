"use strict";

var router = require('express').Router();

var reviewsController = require('../controllers/reviews');

var _require = require('../middlewares/verify-routes-params'),
    verifyReviewId = _require.verifyReviewId,
    verifyUserId = _require.verifyUserId;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/reviews', authorization.allPermission, function (request, response) {
  return reviewsController.getReviews(request, response);
});
router.get('/v1/reviews/stats', authorization.allPermission, function (request, response) {
  return reviewsController.getReviewsStats(request, response);
});
router.get('/v1/reviews/experts/:userId/stats', verifyUserId, function (request, response) {
  return reviewsController.getExpertReviewsStats(request, response);
});
router.get('/v1/reviews/experts/:userId', verifyUserId, function (request, response) {
  return reviewsController.getReviewsByExpertId(request, response);
});
router.post('/v1/reviews', authorization.allPermission, function (request, response) {
  return reviewsController.addReview(request, response);
});
router["delete"]('/v1/reviews/:reviewId', authorization.allPermission, verifyReviewId, function (request, response) {
  return reviewsController.deleteReview(request, response);
});
module.exports = router;