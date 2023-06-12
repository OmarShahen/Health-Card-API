"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ClinicDoctorModel = require('../models/ClinicDoctorModel');

var UserModel = require('../models/UserModel');

var ClinicModel = require('../models/ClinicModel');

var clinicDoctorValidation = require('../validations/clinics-doctors');

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

var addClinicDoctor = function addClinicDoctor(request, response) {
  var dataValidation, _request$body, doctorId, clinicId, doctorPromise, clinicPromise, _ref, _ref2, doctor, clinic, registeredClinicDoctorList, clinicDoctorData, clinicDoctorObj, newClinicDoctor;

  return regeneratorRuntime.async(function addClinicDoctor$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = clinicDoctorValidation.addClinicDoctor(request.body);

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
          _request$body = request.body, doctorId = _request$body.doctorId, clinicId = _request$body.clinicId;
          doctorPromise = UserModel.findById(doctorId);
          clinicPromise = ClinicModel.findById(clinicId);
          _context2.next = 9;
          return regeneratorRuntime.awrap(Promise.all([doctorPromise, clinicPromise]));

        case 9:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 2);
          doctor = _ref2[0];
          clinic = _ref2[1];

          if (doctor) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'doctor Id does not exists',
            field: 'doctorId'
          }));

        case 15:
          if (clinic) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id does not exists',
            field: 'clinicId'
          }));

        case 17:
          _context2.next = 19;
          return regeneratorRuntime.awrap(ClinicDoctorModel.find({
            doctorId: doctorId,
            clinicId: clinicId
          }));

        case 19:
          registeredClinicDoctorList = _context2.sent;

          if (!(registeredClinicDoctorList.length != 0)) {
            _context2.next = 22;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'doctor already registered with clinic',
            field: 'clinicId'
          }));

        case 22:
          clinicDoctorData = {
            doctorId: doctorId,
            clinicId: clinicId
          };
          clinicDoctorObj = new ClinicDoctorModel(clinicDoctorData);
          _context2.next = 26;
          return regeneratorRuntime.awrap(clinicDoctorObj.save());

        case 26:
          newClinicDoctor = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'registered doctor to clinic successfully!',
            clinicDoctor: newClinicDoctor
          }));

        case 30:
          _context2.prev = 30;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 34:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 30]]);
};

var deleteClinicDoctor = function deleteClinicDoctor(request, response) {
  var clinicDoctorId, deletedClinicDoctor;
  return regeneratorRuntime.async(function deleteClinicDoctor$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          clinicDoctorId = request.params.clinicDoctorId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(ClinicDoctorModel.findByIdAndDelete(clinicDoctorId));

        case 4:
          deletedClinicDoctor = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'deleted clinic doctor access successfully!',
            clinicDoctor: deletedClinicDoctor
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
  getClinicsDoctors: getClinicsDoctors,
  addClinicDoctor: addClinicDoctor,
  deleteClinicDoctor: deleteClinicDoctor
};