const router = require('express').Router()
const arrivalMethodsController = require('../controllers/arrival-methods')
const authorization = require('../middlewares/verify-permission')
const { verifyArrivalMethodId } = require('../middlewares/verify-routes-params')

router.get(
    '/v1/arrival-methods', 
    authorization.allPermission,
    (request, response) => arrivalMethodsController.getArrivalMethods(request, response)
)

router.post(
    '/v1/arrival-methods', 
    authorization.allPermission,
    (request, response) => arrivalMethodsController.addArrivalMethod(request, response)
)

router.put(
    '/v1/arrival-methods/:arrivalMethodId', 
    authorization.allPermission,
    verifyArrivalMethodId,
    (request, response) => arrivalMethodsController.updateArrivalMethod(request, response)
)

router.delete(
    '/v1/arrival-methods/:arrivalMethodId', 
    authorization.allPermission,
    verifyArrivalMethodId,
    (request, response) => arrivalMethodsController.deleteArrivalMethod(request, response)
)

module.exports = router