"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ClinicRequestModel = require('../models/ClinicRequestModel');

var ClinicModel = require('../models/ClinicModel');

var UserModel = require('../models/UserModel');

var clinicRequestValidation = require('../validations/clinics-requests');

var ClinicDoctorModel = require('../models/ClinicDoctorModel');

var mongoose = require('mongoose');

var addClinicRequest = function addClinicRequest(request, response) {
  var dataValidation, _request$body, clinicId, userId, clinicPromise, userPromise, _ref, _ref2, clinic, user, clinicRequestList, clinicRequest, clinicRequestData, clinicRequestObj, newClinicRequest;

  return regeneratorRuntime.async(function addClinicRequest$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          dataValidation = clinicRequestValidation.addClinicRequest(request.body);

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
          _request$body = request.body, clinicId = _request$body.clinicId, userId = _request$body.userId;
          clinicPromise = ClinicModel.findById(clinicId);
          userPromise = UserModel.findById(userId);
          _context.next = 9;
          return regeneratorRuntime.awrap(Promise.all([clinicPromise, userPromise]));

        case 9:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 2);
          clinic = _ref2[0];
          user = _ref2[1];

          if (clinic) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id is not registered',
            field: 'clinicId'
          }));

        case 15:
          if (user) {
            _context.next = 17;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'user Id is not registered',
            field: 'userId'
          }));

        case 17:
          _context.next = 19;
          return regeneratorRuntime.awrap(ClinicRequestModel.find({
            clinicId: clinicId,
            userId: userId
          }));

        case 19:
          clinicRequestList = _context.sent;

          if (!(clinicRequestList.length > 0)) {
            _context.next = 26;
            break;
          }

          clinicRequest = clinicRequestList[0];

          if (!(clinicRequest.status == 'ACCEPTED')) {
            _context.next = 24;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic request is already accepted',
            field: 'clinicId'
          }));

        case 24:
          if (!(clinicRequest.status == 'PENDING')) {
            _context.next = 26;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic request is already pending',
            field: 'clinicId'
          }));

        case 26:
          clinicRequestData = {
            clinicId: clinicId,
            userId: userId
          };
          clinicRequestObj = new ClinicRequestModel(clinicRequestData);
          _context.next = 30;
          return regeneratorRuntime.awrap(clinicRequestObj.save());

        case 30:
          newClinicRequest = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'clinic request is registered successfully!',
            clinicRequest: newClinicRequest
          }));

        case 34:
          _context.prev = 34;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 38:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 34]]);
};

