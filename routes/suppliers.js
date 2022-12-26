const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const tokenMiddleware = require('../middlewares/verify-permission')
const suppliersControllers = require('../controllers/suppliers')

router.post(
    '/suppliers/clubs/:clubId',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyClubId,
    (request, response) => suppliersControllers.addSupplier(request, response)
)

router.get(
    '/suppliers/clubs/:clubId',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyClubId,
    (request, response) => suppliersControllers.getClubSuppliers(request, response)
)

router.delete(
    '/suppliers/:supplierId',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifySupplierId,
    (request, response) => suppliersControllers.deleteSupplier(request, response)
)

router.put(
    '/suppliers/:supplierId',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifySupplierId,
    (request, response) => suppliersControllers.updateSupplier(request, response)
)


module.exports = router