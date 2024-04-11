const router = require('express').Router()
const viewsController = require('../controllers/views')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/views',
    authorization.allPermission,
    (request, response) => viewsController.getViews(request, response)
)

router.post(
    '/v1/views',
    (request, response) => viewsController.addView(request, response)
)

module.exports = router