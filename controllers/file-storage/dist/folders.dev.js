"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FolderModel = require('../../models/file-storage/FolderModel');

var FileModel = require('../../models/file-storage/FileModel');

var ClinicModel = require('../../models/ClinicModel');

var UserModel = require('../../models/UserModel');

var PatientModel = require('../../models/PatientModel');

var folderValidator = require('../../validations/file-storage/folders');

var mongoose = require('mongoose');

var translations = require('../../i18n/index');

var getFolders = function getFolders(request, response) {
  var folders;
  return regeneratorRuntime.async(function getFolders$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(FolderModel.find().sort({
            createdAt: -1
          }));

        case 3:
          folders = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            folders: folders
          }));

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var addFolder = function addFolder(request, response) {
  var dataValidation, _request$body, clinicId, creatorId, parentFolderId, name, creator, clinic, parentFolder, sameFolderNameList, newFolderData, folderObj, newFolder;

  return regeneratorRuntime.async(function addFolder$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = folderValidator.addFolder(request.body);

          if (dataValidation.isAccepted) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body = request.body, clinicId = _request$body.clinicId, creatorId = _request$body.creatorId, parentFolderId = _request$body.parentFolderId, name = _request$body.name;
          _context2.next = 7;
          return regeneratorRuntime.awrap(UserModel.findById(creatorId));

        case 7:
          creator = _context2.sent;

          if (parentFolderId) {
            _context2.next = 14;
            break;
          }

          _context2.next = 11;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 11:
          clinic = _context2.sent;

          if (clinic) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic ID is not registered',
            field: 'clinicId'
          }));

        case 14:
          if (creator) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Creator ID is not registered',
            field: 'creatorId'
          }));

        case 16:
          parentFolder = {};

          if (!parentFolderId) {
            _context2.next = 23;
            break;
          }

          _context2.next = 20;
          return regeneratorRuntime.awrap(FolderModel.findById(parentFolderId));

        case 20:
          parentFolder = _context2.sent;

          if (parentFolder) {
            _context2.next = 23;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Parent folder is not registered',
            field: 'parentFolderId'
          }));

        case 23:
          _context2.next = 25;
          return regeneratorRuntime.awrap(FolderModel.find({
            clinicId: clinicId,
            name: name,
            parentFolderId: parentFolderId
          }));

        case 25:
          sameFolderNameList = _context2.sent;

          if (!(sameFolderNameList.length != 0)) {
            _context2.next = 28;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Folder name is already registered in this folder'],
            field: 'name'
          }));

        case 28:
          newFolderData = _objectSpread({}, request.body);

          if (parentFolderId) {
            newFolderData.clinicId = parentFolder.clinicId;
          }

          if (parentFolder.patientId) {
            newFolderData.patientId = parentFolder.patientId;
          }

          folderObj = new FolderModel(newFolderData);
          _context2.next = 34;
          return regeneratorRuntime.awrap(folderObj.save());

        case 34:
          newFolder = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added folder successfully!'],
            folder: newFolder
          }));

        case 38:
          _context2.prev = 38;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 42:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 38]]);
};

var addPatientFolder = function addPatientFolder(request, response) {
  var dataValidation, _request$body2, patientId, clinicId, creatorId, parentFolderId, name, creator, patient, clinic, parentFolder, sameFolderNameList, newFolderData, folderObj, newFolder;

  return regeneratorRuntime.async(function addPatientFolder$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = folderValidator.addPatientFolder(request.body);

          if (dataValidation.isAccepted) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body2 = request.body, patientId = _request$body2.patientId, clinicId = _request$body2.clinicId, creatorId = _request$body2.creatorId, parentFolderId = _request$body2.parentFolderId, name = _request$body2.name;
          _context3.next = 7;
          return regeneratorRuntime.awrap(UserModel.findById(creatorId));

        case 7:
          creator = _context3.sent;
          _context3.next = 10;
          return regeneratorRuntime.awrap(PatientModel.findById(patientId));

        case 10:
          patient = _context3.sent;

          if (parentFolderId) {
            _context3.next = 17;
            break;
          }

          _context3.next = 14;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 14:
          clinic = _context3.sent;

          if (clinic) {
            _context3.next = 17;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic ID is not registered',
            field: 'clinicId'
          }));

        case 17:
          if (creator) {
            _context3.next = 19;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Creator ID is not registered',
            field: 'creatorId'
          }));

        case 19:
          if (patient) {
            _context3.next = 21;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Patient ID is not registered',
            field: 'patientId'
          }));

        case 21:
          if (!parentFolderId) {
            _context3.next = 27;
            break;
          }

          _context3.next = 24;
          return regeneratorRuntime.awrap(FolderModel.findById(parentFolderId));

        case 24:
          parentFolder = _context3.sent;

          if (parentFolder) {
            _context3.next = 27;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Parent folder is not registered',
            field: 'parentFolderId'
          }));

        case 27:
          _context3.next = 29;
          return regeneratorRuntime.awrap(FolderModel.find({
            patientId: patientId,
            clinicId: clinicId,
            name: name,
            parentFolderId: parentFolderId
          }));

        case 29:
          sameFolderNameList = _context3.sent;

          if (!(sameFolderNameList.length != 0)) {
            _context3.next = 32;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Folder name is already registered in this folder'],
            field: 'name'
          }));

        case 32:
          newFolderData = _objectSpread({}, request.body);

          if (parentFolderId) {
            newFolderData.clinicId = parentFolder.clinicId;
          }

          folderObj = new FolderModel(newFolderData);
          _context3.next = 37;
          return regeneratorRuntime.awrap(folderObj.save());

        case 37:
          newFolder = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added patient folder successfully!'],
            folder: newFolder
          }));

        case 41:
          _context3.prev = 41;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 45:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 41]]);
};

