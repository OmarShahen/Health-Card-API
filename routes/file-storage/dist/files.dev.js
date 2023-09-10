"use strict";

var router = require('express').Router();

var filesController = require('../../controllers/file-storage/files');

var _require = require('../../middlewares/verify-routes-params'),
    verifyFileId = _require.verifyFileId,
    verifyPatientId = _require.verifyPatientId,
    verifyClinicId = _require.verifyClinicId,
    verifyFolderId = _require.verifyFolderId,
    verifyUserId = _require.verifyUserId;

var _require2 = require('../../middlewares/verify-clinic-mode'),
    verifyClinicFiles = _require2.verifyClinicFiles;

var authorization = require('../../middlewares/verify-permission');

router.get('/v1/files', authorization.allPermission, function (request, response) {
  return filesController.getFiles(request, response);
});
router.post('/v1/files', authorization.allPermission, verifyClinicFiles, function (request, response) {
  return filesController.addFile(request, response);
});
router.get('/v1/files/patients/:patientId', authorization.allPermission, verifyPatientId, function (request, response) {
  return filesController.getFilesByPatientId(request, response);
});
router.get('/v1/files/creators/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return filesController.getFilesByCreatorId(request, response);
});
router.get('/v1/files/clinics/:clinicId/patients/:patientId', authorization.allPermission, verifyClinicId, verifyPatientId, function (request, response) {
  return filesController.getFilesByPatientIdAndClinicId(request, response);
});
router.get('/v1/files/folders/:folderId', authorization.allPermission, verifyFolderId, function (request, response) {
  return filesController.getFilesByFolderId(request, response);
});
router.get('/v1/files/:fileId', authorization.allPermission, verifyFileId, function (request, response) {
  return filesController.getFileById(request, response);
});
router.patch('/v1/files/:fileId/name', authorization.allPermission, verifyFileId, function (request, response) {
  return filesController.updateFileName(request, response);
});
router.patch('/v1/files/:fileId/pin', authorization.allPermission, verifyFileId, function (request, response) {
  return filesController.updateFilePinStatus(request, response);
});
router["delete"]('/v1/files/:fileId', authorization.allPermission, verifyFileId, function (request, response) {
  return filesController.deleteFile(request, response);
});
module.exports = router;