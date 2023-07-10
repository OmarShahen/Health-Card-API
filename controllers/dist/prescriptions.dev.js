"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mongoose = require('mongoose');

var PrescriptionModel = require('../models/PrescriptionModel');

var PatientModel = require('../models/PatientModel');

var UserModel = require('../models/UserModel');

var ClinicPatientDoctorModel = require('../models/ClinicPatientDoctorModel');

var CounterModel = require('../models/CounterModel');

var prescriptionValidation = require('../validations/prescriptions');

var ClinicModel = require('../models/ClinicModel');

var config = require('../config/config');

var utils = require('../utils/utils');

var formatPrescriptionsDrugs = function formatPrescriptionsDrugs(prescriptions) {
  var drugs = [];

  for (var i = 0; i < prescriptions.length; i++) {
    var prescription = prescriptions[i];

    for (var j = 0; j < prescription.medicines.length; j++) {
      var medicine = prescription.medicines[j];
      drugs.push(_objectSpread({
        _id: prescription._id
      }, medicine));
    }
  }

  return drugs;
};

var addPrescription = function addPrescription(request, response) {
  var dataValidation, _request$body, doctorId, patientId, medicines, doctorPromise, patientPromise, _ref, _ref2, doctor, patient, doctorPatientAccessList, counter, prescriptionData, prescriptionObj, newPrescription;

  return regeneratorRuntime.async(function addPrescription$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          dataValidation = prescriptionValidation.addPrescription(request.body);

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
          _request$body = request.body, doctorId = _request$body.doctorId, patientId = _request$body.patientId, medicines = _request$body.medicines;
          doctorPromise = UserModel.findById(doctorId);
          patientPromise = PatientModel.findById(patientId);
          _context.next = 9;
          return regeneratorRuntime.awrap(Promise.all([doctorPromise, patientPromise]));

        case 9:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 2);
          doctor = _ref2[0];
          patient = _ref2[1];

          if (!(!doctor || doctor.role != 'DOCTOR')) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Doctor Id does not exist',
            field: 'doctorId'
          }));

        case 15:
          if (patient) {
            _context.next = 17;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Patient Id does not exist',
            field: 'patientId'
          }));

        case 17:
          _context.next = 19;
          return regeneratorRuntime.awrap(DoctorPatientAccessModel.find({
            patientId: patientId,
            doctorId: doctorId
          }));

        case 19:
          doctorPatientAccessList = _context.sent;

          if (!(doctorPatientAccessList.length == 0)) {
            _context.next = 22;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'doctor has no access to this patient',
            field: 'patientId'
          }));

        case 22:
          _context.next = 24;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'prescription'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 24:
          counter = _context.sent;
          prescriptionData = {
            prescriptionId: counter.value,
            doctorId: doctorId,
            patientId: patientId,
            medicines: medicines
          };
          prescriptionObj = new PrescriptionModel(prescriptionData);
          _context.next = 29;
          return regeneratorRuntime.awrap(prescriptionObj.save());

        case 29:
          newPrescription = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Prescription is recorded successfully',
            prescription: newPrescription
          }));

        case 33:
          _context.prev = 33;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 37:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 33]]);
};

