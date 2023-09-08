"use strict";

var router = require('express').Router();

var foldersController = require('../../controllers/file-storage/folders');

var _require = require('../../middlewares/verify-routes-params'),
    verifyFolderId = _require.verifyFolderId,
    verifyPatientId = _require.verifyPatientId,
    verifyClinicId = _require.verifyClinicId,
    verifyUserId = _require.verifyUserId;

var authorization = require('../../middlewares/verify-permission');

router.get('/v1/folders', authorization.allPermission, function (request, response) {
  return foldersController.getFolders(request, response);
});
router.get('/v1/folders/patients/:patientId', authorization.allPermission, verifyPatientId, function (request, response) {
  return foldersController.getHomeFoldersByPatientId(request, response);
});
router.get('/v1/folders/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return foldersController.getFoldersByClinicId(request, response);
});
router.get('/v1/folders/parent-folder/:folderId', authorization.allPermission, verifyFolderId, function (request, response) {
  return foldersController.getFoldersByParentFolderId(request, response);
});
router.get('/v1/folders/creators/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return foldersController.getFoldersByCreatorId(request, response);
});
router.get('/v1/folders/clinics/:clinicId/patients/:patientId', authorization.allPermission, verifyClinicId, verifyPatientId, function (request, response) {
  return foldersController.getFolderByPatientIdAndClinicId(request, response);
});
router.get('/v1/folders/:folderId', authorization.allPermission, verifyFolderId, function (request, response) {
  return foldersController.getFolderById(request, response);
});
router.get('/v1/folders/clinics/:clinicId/patients/:patientId/staffs', authorization.allPermission, verifyClinicId, verifyPatientId, function (request, response) {
  return foldersController.getClinicsStaffsFoldersByClinicId(request, response);
});
router.post('/v1/folders', authorization.allPermission, function (request, response) {
  return foldersController.addFolder(request, response);
});
router.post('/v1/folders/patients', authorization.allPermission, function (request, response) {
  return foldersController.addPatientFolder(request, response);
});
router.patch('/v1/folders/:folderId/name', authorization.allPermission, verifyFolderId, function (request, response) {
  return foldersController.updateFolderName(request, response);
});
router["delete"]('/v1/folders/:folderId', authorization.allPermission, verifyFolderId, function (request, response) {
  return foldersController.deleteFolder(request, response);
});
module.exports = router;