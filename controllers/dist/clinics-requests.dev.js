"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ClinicRequestModel = require('../models/ClinicRequestModel');

var ClinicModel = require('../models/ClinicModel');

var ClinicOwnerModel = require('../models/ClinicOwnerModel');

var UserModel = require('../models/UserModel');

var clinicRequestValidation = require('../validations/clinics-requests');

var ClinicDoctorModel = require('../models/ClinicDoctorModel');

var mongoose = require('mongoose');

var translations = require('../i18n/index');

var addClinicRequest = function addClinicRequest(request, response) {
  var dataValidation, lang, _request$body, clinicId, userId, role, clinicPromise, userPromise, _ref, _ref2, clinic, user, clinicRequestList, clinicRequest, clinicRequestData, clinicRequestObj, newClinicRequest;

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
          lang = request.query.lang;
          _request$body = request.body, clinicId = _request$body.clinicId, userId = _request$body.userId, role = _request$body.role;
          clinicPromise = ClinicModel.findById(clinicId);
          userPromise = UserModel.findById(userId);
          _context.next = 10;
          return regeneratorRuntime.awrap(Promise.all([clinicPromise, userPromise]));

        case 10:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 2);
          clinic = _ref2[0];
          user = _ref2[1];

          if (clinic) {
            _context.next = 16;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id is not registered',
            field: 'clinicId'
          }));

        case 16:
          if (user) {
            _context.next = 18;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'user Id is not registered',
            field: 'userId'
          }));

        case 18:
          _context.next = 20;
          return regeneratorRuntime.awrap(ClinicRequestModel.find({
            clinicId: clinicId,
            userId: userId
          }));

        case 20:
          clinicRequestList = _context.sent;

          if (!(clinicRequestList.length > 0)) {
            _context.next = 29;
            break;
          }

          clinicRequest = clinicRequestList[0];

          if (!(clinicRequest.status == 'ACCEPTED')) {
            _context.next = 25;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[lang]['Clinic request is already accepted'],
            field: 'clinicId'
          }));

        case 25:
          if (!(clinicRequest.status == 'PENDING')) {
            _context.next = 27;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[lang]['Clinic request is already pending'],
            field: 'clinicId'
          }));

        case 27:
          if (!(clinicRequest.status == 'REJECTED')) {
            _context.next = 29;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[lang]['Clinic request is already rejected'],
            field: 'clinicId'
          }));

        case 29:
          clinicRequestData = {
            clinicId: clinicId,
            userId: userId,
            role: role
          };
          clinicRequestObj = new ClinicRequestModel(clinicRequestData);
          _context.next = 33;
          return regeneratorRuntime.awrap(clinicRequestObj.save());

        case 33:
          newClinicRequest = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[lang]['Clinic request is sent successfully!'],
            clinicRequest: newClinicRequest
          }));

        case 37:
          _context.prev = 37;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 41:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 37]]);
};

var addDoctorClinicRequestByReceiverEmail = function addDoctorClinicRequestByReceiverEmail(request, response) {
  var dataValidation, lang, _request$body2, clinicId, email, clinicPromise, userListPromise, _ref3, _ref4, clinic, userList, user, userId, clinicDoctorList, clinicRequestList, clinicRequest, clinicRequestData, clinicRequestObj, newClinicRequest;

  return regeneratorRuntime.async(function addDoctorClinicRequestByReceiverEmail$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = clinicRequestValidation.addClinicRequestByReceiverEmail(request.body);

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
          lang = request.query.lang;
          _request$body2 = request.body, clinicId = _request$body2.clinicId, email = _request$body2.email;
          clinicPromise = ClinicModel.findById(clinicId);
          userListPromise = UserModel.find({
            email: email,
            isVerified: true
          });
          _context2.next = 10;
          return regeneratorRuntime.awrap(Promise.all([clinicPromise, userListPromise]));

        case 10:
          _ref3 = _context2.sent;
          _ref4 = _slicedToArray(_ref3, 2);
          clinic = _ref4[0];
          userList = _ref4[1];

          if (clinic) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id is not registered',
            field: 'clinicId'
          }));

        case 16:
          if (!(userList.length == 0)) {
            _context2.next = 18;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[lang]['User email is not registered'],
            field: 'email'
          }));

        case 18:
          user = userList[0];
          userId = user._id;

          if (user.roles.includes('DOCTOR')) {
            _context2.next = 22;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[lang]['Cannot send request except for doctors'],
            field: 'userId'
          }));

        case 22:
          _context2.next = 24;
          return regeneratorRuntime.awrap(ClinicDoctorModel.find({
            clinicId: clinicId,
            doctorId: userId
          }));

        case 24:
          clinicDoctorList = _context2.sent;

          if (!(clinicDoctorList.length != 0)) {
            _context2.next = 27;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[lang]['Doctor is already registered with the clinic'],
            field: 'userId'
          }));

        case 27:
          _context2.next = 29;
          return regeneratorRuntime.awrap(ClinicRequestModel.find({
            clinicId: clinicId,
            userId: userId,
            role: 'DOCTOR'
          }));

        case 29:
          clinicRequestList = _context2.sent;

          if (!(clinicRequestList.length > 0)) {
            _context2.next = 38;
            break;
          }

          clinicRequest = clinicRequestList[0];

          if (!(clinicRequest.status == 'ACCEPTED')) {
            _context2.next = 34;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[lang]['Clinic request is already accepted'],
            field: 'clinicId'
          }));

        case 34:
          if (!(clinicRequest.status == 'PENDING')) {
            _context2.next = 36;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[lang]['Clinic request is already pending'],
            field: 'clinicId'
          }));

        case 36:
          if (!(clinicRequest.status == 'REJECTED')) {
            _context2.next = 38;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[lang]['Clinic request is already rejected'],
            field: 'clinicId'
          }));

        case 38:
          clinicRequestData = {
            clinicId: clinicId,
            userId: userId,
            role: 'DOCTOR'
          };
          clinicRequestObj = new ClinicRequestModel(clinicRequestData);
          _context2.next = 42;
          return regeneratorRuntime.awrap(clinicRequestObj.save());

        case 42:
          newClinicRequest = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[lang]['Clinic request is sent successfully!'],
            clinicRequest: newClinicRequest
          }));

        case 46:
          _context2.prev = 46;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 50:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 46]]);
};

