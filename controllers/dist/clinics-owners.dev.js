"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ClinicOwnerModel = require('../models/ClinicOwnerModel');

var UserModel = require('../models/UserModel');

var ClinicModel = require('../models/ClinicModel');

var clinicOwnerValidation = require('../validations/clinics-owners');

var mongoose = require('mongoose');

var addClinicOwner = function addClinicOwner(request, response) {
  var dataValidation, _request$body, ownerId, clinicId, ownerPromise, clinicPromise, _ref, _ref2, owner, clinic, clinicOwnerList, clinicOwnerData, clinicOwnerObj, newClinicOwner;

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
          _request$body = request.body, ownerId = _request$body.ownerId, clinicId = _request$body.clinicId;
          ownerPromise = UserModel.findById(ownerId);
          clinicPromise = ClinicModel.findById(clinicId);
          _context.next = 9;
          return regeneratorRuntime.awrap(Promise.all([ownerPromise, clinicPromise]));

        case 9:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 2);
          owner = _ref2[0];
          clinic = _ref2[1];

          if (owner) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'owner Id does not exist',
            field: 'ownerId'
          }));

        case 15:
          if (clinic) {
            _context.next = 17;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id does not exist',
            field: 'clinicId'
          }));

        case 17:
          _context.next = 19;
          return regeneratorRuntime.awrap(ClinicOwnerModel.find({
            ownerId: ownerId,
            clinicId: clinicId
          }));

        case 19:
          clinicOwnerList = _context.sent;

          if (!(clinicOwnerList.length == 1)) {
            _context.next = 22;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'owner is already registered with the clinic',
            field: 'ownerId'
          }));

        case 22:
          clinicOwnerData = {
            ownerId: ownerId,
            clinicId: clinicId
          };
          clinicOwnerObj = new ClinicOwnerModel(clinicOwnerData);
          _context.next = 26;
          return regeneratorRuntime.awrap(clinicOwnerObj.save());

        case 26:
          newClinicOwner = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'added clinic owner successfully!',
            clinicOwner: newClinicOwner
          }));

        case 30:
          _context.prev = 30;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 34:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 30]]);
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

var deleteClinicOwner = function deleteClinicOwner(request, response) {
  var clinicOwnerId, deletedClinicOwner;
  return regeneratorRuntime.async(function deleteClinicOwner$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          clinicOwnerId = request.params.clinicOwnerId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(ClinicOwnerModel.findByIdAndDelete(clinicOwnerId));

        case 4:
          deletedClinicOwner = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'deleted clinic owner successfully!',
            clinicOwner: deletedClinicOwner
          }));

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = {
  addClinicOwner: addClinicOwner,
  deleteClinicOwner: deleteClinicOwner,
  getClinicsByOwnerId: getClinicsByOwnerId
};