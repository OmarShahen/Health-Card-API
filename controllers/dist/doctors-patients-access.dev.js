"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var DoctorPatientAccessModel = require('../models/ClinicPatientModel');

var doctorPatientValidation = require('../validations/doctors-patients-access');

var PatientModel = require('../models/PatientModel');

var UserModel = require('../models/UserModel');

var getDoctorsPatientsAccess = function getDoctorsPatientsAccess(request, response) {
  var permissions;
  return regeneratorRuntime.async(function getDoctorsPatientsAccess$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(DoctorPatientAccessModel.find());

        case 3:
          permissions = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            doctorPatientAccess: permissions
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

var addDoctorPatientAccess = function addDoctorPatientAccess(request, response) {
  var dataValidation, _request$body, cardId, doctorId, patientListPromise, doctorPromise, _ref, _ref2, patientList, doctor, patient, registeredAccessList, doctorPatientAccessData, doctorPatientAccessObj, newDoctorPatientAccess;

  return regeneratorRuntime.async(function addDoctorPatientAccess$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = doctorPatientValidation.addDoctorPatientAccess(request.body);

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
          _request$body = request.body, cardId = _request$body.cardId, doctorId = _request$body.doctorId;
          patientListPromise = PatientModel.find({
            cardId: cardId
          });
          doctorPromise = UserModel.findById(doctorId);
          _context2.next = 9;
          return regeneratorRuntime.awrap(Promise.all([patientListPromise, doctorPromise]));

        case 9:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 2);
          patientList = _ref2[0];
          doctor = _ref2[1];

          if (!(patientList.length == 0)) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'patient card Id does not exists',
            field: 'cardId'
          }));

        case 15:
          if (doctor) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'doctor Id does not exists',
            field: 'doctorId'
          }));

        case 17:
          patient = patientList[0];
          _context2.next = 20;
          return regeneratorRuntime.awrap(DoctorPatientAccessModel.find({
            patientId: patient._id,
            doctorId: doctorId
          }));

        case 20:
          registeredAccessList = _context2.sent;

          if (!(registeredAccessList.length != 0)) {
            _context2.next = 23;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'doctor already has access to the patient',
            field: 'doctorId'
          }));

        case 23:
          doctorPatientAccessData = {
            patientId: patient._id,
            doctorId: doctorId
          };
          doctorPatientAccessObj = new DoctorPatientAccessModel(doctorPatientAccessData);
          _context2.next = 27;
          return regeneratorRuntime.awrap(doctorPatientAccessObj.save());

        case 27:
          newDoctorPatientAccess = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'registered doctor access to patient successfully!',
            doctorPatientAccess: newDoctorPatientAccess
          }));

        case 31:
          _context2.prev = 31;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 35:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 31]]);
};

var deleteDoctorPatientAccess = function deleteDoctorPatientAccess(request, response) {
  var doctorPatientAccessId, deletedDoctorPatientAccess;
  return regeneratorRuntime.async(function deleteDoctorPatientAccess$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          doctorPatientAccessId = request.params.doctorPatientAccessId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(DoctorPatientAccessModel.findByIdAndDelete(doctorPatientAccessId));

        case 4:
          deletedDoctorPatientAccess = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'deleted doctor patient access successfully!',
            doctorPatientAccess: deletedDoctorPatientAccess
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
  getDoctorsPatientsAccess: getDoctorsPatientsAccess,
  addDoctorPatientAccess: addDoctorPatientAccess,
  deleteDoctorPatientAccess: deleteDoctorPatientAccess
};