var addOwnerClinicRequestByReceiverEmail = function addOwnerClinicRequestByReceiverEmail(request, response) {
  var dataValidation, lang, _request$body3, clinicId, email, clinicPromise, userListPromise, _ref5, _ref6, clinic, userList, user, userId, clinicOwnerList, clinicRequestList, clinicRequest, clinicRequestData, clinicRequestObj, newClinicRequest;

  return regeneratorRuntime.async(function addOwnerClinicRequestByReceiverEmail$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = clinicRequestValidation.addClinicRequestByReceiverEmail(request.body);

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
          lang = request.query.lang;
          _request$body3 = request.body, clinicId = _request$body3.clinicId, email = _request$body3.email;
          clinicPromise = ClinicModel.findById(clinicId);
          userListPromise = UserModel.find({
            email: email,
            isVerified: true
          });
          _context3.next = 10;
          return regeneratorRuntime.awrap(Promise.all([clinicPromise, userListPromise]));

        case 10:
          _ref5 = _context3.sent;
          _ref6 = _slicedToArray(_ref5, 2);
          clinic = _ref6[0];
          userList = _ref6[1];

          if (clinic) {
            _context3.next = 16;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id is not registered',
            field: 'clinicId'
          }));

        case 16:
          if (!(userList.length == 0)) {
            _context3.next = 18;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[lang]['User email is not registered'],
            field: 'email'
          }));

        case 18:
          user = userList[0];
          userId = user._id;

          if (user.roles.includes('OWNER')) {
            _context3.next = 22;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[lang]['Cannot send request except for owners'],
            field: 'userId'
          }));

        case 22:
          _context3.next = 24;
          return regeneratorRuntime.awrap(ClinicOwnerModel.find({
            clinicId: clinicId,
            ownerId: userId
          }));

        case 24:
          clinicOwnerList = _context3.sent;

          if (!(clinicOwnerList.length != 0)) {
            _context3.next = 27;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[lang]['Owner is already registered with the clinic'],
            field: 'userId'
          }));

        case 27:
          _context3.next = 29;
          return regeneratorRuntime.awrap(ClinicRequestModel.find({
            clinicId: clinicId,
            userId: userId,
            role: 'OWNER'
          }));

        case 29:
          clinicRequestList = _context3.sent;

          if (!(clinicRequestList.length > 0)) {
            _context3.next = 38;
            break;
          }

          clinicRequest = clinicRequestList[0];

          if (!(clinicRequest.status == 'ACCEPTED')) {
            _context3.next = 34;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[lang]['Clinic request is already accepted'],
            field: 'clinicId'
          }));

        case 34:
          if (!(clinicRequest.status == 'PENDING')) {
            _context3.next = 36;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[lang]['Clinic request is already pending'],
            field: 'clinicId'
          }));

        case 36:
          if (!(clinicRequest.status == 'REJECTED')) {
            _context3.next = 38;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[lang]['Clinic request is already rejected'],
            field: 'clinicId'
          }));

        case 38:
          clinicRequestData = {
            clinicId: clinicId,
            userId: userId,
            role: 'OWNER'
          };
          clinicRequestObj = new ClinicRequestModel(clinicRequestData);
          _context3.next = 42;
          return regeneratorRuntime.awrap(clinicRequestObj.save());

        case 42:
          newClinicRequest = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[lang]['Clinic request is sent successfully!'],
            clinicRequest: newClinicRequest
          }));

        case 46:
          _context3.prev = 46;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 50:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 46]]);
};

