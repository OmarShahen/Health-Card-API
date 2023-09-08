"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var FolderModel = require('../../models/file-storage/FolderModel');

var FileModel = require('../../models/file-storage/FileModel');

var ClinicModel = require('../../models/ClinicModel');

var UserModel = require('../../models/UserModel');

var PatientModel = require('../../models/PatientModel');

var filesValidator = require('../../validations/file-storage/files');

var mongoose = require('mongoose');

var translations = require('../../i18n/index');

var getFiles = function getFiles(request, response) {
  var files;
  return regeneratorRuntime.async(function getFiles$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(FileModel.find().sort({
            createdAt: -1
          }));

        case 3:
          files = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            files: files
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

var addFile = function addFile(request, response) {
  var dataValidation, _request$body, creatorId, folderId, name, creatorPromise, folderPromise, _ref, _ref2, creator, folder, nameSearchQuery, sameFileNameList, newFileData, fileObj, newFile;

  return regeneratorRuntime.async(function addFile$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = filesValidator.addFile(request.body);

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
          _request$body = request.body, creatorId = _request$body.creatorId, folderId = _request$body.folderId, name = _request$body.name;
          creatorPromise = UserModel.findById(creatorId);
          folderPromise = FolderModel.findById(folderId);
          _context2.next = 9;
          return regeneratorRuntime.awrap(Promise.all([creatorPromise, folderPromise]));

        case 9:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 2);
          creator = _ref2[0];
          folder = _ref2[1];

          if (creator) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Creator ID is not registered',
            field: 'creatorId'
          }));

        case 15:
          if (folder) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Folder ID is not registered',
            field: 'folderId'
          }));

        case 17:
          nameSearchQuery = {
            clinicId: folder.clinicId,
            name: name,
            folderId: folderId
          };

          if (folder.patientId) {
            nameSearchQuery.patientId = folder.patientId;
          }

          _context2.next = 21;
          return regeneratorRuntime.awrap(FileModel.find(nameSearchQuery));

        case 21:
          sameFileNameList = _context2.sent;

          if (!(sameFileNameList.length != 0)) {
            _context2.next = 24;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['File name is already registered in this folder'],
            field: 'name'
          }));

        case 24:
          newFileData = _objectSpread({}, request.body);
          newFileData.clinicId = folder.clinicId;

          if (folder.patientId) {
            newFileData.patientId = folder.patientId;
          }

          fileObj = new FileModel(newFileData);
          _context2.next = 30;
          return regeneratorRuntime.awrap(fileObj.save());

        case 30:
          newFile = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added file successfully!'],
            file: newFile
          }));

        case 34:
          _context2.prev = 34;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 38:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 34]]);
};