var updateFolderName = function updateFolderName(request, response) {
  var dataValidation, folderId, name, folder, nameList, updatedFolder;
  return regeneratorRuntime.async(function updateFolderName$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          dataValidation = folderValidator.updateFolderName(request.body);

          if (dataValidation.isAccepted) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          folderId = request.params.folderId;
          name = request.body.name;
          _context4.next = 8;
          return regeneratorRuntime.awrap(FolderModel.findById(folderId));

        case 8:
          folder = _context4.sent;

          if (!(name != folder.name)) {
            _context4.next = 15;
            break;
          }

          _context4.next = 12;
          return regeneratorRuntime.awrap(FolderModel.find({
            clinicId: folder.clinicId,
            name: name,
            parentFolderId: folder.parentFolderId
          }));

        case 12:
          nameList = _context4.sent;

          if (!(nameList.length != 0)) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Folder name is already registered in the folder'],
            field: 'name'
          }));

        case 15:
          _context4.next = 17;
          return regeneratorRuntime.awrap(FolderModel.findByIdAndUpdate(folder._id, {
            name: name
          }, {
            "new": true
          }));

        case 17:
          updatedFolder = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated folder name successfully!'],
            folder: updatedFolder
          }));

        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 25:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var getFoldersByClinicId = function getFoldersByClinicId(request, response) {
  var clinicId, folders;
  return regeneratorRuntime.async(function getFoldersByClinicId$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          clinicId = request.params.clinicId;
          _context5.next = 4;
          return regeneratorRuntime.awrap(FolderModel.aggregate([{
            $match: {
              clinicId: mongoose.Types.ObjectId(clinicId)
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'creatorId',
              foreignField: '_id',
              as: 'creator'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'creator.password': 0
            }
          }]));

        case 4:
          folders = _context5.sent;
          folders.forEach(function (folder) {
            return folder.creator = folder.creator[0];
          });
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            folders: folders
          }));

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getClinicsStaffsFoldersByClinicId = function getClinicsStaffsFoldersByClinicId(request, response) {
  var _request$params, clinicId, patientId, folders;

  return regeneratorRuntime.async(function getClinicsStaffsFoldersByClinicId$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _request$params = request.params, clinicId = _request$params.clinicId, patientId = _request$params.patientId;
          _context6.next = 4;
          return regeneratorRuntime.awrap(FolderModel.aggregate([{
            $match: {
              clinicId: mongoose.Types.ObjectId(clinicId),
              patientId: mongoose.Types.ObjectId(patientId)
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'creatorId',
              foreignField: '_id',
              as: 'creator'
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $match: {
              'creator.roles': {
                $in: ['STAFF']
              }
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'creator.password': 0
            }
          }]));

        case 4:
          folders = _context6.sent;
          folders.forEach(function (folder) {
            folder.creator = folder.creator[0];
            folder.clinic = folder.clinic[0];
          });
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            folders: folders
          }));

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getFoldersByParentFolderId = function getFoldersByParentFolderId(request, response) {
  var folderId, folders;
  return regeneratorRuntime.async(function getFoldersByParentFolderId$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          folderId = request.params.folderId;
          _context7.next = 4;
          return regeneratorRuntime.awrap(FolderModel.aggregate([{
            $match: {
              parentFolderId: mongoose.Types.ObjectId(folderId)
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'creatorId',
              foreignField: '_id',
              as: 'creator'
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'creator.password': 0
            }
          }]));

        case 4:
          folders = _context7.sent;
          folders.forEach(function (folder) {
            folder.creator = folder.creator[0];
            folder.clinic = folder.clinic[0];
          });
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            folders: folders
          }));

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getFoldersByCreatorId = function getFoldersByCreatorId(request, response) {
  var userId, folders;
  return regeneratorRuntime.async(function getFoldersByCreatorId$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          userId = request.params.userId;
          _context8.next = 4;
          return regeneratorRuntime.awrap(FolderModel.aggregate([{
            $match: {
              creatorId: mongoose.Types.ObjectId(userId),
              parentFolderId: {
                $exists: false
              },
              patientId: {
                $exists: false
              }
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'creatorId',
              foreignField: '_id',
              as: 'creator'
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'creator.password': 0
            }
          }]));

        case 4:
          folders = _context8.sent;
          folders.forEach(function (folder) {
            folder.creator = folder.creator[0];
            folder.clinic = folder.clinic[0];
          });
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            folders: folders
          }));

        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getFolderById = function getFolderById(request, response) {
  var folderId, folder;
  return regeneratorRuntime.async(function getFolderById$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          folderId = request.params.folderId;
          _context9.next = 4;
          return regeneratorRuntime.awrap(FolderModel.findById(folderId));

        case 4:
          folder = _context9.sent;
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            folder: folder
          }));

        case 8:
          _context9.prev = 8;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 12:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getHomeFoldersByPatientId = function getHomeFoldersByPatientId(request, response) {
  var patientId, folders;
  return regeneratorRuntime.async(function getHomeFoldersByPatientId$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          patientId = request.params.patientId;
          _context10.next = 4;
          return regeneratorRuntime.awrap(FolderModel.aggregate([{
            $match: {
              patientId: mongoose.Types.ObjectId(patientId),
              parentFolderId: {
                $exists: false
              }
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'creatorId',
              foreignField: '_id',
              as: 'creator'
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 4:
          folders = _context10.sent;
          folders.forEach(function (folder) {
            folder.creator = folder.creator[0];
            folder.clinic = folder.clinic[0];
          });
          return _context10.abrupt("return", response.status(200).json({
            accepted: true,
            folders: folders
          }));

        case 9:
          _context10.prev = 9;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          return _context10.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context10.t0.message
          }));

        case 13:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var deleteFolder = function deleteFolder(request, response) {
  var folderId, filesList, foldersList, deletedFolder;
  return regeneratorRuntime.async(function deleteFolder$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          folderId = request.params.folderId;
          _context11.next = 4;
          return regeneratorRuntime.awrap(FileModel.find({
            folderId: folderId
          }));

        case 4:
          filesList = _context11.sent;

          if (!(filesList.length != 0)) {
            _context11.next = 7;
            break;
          }

          return _context11.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Folder contains files'],
            field: 'folderId'
          }));

        case 7:
          _context11.next = 9;
          return regeneratorRuntime.awrap(FolderModel.find({
            parentFolderId: folderId
          }));

        case 9:
          foldersList = _context11.sent;

          if (!(foldersList.length != 0)) {
            _context11.next = 12;
            break;
          }

          return _context11.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Folder contains folders'],
            field: 'folderId'
          }));

        case 12:
          _context11.next = 14;
          return regeneratorRuntime.awrap(FolderModel.findByIdAndDelete(folderId));

        case 14:
          deletedFolder = _context11.sent;
          return _context11.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Deleted folder successfully!'],
            folder: deletedFolder
          }));

        case 18:
          _context11.prev = 18;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          return _context11.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context11.t0.message
          }));

        case 22:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

module.exports = {
  getFolders: getFolders,
  addFolder: addFolder,
  addPatientFolder: addPatientFolder,
  updateFolderName: updateFolderName,
  deleteFolder: deleteFolder,
  getFoldersByParentFolderId: getFoldersByParentFolderId,
  getFoldersByClinicId: getFoldersByClinicId,
  getFoldersByCreatorId: getFoldersByCreatorId,
  getFolderById: getFolderById,
  getHomeFoldersByPatientId: getHomeFoldersByPatientId,
  getClinicsStaffsFoldersByClinicId: getClinicsStaffsFoldersByClinicId
};