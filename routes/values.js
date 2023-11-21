const router = require('express').Router()
const valuesController = require('../controllers/values')
const authorization = require('../middlewares/verify-permission')
const { verifyValueId } = require('../middlewares/verify-routes-params')


router.get(
    '/v1/values', 
    authorization.allPermission,
    (request, response) => valuesController.getValues(request, response)
)

router.post(
    '/v1/values',
    authorization.allPermission,
    (request, response) => valuesController.addValue(request, response)
)

router.delete(
    '/v1/values/:valueId',
    authorization.allPermission,
    verifyValueId,
    (request, response) => valuesController.deleteValue(request, response)
)

router.patch(
    '/v1/values/:valueId/value',
    authorization.allPermission,
    verifyValueId,
    (request, response) => valuesController.updateValueValue(request, response)
)

module.exports = router