var addStaffClinicRequestByClinicId = function addStaffClinicRequestByClinicId(request, response) {
  var dataValidation, _request$body4, clinicId, userId, clinicListPromise, userPromise, _ref7, _ref8, clinicList, user, clinic, deleteOldClinicRequests, clinicRequestData, clinicRequestObj, newClinicRequest;

  return regeneratorRuntime.async(function addStaffClinicRequestByClinicId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          dataValidation = clinicRequestValidation.addStaffClinicRequestByClinicId(request.body);

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
          _request$body4 = request.body, clinicId = _request$body4.clinicId, userId = _request$body4.userId;
          clinicListPromise = ClinicModel.find({
            clinicId: clinicId
          });
          userPromise = UserModel.findById(userId);
          _context4.next = 9;
          return regeneratorRuntime.awrap(Promise.all([clinicListPromise, userPromise]));

        case 9:
          _ref7 = _context4.sent;
          _ref8 = _slicedToArray(_ref7, 2);
          clinicList = _ref8[0];
          user = _ref8[1];

          if (!(clinicList.length == 0)) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id is not registered',
            field: 'clinicId'
          }));

        case 15:
          if (user) {
            _context4.next = 17;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'user Id is not registered',
            field: 'userId'
          }));

        case 17:
          if (user.roles.includes('STAFF')) {
            _context4.next = 19;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Invalid user role type to perform this operation'],
            field: 'userId'
          }));

        case 19:
          if (!user.clinicId) {
            _context4.next = 21;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['User is already registered with a clinic'],
            field: 'userId'
          }));

        case 21:
          clinic = clinicList[0];
          clinicId = clinic._id;
          _context4.next = 25;
          return regeneratorRuntime.awrap(ClinicRequestModel.deleteMany({
            userId: userId
          }));

        case 25:
          deleteOldClinicRequests = _context4.sent;
          clinicRequestData = {
            clinicId: clinicId,
            userId: userId,
            role: 'STAFF'
          };
          clinicRequestObj = new ClinicRequestModel(clinicRequestData);
          _context4.next = 30;
          return regeneratorRuntime.awrap(clinicRequestObj.save());

        case 30:
          newClinicRequest = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Clinic request is sent successfully!'],
            clinicRequest: newClinicRequest
          }));

        case 34:
          _context4.prev = 34;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 38:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 34]]);
};

