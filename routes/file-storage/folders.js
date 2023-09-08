const router = require('express').Router()
const foldersController = require('../../controllers/file-storage/folders')
const { verifyFolderId, verifyPatientId, verifyClinicId, verifyUserId } = require('../../middlewares/verify-routes-params')
const authorization = require('../../middlewares/verify-permission')

router.get(
    '/v1/folders',
    authorization.allPermission,
    (request, response) => foldersController.getFolders(request, response)
)

router.get(
    '/v1/folders/patients/:patientId',
    authorization.allPermission,
    verifyPatientId,
    (request, response) => foldersController.getHomeFoldersByPatientId(request, response)
)

router.get(
    '/v1/folders/clinics/:clinicId',
    authorization.allPermission,
    verifyClinicId,
    (request, response) => foldersController.getFoldersByClinicId(request, response)
)

router.get(
    '/v1/folders/parent-folder/:folderId',
    authorization.allPermission,
    verifyFolderId,
    (request, response) => foldersController.getFoldersByParentFolderId(request, response)
)

router.get(
    '/v1/folders/creators/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => foldersController.getFoldersByCreatorId(request, response)
)

router.get(
    '/v1/folders/clinics/:clinicId/patients/:patientId',
    authorization.allPermission,
    verifyClinicId,
    verifyPatientId,
    (request, response) => foldersController.getFolderByPatientIdAndClinicId(request, response)
)

router.get(
    '/v1/folders/:folderId',
    authorization.allPermission,
    verifyFolderId,
    (request, response) => foldersController.getFolderById(request, response)
)

router.get(
    '/v1/folders/clinics/:clinicId/patients/:patientId/staffs',
    authorization.allPermission,
    verifyClinicId,
    verifyPatientId,
    (request, response) => foldersController.getClinicsStaffsFoldersByClinicId(request, response)
)

router.post(
    '/v1/folders',
    authorization.allPermission,
    (request, response) => foldersController.addFolder(request, response)
)

router.post(
    '/v1/folders/patients',
    authorization.allPermission,
    (request, response) => foldersController.addPatientFolder(request, response)
)

router.patch(
    '/v1/folders/:folderId/name',
    authorization.allPermission,
    verifyFolderId,
    (request, response) => foldersController.updateFolderName(request, response)
)

router.delete(
    '/v1/folders/:folderId',
    authorization.allPermission,
    verifyFolderId,
    (request, response) => foldersController.deleteFolder(request, response)
)

module.exports = router