const router = require('express').Router()
const reviewsController = require('../controllers/reviews')
const { verifyReviewId , verifyUserId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/reviews',
    authorization.allPermission,
    (request, response) => reviewsController.getReviews(request, response)
)

router.get(
    '/v1/reviews/stats',
    authorization.allPermission,
    (request, response) => reviewsController.getReviewsStats(request, response)
)

router.get(
    '/v1/reviews/experts/:userId/stats',
    verifyUserId,
    (request, response) => reviewsController.getExpertReviewsStats(request, response)
)

router.get(
    '/v1/reviews/experts/:userId',
    verifyUserId,
    (request, response) => reviewsController.getReviewsByExpertId(request, response)
)

router.post(
    '/v1/reviews',
    authorization.allPermission,
    (request, response) => reviewsController.addReview(request, response)
)

router.delete(
    '/v1/reviews/:reviewId',
    authorization.allPermission,
    verifyReviewId,
    (request, response) => reviewsController.deleteReview(request, response)
)


module.exports = router