var getClinicsRequests = function getClinicsRequests(request, response) {
  var clinicRequestList;
  return regeneratorRuntime.async(function getClinicsRequests$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(ClinicRequestModel.find().sort({
            createdAt: -1
          }));

        case 3:
          clinicRequestList = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsRequests: clinicRequestList
          }));

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getClinicsRequestsByUserId = function getClinicsRequestsByUserId(request, response) {
  var userId, clinicRequestList;
  return regeneratorRuntime.async(function getClinicsRequestsByUserId$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          userId = request.params.userId;
          _context6.next = 4;
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
          clinicRequestList = _context6.sent;
          clinicRequestList.forEach(function (clinicRequest) {
            clinicRequest.user = clinicRequest.user[0];
            clinicRequest.clinic = clinicRequest.clinic[0];
          });
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsRequests: clinicRequestList
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

var getClinicsRequestsByClinicId = function getClinicsRequestsByClinicId(request, response) {
  var clinicId, clinicRequestList;
  return regeneratorRuntime.async(function getClinicsRequestsByClinicId$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          clinicId = request.params.clinicId;
          _context7.next = 4;
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
          clinicRequestList = _context7.sent;
          clinicRequestList.forEach(function (clinicRequest) {
            clinicRequest.user = clinicRequest.user[0];
            clinicRequest.clinic = clinicRequest.clinic[0];
          });
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsRequests: clinicRequestList
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

var getStaffsClinicsRequestsByOwnerId = function getStaffsClinicsRequestsByOwnerId(request, response) {
  var userId, status, ownerClinics, clinics, query, clinicRequestList;
  return regeneratorRuntime.async(function getStaffsClinicsRequestsByOwnerId$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          userId = request.params.userId;
          status = request.query.status;
          _context8.next = 5;
          return regeneratorRuntime.awrap(ClinicOwnerModel.find({
            ownerId: userId
          }));

        case 5:
          ownerClinics = _context8.sent;
          clinics = ownerClinics.map(function (clinic) {
            return clinic.clinicId;
          });
          query = {
            clinicId: {
              $in: clinics
            },
            role: 'STAFF'
          };

          if (status) {
            query.status = status;
          }

          _context8.next = 11;
          return regeneratorRuntime.awrap(ClinicRequestModel.aggregate([{
            $match: query
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

        case 11:
          clinicRequestList = _context8.sent;
          clinicRequestList.forEach(function (clinicRequest) {
            clinicRequest.user = clinicRequest.user[0];
            clinicRequest.clinic = clinicRequest.clinic[0];
          });
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsRequests: clinicRequestList
          }));

        case 16:
          _context8.prev = 16;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 20:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

var getDoctorsClinicsRequestsByOwnerId = function getDoctorsClinicsRequestsByOwnerId(request, response) {
  var userId, ownerClinics, clinics, clinicRequestList;
  return regeneratorRuntime.async(function getDoctorsClinicsRequestsByOwnerId$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          userId = request.params.userId;
          _context9.next = 4;
          return regeneratorRuntime.awrap(ClinicOwnerModel.find({
            ownerId: userId
          }));

        case 4:
          ownerClinics = _context9.sent;
          clinics = ownerClinics.map(function (clinic) {
            return clinic.clinicId;
          });
          _context9.next = 8;
          return regeneratorRuntime.awrap(ClinicRequestModel.aggregate([{
            $match: {
              clinicId: {
                $in: clinics
              },
              role: 'DOCTOR'
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

        case 8:
          clinicRequestList = _context9.sent;
          clinicRequestList.forEach(function (clinicRequest) {
            clinicRequest.user = clinicRequest.user[0];
            clinicRequest.clinic = clinicRequest.clinic[0];
          });
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsRequests: clinicRequestList
          }));

        case 13:
          _context9.prev = 13;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 17:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var getOwnersClinicsRequestsByOwnerId = function getOwnersClinicsRequestsByOwnerId(request, response) {
  var userId, ownerClinics, clinics, clinicRequestList;
  return regeneratorRuntime.async(function getOwnersClinicsRequestsByOwnerId$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          userId = request.params.userId;
          _context10.next = 4;
          return regeneratorRuntime.awrap(ClinicOwnerModel.find({
            ownerId: userId
          }));

        case 4:
          ownerClinics = _context10.sent;
          clinics = ownerClinics.map(function (clinic) {
            return clinic.clinicId;
          });
          _context10.next = 8;
          return regeneratorRuntime.awrap(ClinicRequestModel.aggregate([{
            $match: {
              clinicId: {
                $in: clinics
              },
              role: 'OWNER'
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

        case 8:
          clinicRequestList = _context10.sent;
          clinicRequestList.forEach(function (clinicRequest) {
            clinicRequest.user = clinicRequest.user[0];
            clinicRequest.clinic = clinicRequest.clinic[0];
          });
          return _context10.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsRequests: clinicRequestList
          }));

        case 13:
          _context10.prev = 13;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          return _context10.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context10.t0.message
          }));

        case 17:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var getOwnerClinicsRequests = function getOwnerClinicsRequests(request, response) {
  var userId, ownerClinics, clinics, clinicRequestList;
  return regeneratorRuntime.async(function getOwnerClinicsRequests$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          userId = request.params.userId;
          _context11.next = 4;
          return regeneratorRuntime.awrap(ClinicOwnerModel.find({
            ownerId: userId
          }));

        case 4:
          ownerClinics = _context11.sent;
          clinics = ownerClinics.map(function (clinic) {
            return clinic.clinicId;
          });
          _context11.next = 8;
          return regeneratorRuntime.awrap(ClinicRequestModel.aggregate([{
            $match: {
              clinicId: {
                $in: clinics
              }
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

        case 8:
          clinicRequestList = _context11.sent;
          clinicRequestList.forEach(function (clinicRequest) {
            clinicRequest.user = clinicRequest.user[0];
            clinicRequest.clinic = clinicRequest.clinic[0];
          });
          return _context11.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsRequests: clinicRequestList
          }));

        case 13:
          _context11.prev = 13;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          return _context11.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context11.t0.message
          }));

        case 17:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var getUserClinicRequestsWithStatus = function getUserClinicRequestsWithStatus(request, response) {
  var _request$params, userId, status, clinicsRequests;

  return regeneratorRuntime.async(function getUserClinicRequestsWithStatus$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _request$params = request.params, userId = _request$params.userId, status = _request$params.status;
          _context12.next = 4;
          return regeneratorRuntime.awrap(ClinicRequestModel.find({
            userId: userId,
            status: status
          }));

        case 4:
          clinicsRequests = _context12.sent;
          return _context12.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsRequests: clinicsRequests
          }));

        case 8:
          _context12.prev = 8;
          _context12.t0 = _context12["catch"](0);
          console.error(_context12.t0);
          return _context12.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context12.t0.message
          }));

        case 12:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var deleteStaffClinicRequest = function deleteStaffClinicRequest(request, response) {
  var clinicRequestId, clinicRequest, userId, deletedClinicRequestPromise, updatedUserPromise, _ref9, _ref10, deletedClinicRequest, updatedUser;

  return regeneratorRuntime.async(function deleteStaffClinicRequest$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          clinicRequestId = request.params.clinicRequestId;
          _context13.next = 4;
          return regeneratorRuntime.awrap(ClinicRequestModel.findById(clinicRequestId));

        case 4:
          clinicRequest = _context13.sent;

          if (!(clinicRequest.role != 'STAFF')) {
            _context13.next = 7;
            break;
          }

          return _context13.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid request role',
            field: 'clinicRequestId'
          }));

        case 7:
          userId = clinicRequest.userId;
          deletedClinicRequestPromise = ClinicRequestModel.findByIdAndDelete(clinicRequestId);
          updatedUserPromise = UserModel.findByIdAndUpdate(userId, {
            clinicId: null
          }, {
            "new": true
          });
          _context13.next = 12;
          return regeneratorRuntime.awrap(Promise.all([deletedClinicRequestPromise, updatedUserPromise]));

        case 12:
          _ref9 = _context13.sent;
          _ref10 = _slicedToArray(_ref9, 2);
          deletedClinicRequest = _ref10[0];
          updatedUser = _ref10[1];
          return _context13.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Deleted staff request successfully!'],
            clinicRequest: deletedClinicRequest,
            user: updatedUser
          }));

        case 19:
          _context13.prev = 19;
          _context13.t0 = _context13["catch"](0);
          console.error(_context13.t0);
          return _context13.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context13.t0.message
          }));

        case 23:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var deleteDoctorClinicRequest = function deleteDoctorClinicRequest(request, response) {
  var clinicRequestId, clinicRequest, userId, clinicId, deletedClinicRequestPromise, deletedClinicDoctorPromise, _ref11, _ref12, deletedClinicRequest, deletedClinicDoctor;

  return regeneratorRuntime.async(function deleteDoctorClinicRequest$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          clinicRequestId = request.params.clinicRequestId;
          _context14.next = 4;
          return regeneratorRuntime.awrap(ClinicRequestModel.findById(clinicRequestId));

        case 4:
          clinicRequest = _context14.sent;

          if (!(clinicRequest.role != 'DOCTOR')) {
            _context14.next = 7;
            break;
          }

          return _context14.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid request role',
            field: 'clinicRequestId'
          }));

        case 7:
          userId = clinicRequest.userId, clinicId = clinicRequest.clinicId;
          deletedClinicRequestPromise = ClinicRequestModel.findByIdAndDelete(clinicRequestId);
          deletedClinicDoctorPromise = ClinicDoctorModel.deleteOne({
            clinicId: clinicId,
            doctorId: userId
          });
          _context14.next = 12;
          return regeneratorRuntime.awrap(Promise.all([deletedClinicRequestPromise, deletedClinicDoctorPromise]));

        case 12:
          _ref11 = _context14.sent;
          _ref12 = _slicedToArray(_ref11, 2);
          deletedClinicRequest = _ref12[0];
          deletedClinicDoctor = _ref12[1];
          return _context14.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Deleted doctor request successfully!'],
            clinicRequest: deletedClinicRequest,
            clinicDoctor: deletedClinicDoctor
          }));

        case 19:
          _context14.prev = 19;
          _context14.t0 = _context14["catch"](0);
          console.error(_context14.t0);
          return _context14.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context14.t0.message
          }));

        case 23:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var deleteOwnerClinicRequest = function deleteOwnerClinicRequest(request, response) {
  var clinicRequestId, clinicRequest, userId, clinicId, deletedClinicRequestPromise, deletedClinicOwnerPromise, _ref13, _ref14, deletedClinicRequest, deletedClinicOwner;

  return regeneratorRuntime.async(function deleteOwnerClinicRequest$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          clinicRequestId = request.params.clinicRequestId;
          _context15.next = 4;
          return regeneratorRuntime.awrap(ClinicRequestModel.findById(clinicRequestId));

        case 4:
          clinicRequest = _context15.sent;

          if (!(clinicRequest.role != 'OWNER')) {
            _context15.next = 7;
            break;
          }

          return _context15.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid request role',
            field: 'clinicRequestId'
          }));

        case 7:
          userId = clinicRequest.userId, clinicId = clinicRequest.clinicId;
          deletedClinicRequestPromise = ClinicRequestModel.findByIdAndDelete(clinicRequestId);
          deletedClinicOwnerPromise = ClinicOwnerModel.deleteOne({
            clinicId: clinicId,
            ownerId: userId
          });
          _context15.next = 12;
          return regeneratorRuntime.awrap(Promise.all([deletedClinicRequestPromise, deletedClinicOwnerPromise]));

        case 12:
          _ref13 = _context15.sent;
          _ref14 = _slicedToArray(_ref13, 2);
          deletedClinicRequest = _ref14[0];
          deletedClinicOwner = _ref14[1];
          return _context15.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Deleted owner request successfully!'],
            clinicRequest: deletedClinicRequest,
            clinicOwner: deletedClinicOwner
          }));

        case 19:
          _context15.prev = 19;
          _context15.t0 = _context15["catch"](0);
          console.error(_context15.t0);
          return _context15.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context15.t0.message
          }));

        case 23:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var updateDoctorClinicRequestStatus = function updateDoctorClinicRequestStatus(request, response) {
  var clinicRequestId, status, clinicRequest, clinicId, userId, clinicDoctorList, updateClinicRequestPromise, clinicDoctorData, clinicDoctorObj, newClinicDoctorPromise, _ref15, _ref16, updateClinicRequest, newClinicDoctor, _clinicId, _userId, _updateClinicRequestPromise, deleteClinicDoctorPromise, _ref17, _ref18, _updateClinicRequest, deleteClinicDoctor;

  return regeneratorRuntime.async(function updateDoctorClinicRequestStatus$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          clinicRequestId = request.params.clinicRequestId;
          status = request.body.status;

          if (status) {
            _context16.next = 5;
            break;
          }

          return _context16.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'status is required',
            field: 'status'
          }));

        case 5:
          if (['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
            _context16.next = 7;
            break;
          }

          return _context16.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid clinic request status',
            field: 'status'
          }));

        case 7:
          _context16.next = 9;
          return regeneratorRuntime.awrap(ClinicRequestModel.findById(clinicRequestId));

        case 9:
          clinicRequest = _context16.sent;

          if (!(clinicRequest.status == status)) {
            _context16.next = 12;
            break;
          }

          return _context16.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Clinic request has already this status'],
            field: 'status'
          }));

        case 12:
          if (!(clinicRequest.role != 'DOCTOR')) {
            _context16.next = 14;
            break;
          }

          return _context16.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid request role',
            field: 'clinicRequestId'
          }));

        case 14:
          if (!(status == 'ACCEPTED')) {
            _context16.next = 31;
            break;
          }

          clinicId = clinicRequest.clinicId, userId = clinicRequest.userId;
          _context16.next = 18;
          return regeneratorRuntime.awrap(ClinicDoctorModel.find({
            clinicId: clinicId,
            doctorId: userId
          }));

        case 18:
          clinicDoctorList = _context16.sent;

          if (!(clinicDoctorList.length != 0)) {
            _context16.next = 21;
            break;
          }

          return _context16.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Doctor is already registered with the clinic'],
            field: 'status'
          }));

        case 21:
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
          _context16.next = 27;
          return regeneratorRuntime.awrap(Promise.all([updateClinicRequestPromise, newClinicDoctorPromise]));

        case 27:
          _ref15 = _context16.sent;
          _ref16 = _slicedToArray(_ref15, 2);
          updateClinicRequest = _ref16[0];
          newClinicDoctor = _ref16[1];

        case 31:
          if (!(status == 'PENDING' || status == 'REJECTED')) {
            _context16.next = 41;
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
          _context16.next = 37;
          return regeneratorRuntime.awrap(Promise.all([_updateClinicRequestPromise, deleteClinicDoctorPromise]));

        case 37:
          _ref17 = _context16.sent;
          _ref18 = _slicedToArray(_ref17, 2);
          _updateClinicRequest = _ref18[0];
          deleteClinicDoctor = _ref18[1];

        case 41:
          return _context16.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated clinic request status successfully!']
          }));

        case 44:
          _context16.prev = 44;
          _context16.t0 = _context16["catch"](0);
          console.error(_context16.t0);
          return _context16.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context16.t0.message
          }));

        case 48:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[0, 44]]);
};

