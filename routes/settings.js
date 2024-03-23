const router = require('express').Router()
const settingsController = require('../controllers/settings')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/settings',
    authorization.allPermission,
    (request, response) => settingsController.getSettings(request, response)
)

router.get(
    '/v1/settings/users/seekers',
    (request, response) => settingsController.getSeekerSettings(request, response)
)

router.put(
    '/v1/settings',
    authorization.allPermission,
    (request, response) => settingsController.updateSettings(request, response)
)


module.exports = router