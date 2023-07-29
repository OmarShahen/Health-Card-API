"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ClinicOwnerModel = require('../models/ClinicOwnerModel');

var ClinicDoctorModel = require('../models/ClinicDoctorModel');

var UserModel = require('../models/UserModel');

var ClinicModel = require('../models/ClinicModel');

var clinicOwnerValidation = require('../validations/clinics-owners');

var mongoose = require('mongoose');

var translations = require('../i18n/index');

var addClinicOwner = function addClinicOwner(request, response) {
  var dataValidation, lang, _request$body, ownerId, clinicId, ownerPromise, clinicPromise, _ref, _ref2, owner, clinic, clinicOwnerList, clinicOwnerData, clinicOwnerObj, newClinicOwner;

  return regeneratorRuntime.async(function addClinicOwner$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          dataValidation = clinicOwnerValidation.addClinicOwner(request.body);

          if (dataValidation.isAccepted) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          lang = request.query.lang;
          _request$body = request.body, ownerId = _request$body.ownerId, clinicId = _request$body.clinicId;
          ownerPromise = UserModel.findById(ownerId);
          clinicPromise = ClinicModel.findById(clinicId);
          _context.next = 10;
          return regeneratorRuntime.awrap(Promise.all([ownerPromise, clinicPromise]));

        case 10:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 2);
          owner = _ref2[0];
          clinic = _ref2[1];

          if (owner) {
            _context.next = 16;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'owner Id does not exist',
            field: 'ownerId'
          }));

        case 16:
          if (clinic) {
            _context.next = 18;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id does not exist',
            field: 'clinicId'
          }));

        case 18:
          _context.next = 20;
          return regeneratorRuntime.awrap(ClinicOwnerModel.find({
            ownerId: ownerId,
            clinicId: clinicId
          }));

        case 20:
          clinicOwnerList = _context.sent;

          if (!(clinicOwnerList.length == 1)) {
            _context.next = 23;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[lang]['Owner is already registered with the clinic'],
            field: 'ownerId'
          }));

        case 23:
          clinicOwnerData = {
            ownerId: ownerId,
            clinicId: clinicId
          };
          clinicOwnerObj = new ClinicOwnerModel(clinicOwnerData);
          _context.next = 27;
          return regeneratorRuntime.awrap(clinicOwnerObj.save());

        case 27:
          newClinicOwner = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[lang]['Added clinic owner successfully!'],
            clinicOwner: newClinicOwner
          }));

        case 31:
          _context.prev = 31;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 35:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 31]]);
};

var getClinicsByOwnerId = function getClinicsByOwnerId(request, response) {
  var userId, clinics;
  return regeneratorRuntime.async(function getClinicsByOwnerId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = request.params.userId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(ClinicOwnerModel.aggregate([{
            $match: {
              ownerId: mongoose.Types.ObjectId(userId)
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
          clinics = _context2.sent;
          clinics.forEach(function (clinic) {
            return clinic.clinic = clinic.clinic[0];
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: false,
            clinics: clinics
          }));

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getClinicsByOwnerIdWhichIsCreatedByOwner = function getClinicsByOwnerIdWhichIsCreatedByOwner(request, response) {
  var userId, clinics;
  return regeneratorRuntime.async(function getClinicsByOwnerIdWhichIsCreatedByOwner$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = request.params.userId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(ClinicOwnerModel.aggregate([{
            $match: {
              ownerId: mongoose.Types.ObjectId(userId),
              isCreator: true
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
          clinics = _context3.sent;
          clinics.forEach(function (clinic) {
            return clinic.clinic = clinic.clinic[0];
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: false,
            clinics: clinics
          }));

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var deleteClinicOwner = function deleteClinicOwner(request, response) {
  var lang, clinicOwnerId, deletedClinicOwner, ownerId, clinicId, deletedClinicDoctor;
  return regeneratorRuntime.async(function deleteClinicOwner$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          lang = request.query.lang;
          clinicOwnerId = request.params.clinicOwnerId;
          _context4.next = 5;
          return regeneratorRuntime.awrap(ClinicOwnerModel.findByIdAndDelete(clinicOwnerId));

        case 5:
          deletedClinicOwner = _context4.sent;
          ownerId = deletedClinicOwner.ownerId, clinicId = deletedClinicOwner.clinicId;
          _context4.next = 9;
          return regeneratorRuntime.awrap(ClinicDoctorModel.deleteOne({
            doctorId: ownerId,
            clinicId: clinicId
          }));

        case 9:
          deletedClinicDoctor = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[lang]['Deleted clinic owner successfully!'],
            clinicOwner: deletedClinicOwner,
            clinicDoctor: deletedClinicDoctor
          }));

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

module.exports = {
  addClinicOwner: addClinicOwner,
  deleteClinicOwner: deleteClinicOwner,
  getClinicsByOwnerId: getClinicsByOwnerId,
  getClinicsByOwnerIdWhichIsCreatedByOwner: getClinicsByOwnerIdWhichIsCreatedByOwner
};