var updateOwnerClinicRequestStatus = function updateOwnerClinicRequestStatus(request, response) {
  var clinicRequestId, status, clinicRequest, clinicId, userId, clinicOwnerList, updateClinicRequestPromise, clinicOwnerData, clinicOwnerObj, newClinicOwnerPromise, _ref19, _ref20, updateClinicRequest, newClinicOwner, _clinicId2, _userId2, _updateClinicRequestPromise2, deleteClinicOwnerPromise, _ref21, _ref22, _updateClinicRequest2, deleteClinicOwner;

  return regeneratorRuntime.async(function updateOwnerClinicRequestStatus$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          clinicRequestId = request.params.clinicRequestId;
          status = request.body.status;

          if (status) {
            _context17.next = 5;
            break;
          }

          return _context17.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'status is required',
            field: 'status'
          }));

        case 5:
          if (['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
            _context17.next = 7;
            break;
          }

          return _context17.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid clinic request status',
            field: 'status'
          }));

        case 7:
          _context17.next = 9;
          return regeneratorRuntime.awrap(ClinicRequestModel.findById(clinicRequestId));

        case 9:
          clinicRequest = _context17.sent;

          if (!(clinicRequest.status == status)) {
            _context17.next = 12;
            break;
          }

          return _context17.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Clinic request has already this status'],
            field: 'status'
          }));

        case 12:
          if (!(clinicRequest.role != 'OWNER')) {
            _context17.next = 14;
            break;
          }

          return _context17.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid request role',
            field: 'clinicRequestId'
          }));

        case 14:
          if (!(status == 'ACCEPTED')) {
            _context17.next = 31;
            break;
          }

          clinicId = clinicRequest.clinicId, userId = clinicRequest.userId;
          _context17.next = 18;
          return regeneratorRuntime.awrap(ClinicOwnerModel.find({
            clinicId: clinicId,
            ownerId: userId
          }));

        case 18:
          clinicOwnerList = _context17.sent;

          if (!(clinicOwnerList.length != 0)) {
            _context17.next = 21;
            break;
          }

          return _context17.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Owner is already registered with the clinic'],
            field: 'status'
          }));

        case 21:
          updateClinicRequestPromise = ClinicRequestModel.findByIdAndUpdate(clinicRequestId, {
            status: status
          }, {
            "new": true
          });
          clinicOwnerData = {
            clinicId: clinicId,
            ownerId: userId
          };
          clinicOwnerObj = new ClinicOwnerModel(clinicOwnerData);
          newClinicOwnerPromise = clinicOwnerObj.save();
          _context17.next = 27;
          return regeneratorRuntime.awrap(Promise.all([updateClinicRequestPromise, newClinicOwnerPromise]));

        case 27:
          _ref19 = _context17.sent;
          _ref20 = _slicedToArray(_ref19, 2);
          updateClinicRequest = _ref20[0];
          newClinicOwner = _ref20[1];

        case 31:
          if (!(status == 'PENDING' || status == 'REJECTED')) {
            _context17.next = 41;
            break;
          }

          _clinicId2 = clinicRequest.clinicId, _userId2 = clinicRequest.userId;
          _updateClinicRequestPromise2 = ClinicRequestModel.findByIdAndUpdate(clinicRequestId, {
            status: status
          }, {
            "new": true
          });
          deleteClinicOwnerPromise = ClinicOwnerModel.deleteOne({
            clinicId: _clinicId2,
            ownerId: _userId2
          });
          _context17.next = 37;
          return regeneratorRuntime.awrap(Promise.all([_updateClinicRequestPromise2, deleteClinicOwnerPromise]));

        case 37:
          _ref21 = _context17.sent;
          _ref22 = _slicedToArray(_ref21, 2);
          _updateClinicRequest2 = _ref22[0];
          deleteClinicOwner = _ref22[1];

        case 41:
          return _context17.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated clinic request status successfully!']
          }));

        case 44:
          _context17.prev = 44;
          _context17.t0 = _context17["catch"](0);
          console.error(_context17.t0);
          return _context17.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context17.t0.message
          }));

        case 48:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 44]]);
};

