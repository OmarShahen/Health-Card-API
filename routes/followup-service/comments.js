const router = require('express').Router()
const commentsController = require('../../controllers/followup-service/comments')
const authorization = require('../../middlewares/verify-permission')
const { verifyCommentId } = require('../../middlewares/verify-routes-params')

router.get(
    '/v1/comments', 
    authorization.allPermission,
    (request, response) => commentsController.getComments(request, response)
)

router.post(
    '/v1/comments', 
    authorization.allPermission,
    (request, response) => commentsController.addComment(request, response)
)

router.put(
    '/v1/comments/:commentId', 
    authorization.allPermission,
    verifyCommentId,
    (request, response) => commentsController.updateComment(request, response)
)

router.delete(
    '/v1/comments/:commentId', 
    authorization.allPermission,
    verifyCommentId,
    (request, response) => commentsController.deleteComment(request, response)
)


module.exports = router