var addPrescriptionByPatientCardId = function addPrescriptionByPatientCardId(request, response) {
  var dataValidation, cardId, _request$body2, doctorId, clinicId, medicines, registrationDate, notes, patientListPromise, doctorPromise, clinicPromise, _ref3, _ref4, doctor, patientList, clinic, patient, doctorPatientAccessList, counter, prescriptionData, prescriptionObj, newPrescription;

  return regeneratorRuntime.async(function addPrescriptionByPatientCardId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = prescriptionValidation.addPrescriptionByPatientCardId(request.body);

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
          cardId = request.params.cardId;
          _request$body2 = request.body, doctorId = _request$body2.doctorId, clinicId = _request$body2.clinicId, medicines = _request$body2.medicines, registrationDate = _request$body2.registrationDate, notes = _request$body2.notes;
          patientListPromise = PatientModel.find({
            cardId: cardId
          });
          doctorPromise = UserModel.findById(doctorId);
          clinicPromise = ClinicModel.findById(clinicId);
          _context2.next = 11;
          return regeneratorRuntime.awrap(Promise.all([doctorPromise, patientListPromise, clinicPromise]));

        case 11:
          _ref3 = _context2.sent;
          _ref4 = _slicedToArray(_ref3, 3);
          doctor = _ref4[0];
          patientList = _ref4[1];
          clinic = _ref4[2];

          if (!(patientList.length == 0)) {
            _context2.next = 18;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Patient card Id does not exists',
            field: 'cardId'
          }));

        case 18:
          if (!(!doctor || !doctor.roles.includes('DOCTOR'))) {
            _context2.next = 20;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Doctor Id does not exist',
            field: 'doctorId'
          }));

        case 20:
          if (clinic) {
            _context2.next = 22;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 22:
          patient = patientList[0];
          _context2.next = 25;
          return regeneratorRuntime.awrap(ClinicPatientDoctorModel.find({
            doctorId: doctorId,
            patientId: patient._id,
            clinicId: clinic._id
          }));

        case 25:
          doctorPatientAccessList = _context2.sent;

          if (!(doctorPatientAccessList.length == 0)) {
            _context2.next = 28;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'doctor does not have access to the patient',
            field: 'patientId'
          }));

        case 28:
          _context2.next = 30;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: "".concat(clinic._id, "-prescription")
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 30:
          counter = _context2.sent;
          prescriptionData = {
            prescriptionId: counter.value,
            clinicId: clinicId,
            patientId: patient._id,
            doctorId: doctorId,
            medicines: medicines,
            notes: notes,
            createdAt: registrationDate
          };
          prescriptionObj = new PrescriptionModel(prescriptionData);
          _context2.next = 35;
          return regeneratorRuntime.awrap(prescriptionObj.save());

        case 35:
          newPrescription = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Prescription is recorded successfully',
            prescription: newPrescription
          }));

        case 39:
          _context2.prev = 39;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 43:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 39]]);
};