var updateStaffClinicRequestStatus = function updateStaffClinicRequestStatus(request, response) {
  var clinicRequestId, status, clinicRequest, clinicId, userId, user, updatedUserPromise, updateClinicRequestPromise, _ref23, _ref24, updateClinicRequest, updatedUser, _userId3, _updateClinicRequestPromise3, _updatedUserPromise, _ref25, _ref26, _updateClinicRequest3, _updatedUser;

  return regeneratorRuntime.async(function updateStaffClinicRequestStatus$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          clinicRequestId = request.params.clinicRequestId;
          status = request.body.status;

          if (status) {
            _context18.next = 5;
            break;
          }

          return _context18.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'status is required',
            field: 'status'
          }));

        case 5:
          if (['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
            _context18.next = 7;
            break;
          }

          return _context18.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid clinic request status',
            field: 'status'
          }));

        case 7:
          _context18.next = 9;
          return regeneratorRuntime.awrap(ClinicRequestModel.findById(clinicRequestId));

        case 9:
          clinicRequest = _context18.sent;

          if (!(clinicRequest.status == status)) {
            _context18.next = 12;
            break;
          }

          return _context18.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Clinic request has already this status'],
            field: 'status'
          }));

        case 12:
          if (!(clinicRequest.role != 'STAFF')) {
            _context18.next = 14;
            break;
          }

          return _context18.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid request role',
            field: 'clinicRequestId'
          }));

        case 14:
          if (!(status == 'ACCEPTED')) {
            _context18.next = 29;
            break;
          }

          clinicId = clinicRequest.clinicId, userId = clinicRequest.userId;
          _context18.next = 18;
          return regeneratorRuntime.awrap(UserModel.findById(userId));

        case 18:
          user = _context18.sent;

          if (!user.clinicId) {
            _context18.next = 21;
            break;
          }

          return _context18.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Staff is already registered with a clinic'],
            field: 'userId'
          }));

        case 21:
          updatedUserPromise = UserModel.findByIdAndUpdate(userId, {
            clinicId: clinicId
          }, {
            "new": true
          });
          updateClinicRequestPromise = ClinicRequestModel.findByIdAndUpdate(clinicRequestId, {
            status: status
          }, {
            "new": true
          });
          _context18.next = 25;
          return regeneratorRuntime.awrap(Promise.all([updateClinicRequestPromise, updatedUserPromise]));

        case 25:
          _ref23 = _context18.sent;
          _ref24 = _slicedToArray(_ref23, 2);
          updateClinicRequest = _ref24[0];
          updatedUser = _ref24[1];

        case 29:
          if (!(status == 'PENDING' || status == 'REJECTED')) {
            _context18.next = 39;
            break;
          }

          _userId3 = clinicRequest.userId;
          _updateClinicRequestPromise3 = ClinicRequestModel.findByIdAndUpdate(clinicRequestId, {
            status: status
          }, {
            "new": true
          });
          _updatedUserPromise = UserModel.findByIdAndUpdate(_userId3, {
            clinicId: null
          }, {
            "new": true
          });
          _context18.next = 35;
          return regeneratorRuntime.awrap(Promise.all([_updateClinicRequestPromise3, _updatedUserPromise]));

        case 35:
          _ref25 = _context18.sent;
          _ref26 = _slicedToArray(_ref25, 2);
          _updateClinicRequest3 = _ref26[0];
          _updatedUser = _ref26[1];

        case 39:
          return _context18.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated clinic request status successfully!']
          }));

        case 42:
          _context18.prev = 42;
          _context18.t0 = _context18["catch"](0);
          console.error(_context18.t0);
          return _context18.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context18.t0.message
          }));

        case 46:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[0, 42]]);
};