var getFilesByCreatorId = function getFilesByCreatorId(request, response) {
  var userId, isPinned, matchQuery, sortQuery, files;
  return regeneratorRuntime.async(function getFilesByCreatorId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = request.params.userId;
          isPinned = request.query.isPinned;
          matchQuery = {
            creatorId: mongoose.Types.ObjectId(userId),
            patientId: {
              $exists: false
            }
          };
          sortQuery = isPinned == 'true' ? {
            updatedAt: -1
          } : {
            createdAt: -1
          };

          if (isPinned == 'true') {
            matchQuery.isPinned = true;
          }

          _context3.next = 8;
          return regeneratorRuntime.awrap(FileModel.aggregate([{
            $match: matchQuery
          }, {
            $sort: sortQuery
          }]));

        case 8:
          files = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            files: files
          }));

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var getFilesByPatientId = function getFilesByPatientId(request, response) {
  var patientId, isPinned, matchQuery, sortQuery, files;
  return regeneratorRuntime.async(function getFilesByPatientId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          patientId = request.params.patientId;
          isPinned = request.query.isPinned;
          matchQuery = {
            patientId: mongoose.Types.ObjectId(patientId)
          };
          sortQuery = isPinned == 'true' ? {
            updatedAt: -1
          } : {
            createdAt: -1
          };

          if (isPinned == 'true') {
            matchQuery.isPinned = true;
          }

          _context4.next = 8;
          return regeneratorRuntime.awrap(FileModel.aggregate([{
            $match: matchQuery
          }, {
            $sort: sortQuery
          }]));

        case 8:
          files = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            files: files
          }));

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var getFileById = function getFileById(request, response) {
  var fileId, file;
  return regeneratorRuntime.async(function getFileById$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          fileId = request.params.fileId;
          _context5.next = 4;
          return regeneratorRuntime.awrap(FileModel.findById(fileId));

        case 4:
          file = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            file: file
          }));

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getFilesByPatientIdAndClinicId = function getFilesByPatientIdAndClinicId(request, response) {
  var _request$params, patientId, clinicId, files;

  return regeneratorRuntime.async(function getFilesByPatientIdAndClinicId$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _request$params = request.params, patientId = _request$params.patientId, clinicId = _request$params.clinicId;
          _context6.next = 4;
          return regeneratorRuntime.awrap(FileModel.aggregate([{
            $match: {
              patientId: mongoose.Types.ObjectId(patientId),
              clinicId: mongoose.Types.ObjectId(clinicId)
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 4:
          files = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            files: files
          }));

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getFilesByFolderId = function getFilesByFolderId(request, response) {
  var folderId, files;
  return regeneratorRuntime.async(function getFilesByFolderId$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          folderId = request.params.folderId;
          _context7.next = 4;
          return regeneratorRuntime.awrap(FileModel.aggregate([{
            $match: {
              folderId: mongoose.Types.ObjectId(folderId)
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 4:
          files = _context7.sent;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            files: files
          }));

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var deleteFile = function deleteFile(request, response) {
  var fileId, deletedFile;
  return regeneratorRuntime.async(function deleteFile$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          fileId = request.params.fileId;
          _context8.next = 4;
          return regeneratorRuntime.awrap(FileModel.findByIdAndDelete(fileId));

        case 4:
          deletedFile = _context8.sent;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Deleted file successfully!'],
            file: deletedFile
          }));

        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 12:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var updateFileName = function updateFileName(request, response) {
  var dataValidation, fileId, name, file, nameList, updatedFile;
  return regeneratorRuntime.async(function updateFileName$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          dataValidation = filesValidator.updateFileName(request.body);

          if (dataValidation.isAccepted) {
            _context9.next = 4;
            break;
          }

          return _context9.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          fileId = request.params.fileId;
          name = request.body.name;
          _context9.next = 8;
          return regeneratorRuntime.awrap(FileModel.findById(fileId));

        case 8:
          file = _context9.sent;

          if (!(name != file.name)) {
            _context9.next = 15;
            break;
          }

          _context9.next = 12;
          return regeneratorRuntime.awrap(FileModel.find({
            clinicId: file.clinicId,
            name: name,
            folderId: file.folderId
          }));

        case 12:
          nameList = _context9.sent;

          if (!(nameList.length != 0)) {
            _context9.next = 15;
            break;
          }

          return _context9.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['File name is already registered in the folder'],
            field: 'name'
          }));

        case 15:
          _context9.next = 17;
          return regeneratorRuntime.awrap(FileModel.findByIdAndUpdate(file._id, {
            name: name
          }, {
            "new": true
          }));

        case 17:
          updatedFile = _context9.sent;
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated file name successfully!'],
            file: updatedFile
          }));

        case 21:
          _context9.prev = 21;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 25:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var updateFilePinStatus = function updateFilePinStatus(request, response) {
  var dataValidation, fileId, isPinned, updatedFile;
  return regeneratorRuntime.async(function updateFilePinStatus$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          dataValidation = filesValidator.updateFilePinStatus(request.body);

          if (dataValidation.isAccepted) {
            _context10.next = 4;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          fileId = request.params.fileId;
          isPinned = request.body.isPinned;
          _context10.next = 8;
          return regeneratorRuntime.awrap(FileModel.findByIdAndUpdate(fileId, {
            isPinned: isPinned
          }, {
            "new": true
          }));

        case 8:
          updatedFile = _context10.sent;
          return _context10.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated file pinning status successfully!'],
            file: updatedFile
          }));

        case 12:
          _context10.prev = 12;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          return _context10.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context10.t0.message
          }));

        case 16:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

module.exports = {
  getFiles: getFiles,
  addFile: addFile,
  deleteFile: deleteFile,
  updateFileName: updateFileName,
  getFilesByPatientId: getFilesByPatientId,
  getFileById: getFileById,
  getFilesByPatientIdAndClinicId: getFilesByPatientIdAndClinicId,
  getFilesByFolderId: getFilesByFolderId,
  getFilesByCreatorId: getFilesByCreatorId,
  updateFilePinStatus: updateFilePinStatus
};