const router = require('express').Router()
const staffsController = require('../controllers/staffs')
const { verifyClinicId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/staffs/clinics/:clinicId',
    authorization.allPermission,
    verifyClinicId, 
    (request, response) => staffsController.getClinicStaffs(request, response)
)

module.exports = router