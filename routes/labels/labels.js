const router = require('express').Router()
const labelsController = require('../../controllers/labels/labels')
const authorization = require('../../middlewares/verify-permission')
const { verifyLabelId } = require('../../middlewares/verify-routes-params')

router.get(
    '/v1/labels', 
    authorization.allPermission,
    (request, response) => labelsController.getLabels(request, response)
)

router.post(
    '/v1/labels', 
    authorization.allPermission,
    (request, response) => labelsController.addLabel(request, response)
)

router.put(
    '/v1/labels/:labelId', 
    authorization.allPermission,
    verifyLabelId,
    (request, response) => labelsController.updateLabel(request, response)
)

router.delete(
    '/v1/labels/:labelId', 
    authorization.allPermission,
    verifyLabelId,
    (request, response) => labelsController.deleteLabel(request, response)
)


module.exports = router