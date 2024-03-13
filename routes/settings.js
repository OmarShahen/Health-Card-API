const router = require('express').Router()
const settingsController = require('../controllers/settings')
const { verifySpecialityId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/settings',
    (request, response) => settingsController.getSettings(request, response)
)


module.exports = router