var getDoctorPrescriptions = function getDoctorPrescriptions(request, response) {
  var doctorId, query, _utils$statsQueryGene, searchQuery, prescriptions;

  return regeneratorRuntime.async(function getDoctorPrescriptions$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          doctorId = request.params.doctorId;
          query = request.query.query;
          query = query ? query : '';
          _utils$statsQueryGene = utils.statsQueryGenerator('doctorId', doctorId, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context3.next = 7;
          return regeneratorRuntime.awrap(PrescriptionModel.aggregate([{
            $match: searchQuery
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
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
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $match: {
              $or: [{
                'patient.firstName': {
                  $regex: query,
                  $options: 'i'
                }
              }, {
                'patient.lastName': {
                  $regex: query,
                  $options: 'i'
                }
              }, {
                'patient.phone': {
                  $regex: query,
                  $options: 'i'
                }
              }, {
                'patient.cardId': {
                  $regex: query,
                  $options: 'i'
                }
              }]
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'patient.healthHistory': 0,
              'patient.emergencyContacts': 0,
              'patient.doctors': 0,
              'doctor.password': 0
            }
          }]));

        case 7:
          prescriptions = _context3.sent;
          prescriptions.forEach(function (prescription) {
            prescription.patient = prescription.patient[0];
            prescription.doctor = prescription.doctor[0];
            prescription.clinic = prescription.clinic[0];
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            prescriptions: prescriptions
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

var getClinicPrescriptions = function getClinicPrescriptions(request, response) {
  var clinicId, query, _utils$statsQueryGene2, searchQuery, prescriptions;

  return regeneratorRuntime.async(function getClinicPrescriptions$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          clinicId = request.params.clinicId;
          query = request.query.query;
          query = query ? query : '';
          _utils$statsQueryGene2 = utils.statsQueryGenerator('clinicId', clinicId, request.query), searchQuery = _utils$statsQueryGene2.searchQuery;
          _context4.next = 7;
          return regeneratorRuntime.awrap(PrescriptionModel.aggregate([{
            $match: searchQuery
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
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
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $match: {
              $or: [{
                'patient.firstName': {
                  $regex: query,
                  $options: 'i'
                }
              }, {
                'patient.lastName': {
                  $regex: query,
                  $options: 'i'
                }
              }, {
                'patient.phone': {
                  $regex: query,
                  $options: 'i'
                }
              }, {
                'patient.cardId': {
                  $regex: query,
                  $options: 'i'
                }
              }, {
                'doctor.firstName': {
                  $regex: query,
                  $options: 'i'
                }
              }, {
                'doctor.lastName': {
                  $regex: query,
                  $options: 'i'
                }
              }, {
                'doctor.email': {
                  $regex: query,
                  $options: 'i'
                }
              }]
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'patient.healthHistory': 0,
              'patient.emergencyContacts': 0,
              'patient.doctors': 0,
              'doctor.password': 0
            }
          }]));

        case 7:
          prescriptions = _context4.sent;
          prescriptions.forEach(function (prescription) {
            prescription.patient = prescription.patient[0];
            prescription.doctor = prescription.doctor[0];
            prescription.clinic = prescription.clinic[0];
          });
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            prescriptions: prescriptions
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

var getPatientPrescriptions = function getPatientPrescriptions(request, response) {
  var patientId, query, _utils$statsQueryGene3, searchQuery, prescriptions;

  return regeneratorRuntime.async(function getPatientPrescriptions$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          patientId = request.params.patientId;
          query = request.query.query;
          query = query ? query : '';
          _utils$statsQueryGene3 = utils.statsQueryGenerator('patientId', patientId, request.query), searchQuery = _utils$statsQueryGene3.searchQuery;
          _context5.next = 7;
          return regeneratorRuntime.awrap(PrescriptionModel.aggregate([{
            $match: searchQuery
          }, {
            $lookup: {
              from: 'users',
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctor'
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
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'patient.healthHistory': 0,
              'patient.emergencyContacts': 0,
              'patient.doctors': 0,
              'doctor.password': 0
            }
          }]));

        case 7:
          prescriptions = _context5.sent;
          prescriptions.forEach(function (prescription) {
            prescription.doctor = prescription.doctor[0];
            prescription.patient = prescription.patient[0];
            prescription.clinic = prescription.clinic[0];
          });
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            prescriptions: prescriptions
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

var deletePrescription = function deletePrescription(request, response) {
  var prescriptionId, deletedPrescription;
  return regeneratorRuntime.async(function deletePrescription$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          prescriptionId = request.params.prescriptionId;
          _context6.next = 4;
          return regeneratorRuntime.awrap(PrescriptionModel.findByIdAndDelete(prescriptionId));

        case 4:
          deletedPrescription = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'prescription deleted successfully',
            prescription: deletedPrescription
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

var getPrescription = function getPrescription(request, response) {
  var prescriptionId, prescription;
  return regeneratorRuntime.async(function getPrescription$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          prescriptionId = request.params.prescriptionId;
          _context7.next = 4;
          return regeneratorRuntime.awrap(PrescriptionModel.aggregate([{
            $match: {
              _id: mongoose.Types.ObjectId(prescriptionId)
            }
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctor'
            }
          }, {
            $project: {
              'doctor.password': 0,
              'patient.healthHistory': 0,
              'patient.emergencyContacts': 0,
              'patient.doctors': 0
            }
          }]));

        case 4:
          prescription = _context7.sent;
          prescription.forEach(function (prescription) {
            prescription.patient = prescription.patient[0];
            prescription.doctor = prescription.doctor[0];
          });
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            prescription: prescription[0]
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

var updatePrescription = function updatePrescription(request, response) {
  var prescriptionId, dataValidation, _request$body3, medicines, notes, updateData, updatedPrescription;

  return regeneratorRuntime.async(function updatePrescription$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          prescriptionId = request.params.prescriptionId;
          dataValidation = prescriptionValidation.updatePrescription(request.body);

          if (dataValidation.isAccepted) {
            _context8.next = 5;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          _request$body3 = request.body, medicines = _request$body3.medicines, notes = _request$body3.notes;
          updateData = {
            medicines: medicines,
            notes: notes
          };
          _context8.next = 9;
          return regeneratorRuntime.awrap(PrescriptionModel.findByIdAndUpdate(prescriptionId, updateData, {
            "new": true
          }));

        case 9:
          updatedPrescription = _context8.sent;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'updated prescription successfully!',
            prescription: updatedPrescription
          }));

        case 13:
          _context8.prev = 13;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 17:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var ratePrescription = function ratePrescription(request, response) {
  var prescriptionId, rate, updatedPerscription;
  return regeneratorRuntime.async(function ratePrescription$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          prescriptionId = request.params.prescriptionId;
          rate = request.body.rate;

          if (config.RATES.includes(rate)) {
            _context9.next = 5;
            break;
          }

          return _context9.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid rate value',
            field: 'rate'
          }));

        case 5:
          _context9.next = 7;
          return regeneratorRuntime.awrap(PrescriptionModel.findByIdAndUpdate(prescriptionId, {
            rate: rate
          }, {
            "new": true
          }));

        case 7:
          updatedPerscription = _context9.sent;
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated prescription rate successfully',
            prescription: updatedPerscription
          }));

        case 11:
          _context9.prev = 11;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 15:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var getPatientLastPrescriptionByCardUUID = function getPatientLastPrescriptionByCardUUID(request, response) {
  var cardUUID, patient;
  return regeneratorRuntime.async(function getPatientLastPrescriptionByCardUUID$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          cardUUID = request.params.cardUUID;
          _context10.next = 4;
          return regeneratorRuntime.awrap(PatientModel.find({
            cardUUID: cardUUID
          }));

        case 4:
          patient = _context10.sent;
          return _context10.abrupt("return", response.status(200).json({
            accepted: true,
            patient: patient
          }));

        case 8:
          _context10.prev = 8;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          return _context10.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context10.t0.message
          }));

        case 12:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getPatientDrugs = function getPatientDrugs(request, response) {
  var patientId, query, _utils$statsQueryGene4, searchQuery, prescriptions, drugs;

  return regeneratorRuntime.async(function getPatientDrugs$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          patientId = request.params.patientId;
          query = request.query.query;
          query = query ? query : '';
          _utils$statsQueryGene4 = utils.statsQueryGenerator('patientId', patientId, request.query), searchQuery = _utils$statsQueryGene4.searchQuery;
          _context11.next = 7;
          return regeneratorRuntime.awrap(PrescriptionModel.aggregate([{
            $match: searchQuery
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              medicines: 1
            }
          }]));

        case 7:
          prescriptions = _context11.sent;
          drugs = formatPrescriptionsDrugs(prescriptions);
          return _context11.abrupt("return", response.status(200).json({
            accepted: true,
            drugs: drugs
          }));

        case 12:
          _context11.prev = 12;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          return _context11.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context11.t0.message
          }));

        case 16:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

module.exports = {
  addPrescription: addPrescription,
  addPrescriptionByPatientCardId: addPrescriptionByPatientCardId,
  getDoctorPrescriptions: getDoctorPrescriptions,
  getClinicPrescriptions: getClinicPrescriptions,
  getPatientPrescriptions: getPatientPrescriptions,
  getPrescription: getPrescription,
  ratePrescription: ratePrescription,
  getPatientLastPrescriptionByCardUUID: getPatientLastPrescriptionByCardUUID,
  deletePrescription: deletePrescription,
  getPatientDrugs: getPatientDrugs,
  updatePrescription: updatePrescription
};