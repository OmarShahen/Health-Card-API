const router = require('express').Router()
const openingTimesController = require('../controllers/opening-times')
const { verifyOpeningTimeId, verifyLeadId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/opening-times', 
    authorization.allPermission,
    (request, response) => openingTimesController.getOpeningTimes(request, response)
)

router.get(
    '/v1/opening-times/leads/:leadId', 
    authorization.allPermission,
    verifyLeadId,
    (request, response) => openingTimesController.getOpeningTimesByLeadId(request, response)
)

router.get(
    '/v1/opening-times/search', 
    authorization.allPermission,
    (request, response) => openingTimesController.searchOpeningTimes(request, response)
)

router.post(
    '/v1/opening-times', 
    authorization.allPermission,
    (request, response) => openingTimesController.addOpeningTime(request, response)
)

router.put(
    '/v1/opening-times/:openingTimeId',
    authorization.allPermission,
    verifyOpeningTimeId,
    (request, response) => openingTimesController.updateOpeningTime(request, response)
)

router.delete(
    '/v1/opening-times/:openingTimeId',
    authorization.allPermission,
    verifyOpeningTimeId,
    (request, response) => openingTimesController.deleteOpeningTime(request, response)
)


module.exports = router