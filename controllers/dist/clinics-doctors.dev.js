"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ClinicDoctorModel = require('../models/ClinicDoctorModel');

var ClinicOwnerModel = require('../models/ClinicOwnerModel');

var ClinicRequestModel = require('../models/ClinicRequestModel');

var UserModel = require('../models/UserModel');

var ClinicModel = require('../models/ClinicModel');

var clinicDoctorValidation = require('../validations/clinics-doctors');

var mongoose = require('mongoose');

var translations = require('../i18n/index');

var getClinicsDoctors = function getClinicsDoctors(request, response) {
  var clinicsDoctors;
  return regeneratorRuntime.async(function getClinicsDoctors$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(ClinicDoctorModel.find());

        case 3:
          clinicsDoctors = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsDoctors: clinicsDoctors
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

var getClinicsDoctorsByOwnerId = function getClinicsDoctorsByOwnerId(request, response) {
  var userId, ownerClinics, clinics, clinicsDoctors;
  return regeneratorRuntime.async(function getClinicsDoctorsByOwnerId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = request.params.userId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(ClinicOwnerModel.find({
            ownerId: userId
          }));

        case 4:
          ownerClinics = _context2.sent;
          clinics = ownerClinics.map(function (clinic) {
            return clinic.clinicId;
          });
          _context2.next = 8;
          return regeneratorRuntime.awrap(ClinicDoctorModel.aggregate([{
            $match: {
              clinicId: {
                $in: clinics
              }
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctor'
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'doctor.speciality',
              foreignField: '_id',
              as: 'specialities'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'doctor.password': 0
            }
          }]));

        case 8:
          clinicsDoctors = _context2.sent;
          clinicsDoctors.forEach(function (clinicDoctor) {
            clinicDoctor.clinic = clinicDoctor.clinic[0];
            clinicDoctor.doctor = clinicDoctor.doctor[0];
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsDoctors: clinicsDoctors
          }));

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var getClinicsDoctorsByDoctorId = function getClinicsDoctorsByDoctorId(request, response) {
  var userId, clinicsDoctors;
  return regeneratorRuntime.async(function getClinicsDoctorsByDoctorId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = request.params.userId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(ClinicDoctorModel.aggregate([{
            $match: {
              doctorId: mongoose.Types.ObjectId(userId)
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctor'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'doctor.password': 0
            }
          }]));

        case 4:
          clinicsDoctors = _context3.sent;
          clinicsDoctors.forEach(function (clinicDoctor) {
            clinicDoctor.clinic = clinicDoctor.clinic[0];
            clinicDoctor.doctor = clinicDoctor.doctor[0];
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsDoctors: clinicsDoctors
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

var getClinicsDoctorsByClinicId = function getClinicsDoctorsByClinicId(request, response) {
  var clinicId, clinicsDoctors;
  return regeneratorRuntime.async(function getClinicsDoctorsByClinicId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          clinicId = request.params.clinicId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(ClinicDoctorModel.aggregate([{
            $match: {
              clinicId: mongoose.Types.ObjectId(clinicId)
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctor'
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'doctor.speciality',
              foreignField: '_id',
              as: 'specialities'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'doctor.password': 0
            }
          }]));

        case 4:
          clinicsDoctors = _context4.sent;
          clinicsDoctors.forEach(function (clinicDoctor) {
            clinicDoctor.clinic = clinicDoctor.clinic[0];
            clinicDoctor.doctor = clinicDoctor.doctor[0];
          });
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsDoctors: clinicsDoctors
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

var addClinicDoctor = function addClinicDoctor(request, response) {
  var dataValidation, lang, _request$body, doctorId, clinicId, doctorPromise, clinicPromise, _ref, _ref2, doctor, clinic, registeredClinicDoctorList, clinicDoctorData, clinicDoctorObj, newClinicDoctor;

  return regeneratorRuntime.async(function addClinicDoctor$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          dataValidation = clinicDoctorValidation.addClinicDoctor(request.body);

          if (dataValidation.isAccepted) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          lang = request.query.lang;
          _request$body = request.body, doctorId = _request$body.doctorId, clinicId = _request$body.clinicId;
          doctorPromise = UserModel.findById(doctorId);
          clinicPromise = ClinicModel.findById(clinicId);
          _context5.next = 10;
          return regeneratorRuntime.awrap(Promise.all([doctorPromise, clinicPromise]));

        case 10:
          _ref = _context5.sent;
          _ref2 = _slicedToArray(_ref, 2);
          doctor = _ref2[0];
          clinic = _ref2[1];

          if (doctor) {
            _context5.next = 16;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'doctor Id does not exists',
            field: 'doctorId'
          }));

        case 16:
          if (clinic) {
            _context5.next = 18;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id does not exists',
            field: 'clinicId'
          }));

        case 18:
          _context5.next = 20;
          return regeneratorRuntime.awrap(ClinicDoctorModel.find({
            doctorId: doctorId,
            clinicId: clinicId
          }));

        case 20:
          registeredClinicDoctorList = _context5.sent;

          if (!(registeredClinicDoctorList.length != 0)) {
            _context5.next = 23;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[lang]['Doctor is already registered with a clinic'],
            field: 'clinicId'
          }));

        case 23:
          clinicDoctorData = {
            doctorId: doctorId,
            clinicId: clinicId
          };
          clinicDoctorObj = new ClinicDoctorModel(clinicDoctorData);
          _context5.next = 27;
          return regeneratorRuntime.awrap(clinicDoctorObj.save());

        case 27:
          newClinicDoctor = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[lang]['Registered doctor to clinic successfully!'],
            clinicDoctor: newClinicDoctor
          }));

        case 31:
          _context5.prev = 31;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 35:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 31]]);
};

var deleteClinicDoctor = function deleteClinicDoctor(request, response) {
  var lang, clinicDoctorId, deletedClinicDoctor, clinicId, doctorId, deletedClinicRequest;
  return regeneratorRuntime.async(function deleteClinicDoctor$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          lang = request.query.lang;
          clinicDoctorId = request.params.clinicDoctorId;
          _context6.next = 5;
          return regeneratorRuntime.awrap(ClinicDoctorModel.findByIdAndDelete(clinicDoctorId));

        case 5:
          deletedClinicDoctor = _context6.sent;
          clinicId = deletedClinicDoctor.clinicId, doctorId = deletedClinicDoctor.doctorId;
          _context6.next = 9;
          return regeneratorRuntime.awrap(ClinicRequestModel.deleteOne({
            clinicId: clinicId,
            userId: doctorId
          }));

        case 9:
          deletedClinicRequest = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[lang]['Deleted clinic doctor access successfully!'],
            clinicDoctor: deletedClinicDoctor,
            clinicRequest: deletedClinicRequest
          }));

        case 13:
          _context6.prev = 13;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 17:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

module.exports = {
  getClinicsDoctors: getClinicsDoctors,
  getClinicsDoctorsByOwnerId: getClinicsDoctorsByOwnerId,
  getClinicsDoctorsByClinicId: getClinicsDoctorsByClinicId,
  getClinicsDoctorsByDoctorId: getClinicsDoctorsByDoctorId,
  addClinicDoctor: addClinicDoctor,
  deleteClinicDoctor: deleteClinicDoctor
};