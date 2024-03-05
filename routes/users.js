const router = require('express').Router()
const usersController = require('../controllers/users')
const { verifyUserId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/users/:userId',
    authorization.allPermission, 
    verifyUserId, 
    (request, response) => usersController.getUser(request, response)
)

router.get(
    '/v1/users/:userId/types/patients',
    authorization.allPermission, 
    verifyUserId,
    (request, response) => usersController.getPatient(request, response)
)


router.get(
    '/v1/users/:userId/experts',
    verifyUserId, 
    (request, response) => usersController.getExpertUser(request, response)
)

router.get(
    '/v1/users/roles/app',
    authorization.allPermission, 
    (request, response) => usersController.getAppUsers(request, response)
)

router.get(
    '/v1/users/:userId/speciality',
    authorization.allPermission,
    verifyUserId, 
    (request, response) => usersController.getUserSpeciality(request, response)
)

router.put(
    '/v1/users/:userId',
    authorization.allPermission,
    verifyUserId, 
    (request, response) => usersController.updateUserMainData(request, response)
)

router.patch(
    '/v1/users/:userId/profile-image',
    authorization.allPermission,
    verifyUserId, 
    (request, response) => usersController.updateUserProfileImage(request, response)
)

router.put(
    '/v1/users/:userId/speciality',
    authorization.allPermission, 
    verifyUserId, 
    (request, response) => usersController.updateUserSpeciality(request, response)
)

router.patch(
    '/v1/users/:userId/email',
    authorization.allPermission,
    verifyUserId, 
    (request, response) => usersController.updateUserEmail(request, response)
)

router.patch(
    '/v1/users/:userId/language',
    authorization.allPermission,
    verifyUserId,
    (request, response) => usersController.updateUserLanguage(request, response)
)

router.patch(
    '/v1/users/:userId/password',
    authorization.allPermission,
    verifyUserId, 
    (request, response) => usersController.updateUserPassword(request, response)
)

router.patch(
    '/v1/users/:userId/password/verify',
    authorization.allPermission,
    verifyUserId, 
    (request, response) => usersController.verifyAndUpdateUserPassword(request, response)
)

router.delete(
    '/v1/users/:userId',
    authorization.allPermission,
    verifyUserId, 
    (request, response) => usersController.deleteUser(request, response)
)

router.post(
    '/v1/users/employee',
    authorization.allPermission,
    (request, response) => usersController.addEmployeeUser(request, response)
)

router.patch(
    '/v1/users/:userId/visibility',
    authorization.allPermission,
    verifyUserId, 
    (request, response) => usersController.updateUserVisibility(request, response)
)

router.patch(
    '/v1/users/:userId/blocked',
    authorization.allPermission,
    verifyUserId, 
    (request, response) => usersController.updateUserBlocked(request, response)
)

router.patch(
    '/v1/users/:userId/activation',
    authorization.allPermission,
    verifyUserId, 
    (request, response) => usersController.updateUserActivation(request, response)
)


module.exports = router