var getClinicsRequests = function getClinicsRequests(request, response) {
  var clinicRequestList;
  return regeneratorRuntime.async(function getClinicsRequests$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(ClinicRequestModel.find().sort({
            createdAt: -1
          }));

        case 3:
          clinicRequestList = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsRequests: clinicRequestList
          }));

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getClinicsRequestsByUserId = function getClinicsRequestsByUserId(request, response) {
  var userId, clinicRequestList;
  return regeneratorRuntime.async(function getClinicsRequestsByUserId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = request.params.userId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(ClinicRequestModel.aggregate([{
            $match: {
              userId: mongoose.Types.ObjectId(userId)
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user'
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
              'user.password': 0
            }
          }]));

        case 4:
          clinicRequestList = _context3.sent;
          clinicRequestList.forEach(function (clinicRequest) {
            clinicRequest.user = clinicRequest.user[0];
            clinicRequest.clinic = clinicRequest.clinic[0];
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsRequests: clinicRequestList
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

var getClinicsRequestsByClinicId = function getClinicsRequestsByClinicId(request, response) {
  var clinicId, clinicRequestList;
  return regeneratorRuntime.async(function getClinicsRequestsByClinicId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          clinicId = request.params.clinicId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(ClinicRequestModel.aggregate([{
            $match: {
              clinicId: mongoose.Types.ObjectId(clinicId)
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user'
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
              'user.password': 0
            }
          }]));

        case 4:
          clinicRequestList = _context4.sent;
          clinicRequestList.forEach(function (clinicRequest) {
            clinicRequest.user = clinicRequest.user[0];
            clinicRequest.clinic = clinicRequest.clinic[0];
          });
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsRequests: clinicRequestList
          }));

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var deleteClinicRequest = function deleteClinicRequest(request, response) {
  var clinicRequestId, deletedClinicRequest, userId, clinicId, deleteClinicDoctor;
  return regeneratorRuntime.async(function deleteClinicRequest$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          clinicRequestId = request.params.clinicRequestId;
          _context5.next = 4;
          return regeneratorRuntime.awrap(ClinicRequestModel.findByIdAndDelete(clinicRequestId));

        case 4:
          deletedClinicRequest = _context5.sent;
          userId = deletedClinicRequest.userId, clinicId = deletedClinicRequest.clinicId;
          _context5.next = 8;
          return regeneratorRuntime.awrap(ClinicDoctorModel.deleteOne({
            clinicId: clinicId,
            doctorId: userId
          }));

        case 8:
          deleteClinicDoctor = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            clinicRequest: deletedClinicRequest,
            clinicDoctor: deleteClinicDoctor
          }));

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 16:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var updateClinicRequestStatus = function updateClinicRequestStatus(request, response) {
  var clinicRequestId, status, clinicRequest, clinicId, userId, clinicDoctorList, updateClinicRequestPromise, clinicDoctorData, clinicDoctorObj, newClinicDoctorPromise, _ref3, _ref4, updateClinicRequest, newClinicDoctor, _clinicId, _userId, _updateClinicRequestPromise, deleteClinicDoctorPromise, _ref5, _ref6, _updateClinicRequest, deleteClinicDoctor;

  return regeneratorRuntime.async(function updateClinicRequestStatus$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          clinicRequestId = request.params.clinicRequestId;
          status = request.body.status;

          if (status) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'status is required',
            field: 'status'
          }));

        case 5:
          if (['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid clinic request status',
            field: 'status'
          }));

        case 7:
          _context6.next = 9;
          return regeneratorRuntime.awrap(ClinicRequestModel.findById(clinicRequestId));

        case 9:
          clinicRequest = _context6.sent;

          if (!(clinicRequest.status == status)) {
            _context6.next = 12;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic request has already this status',
            field: 'status'
          }));

        case 12:
          if (!(status == 'ACCEPTED')) {
            _context6.next = 29;
            break;
          }

          clinicId = clinicRequest.clinicId, userId = clinicRequest.userId;
          _context6.next = 16;
          return regeneratorRuntime.awrap(ClinicDoctorModel.find({
            clinicId: clinicId,
            doctorId: userId
          }));

        case 16:
          clinicDoctorList = _context6.sent;

          if (!(clinicDoctorList.length != 0)) {
            _context6.next = 19;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'doctor is already registered with the clinic',
            field: 'status'
          }));

        case 19:
          updateClinicRequestPromise = ClinicRequestModel.findByIdAndUpdate(clinicRequestId, {
            status: status
          }, {
            "new": true
          });
          clinicDoctorData = {
            clinicId: clinicId,
            doctorId: userId
          };
          clinicDoctorObj = new ClinicDoctorModel(clinicDoctorData);
          newClinicDoctorPromise = clinicDoctorObj.save();
          _context6.next = 25;
          return regeneratorRuntime.awrap(Promise.all([updateClinicRequestPromise, newClinicDoctorPromise]));

        case 25:
          _ref3 = _context6.sent;
          _ref4 = _slicedToArray(_ref3, 2);
          updateClinicRequest = _ref4[0];
          newClinicDoctor = _ref4[1];

        case 29:
          if (!(status == 'PENDING' || status == 'REJECTED')) {
            _context6.next = 39;
            break;
          }

          _clinicId = clinicRequest.clinicId, _userId = clinicRequest.userId;
          _updateClinicRequestPromise = ClinicRequestModel.findByIdAndUpdate(clinicRequestId, {
            status: status
          }, {
            "new": true
          });
          deleteClinicDoctorPromise = ClinicDoctorModel.deleteOne({
            clinicId: _clinicId,
            doctorId: _userId
          });
          _context6.next = 35;
          return regeneratorRuntime.awrap(Promise.all([_updateClinicRequestPromise, deleteClinicDoctorPromise]));

        case 35:
          _ref5 = _context6.sent;
          _ref6 = _slicedToArray(_ref5, 2);
          _updateClinicRequest = _ref6[0];
          deleteClinicDoctor = _ref6[1];

        case 39:
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'updated clinic request status successfully!'
          }));

        case 42:
          _context6.prev = 42;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 46:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 42]]);
};

module.exports = {
  addClinicRequest: addClinicRequest,
  getClinicsRequests: getClinicsRequests,
  getClinicsRequestsByUserId: getClinicsRequestsByUserId,
  getClinicsRequestsByClinicId: getClinicsRequestsByClinicId,
  deleteClinicRequest: deleteClinicRequest,
  updateClinicRequestStatus: updateClinicRequestStatus
};