module.exports = {
  addClinicRequest: addClinicRequest,
  addDoctorClinicRequestByReceiverEmail: addDoctorClinicRequestByReceiverEmail,
  addOwnerClinicRequestByReceiverEmail: addOwnerClinicRequestByReceiverEmail,
  getClinicsRequests: getClinicsRequests,
  getClinicsRequestsByUserId: getClinicsRequestsByUserId,
  getClinicsRequestsByClinicId: getClinicsRequestsByClinicId,
  getOwnerClinicsRequests: getOwnerClinicsRequests,
  deleteStaffClinicRequest: deleteStaffClinicRequest,
  deleteDoctorClinicRequest: deleteDoctorClinicRequest,
  deleteOwnerClinicRequest: deleteOwnerClinicRequest,
  updateDoctorClinicRequestStatus: updateDoctorClinicRequestStatus,
  updateStaffClinicRequestStatus: updateStaffClinicRequestStatus,
  updateOwnerClinicRequestStatus: updateOwnerClinicRequestStatus,
  addStaffClinicRequestByClinicId: addStaffClinicRequestByClinicId,
  getStaffsClinicsRequestsByOwnerId: getStaffsClinicsRequestsByOwnerId,
  getDoctorsClinicsRequestsByOwnerId: getDoctorsClinicsRequestsByOwnerId,
  getOwnersClinicsRequestsByOwnerId: getOwnersClinicsRequestsByOwnerId,
  getUserClinicRequestsWithStatus: getUserClinicRequestsWithStatus
};