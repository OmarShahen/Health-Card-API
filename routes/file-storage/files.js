const router = require('express').Router()
const filesController = require('../../controllers/file-storage/files')
const { verifyFileId, verifyPatientId, verifyClinicId, verifyFolderId, verifyUserId } = require('../../middlewares/verify-routes-params')
const { verifyClinicFiles } = require('../../middlewares/verify-clinic-mode')
const authorization = require('../../middlewares/verify-permission')

router.get(
    '/v1/files',
    authorization.allPermission,
    (request, response) => filesController.getFiles(request, response)
)

router.post(
    '/v1/files',
    authorization.allPermission,
    verifyClinicFiles,
    (request, response) => filesController.addFile(request, response)
)

router.get(
    '/v1/files/patients/:patientId',
    authorization.allPermission,
    verifyPatientId,
    (request, response) => filesController.getFilesByPatientId(request, response)
)

router.get(
    '/v1/files/creators/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => filesController.getFilesByCreatorId(request, response)
)

router.get(
    '/v1/files/clinics/:clinicId/patients/:patientId',
    authorization.allPermission,
    verifyClinicId,
    verifyPatientId,
    (request, response) => filesController.getFilesByPatientIdAndClinicId(request, response)
)

router.get(
    '/v1/files/folders/:folderId',
    authorization.allPermission,
    verifyFolderId,
    (request, response) => filesController.getFilesByFolderId(request, response)
)

router.get(
    '/v1/files/:fileId',
    authorization.allPermission,
    verifyFileId,
    (request, response) => filesController.getFileById(request, response)
)

router.patch(
    '/v1/files/:fileId/name',
    authorization.allPermission,
    verifyFileId,
    (request, response) => filesController.updateFileName(request, response)
)

router.patch(
    '/v1/files/:fileId/pin',
    authorization.allPermission,
    verifyFileId,
    (request, response) => filesController.updateFilePinStatus(request, response)
)

router.delete(
    '/v1/files/:fileId',
    authorization.allPermission,
    verifyFileId,
    (request, response) => filesController.deleteFile(request, response)
)


module.exports = router