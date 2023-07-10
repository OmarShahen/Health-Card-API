const router = require('express').Router()
const visitReasonsController = require('../controllers/visit-reasons')
const { verifyVisitReasonId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get('/v1/visit-reasons', (request, response) => visitReasonsController.getVisitReasons(request, response))

router.post('/v1/visit-reasons', (request, response) => visitReasonsController.addVisitReason(request, response))

router.delete('/v1/visit-reasons/:visitReasonId', verifyVisitReasonId, (request, response) => visitReasonsController.deleteVisitReason(request, response))

router.delete('/v1/visit-reasons', (request, response) => visitReasonsController.deleteVisitReasons(request, response))

router.put('/v1/visit-reasons/:visitReasonId', verifyVisitReasonId, (request, response) => visitReasonsController.updateVisitReason(request, response))

module.exports = router