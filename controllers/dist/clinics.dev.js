"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ClinicModel = require('../models/ClinicModel');

var ClinicOwnerModel = require('../models/ClinicOwnerModel');

var UserModel = require('../models/UserModel');

var SpecialityModel = require('../models/SpecialityModel');

var CounterModel = require('../models/CounterModel');

var clinicValidation = require('../validations/clinics');

var mongoose = require('mongoose');

var ClinicDoctorModel = require('../models/ClinicDoctorModel');

var ClinicPatientModel = require('../models/ClinicPatientModel');

var ClinicPatientDoctorModel = require('../models/ClinicPatientDoctorModel');

var ClinicSubscriptionModel = require('../models/followup-service/ClinicSubscriptionModel');

var PatientModel = require('../models/PatientModel');

var translations = require('../i18n/index');

var isClinicsInTestMode = function isClinicsInTestMode(clinics) {
  for (var i = 0; i < clinics.length; i++) {
    if (clinics[i].clinic.mode == 'TEST') {
      return true;
    }
  }

  return false;
};

var addClinic = function addClinic(request, response) {
  var dataValidation, _request$body, ownerId, speciality, subSpeciality, owner, specialitiesList, subSpecialitiesList, counter, clinicData, clinicObj, newClinic, clinicOwnerData, clinicOwnerObj, newClinicOwner, clinicDoctorData, clinicDoctorcObj, newClinicDoctor;

  return regeneratorRuntime.async(function addClinic$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          dataValidation = clinicValidation.addClinic(request.body);

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
          _request$body = request.body, ownerId = _request$body.ownerId, speciality = _request$body.speciality, subSpeciality = _request$body.subSpeciality;
          _context.next = 7;
          return regeneratorRuntime.awrap(UserModel.findById(ownerId));

        case 7:
          owner = _context.sent;

          if (owner) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Owner Id does not exist',
            field: 'ownerId'
          }));

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: speciality
            },
            type: 'MAIN'
          }));

        case 12:
          specialitiesList = _context.sent;

          if (!(specialitiesList.length != speciality.length)) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid specialities Ids',
            field: 'speciality'
          }));

        case 15:
          request.body.speciality = specialitiesList.map(function (special) {
            return special._id;
          });
          _context.next = 18;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: subSpeciality
            },
            type: 'SUB'
          }));

        case 18:
          subSpecialitiesList = _context.sent;

          if (!(subSpecialitiesList.length != subSpeciality.length)) {
            _context.next = 21;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid sub specialities Ids',
            field: 'subSpeciality'
          }));

        case 21:
          request.body.subSpeciality = subSpecialitiesList.map(function (special) {
            return special._id;
          });
          _context.next = 24;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'clinic'
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
          clinicData = _objectSpread({
            clinicId: counter.value
          }, request.body);
          clinicObj = new ClinicModel(clinicData);
          _context.next = 29;
          return regeneratorRuntime.awrap(clinicObj.save());

        case 29:
          newClinic = _context.sent;
          clinicOwnerData = {
            ownerId: ownerId,
            clinicId: newClinic._id,
            isCreator: true
          };
          clinicOwnerObj = new ClinicOwnerModel(clinicOwnerData);
          _context.next = 34;
          return regeneratorRuntime.awrap(clinicOwnerObj.save());

        case 34:
          newClinicOwner = _context.sent;
          clinicDoctorData = {
            doctorId: ownerId,
            clinicId: newClinic._id
          };
          clinicDoctorcObj = new ClinicDoctorModel(clinicDoctorData);
          _context.next = 39;
          return regeneratorRuntime.awrap(clinicDoctorcObj.save());

        case 39:
          newClinicDoctor = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added clinic successfully!'],
            clinic: newClinic,
            clinicDoctor: newClinicDoctor,
            clinicOwner: newClinicOwner
          }));

        case 43:
          _context.prev = 43;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 47:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 43]]);
};

var updateClinic = function updateClinic(request, response) {
  var dataValidation, clinicId, _request$body2, speciality, subSpeciality, specialitiesList, subSpecialitiesList, clinicData, updatedClinic;

  return regeneratorRuntime.async(function updateClinic$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = clinicValidation.updateClinic(request.body);

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
          clinicId = request.params.clinicId;
          _request$body2 = request.body, speciality = _request$body2.speciality, subSpeciality = _request$body2.subSpeciality;
          _context2.next = 8;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: speciality
            }
          }));

        case 8:
          specialitiesList = _context2.sent;

          if (!(specialitiesList.length != speciality.length)) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'not registered specialities',
            field: 'speciality'
          }));

        case 11:
          _context2.next = 13;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: subSpeciality
            },
            type: 'SUB'
          }));

        case 13:
          subSpecialitiesList = _context2.sent;

          if (!(subSpecialitiesList.length != subSpeciality.length)) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid sub specialities Ids',
            field: 'subSpeciality'
          }));

        case 16:
          request.body.speciality = specialitiesList.map(function (special) {
            return special._id;
          });
          request.body.subSpeciality = subSpecialitiesList.map(function (special) {
            return special._id;
          });
          clinicData = _objectSpread({}, request.body);
          _context2.next = 21;
          return regeneratorRuntime.awrap(ClinicModel.findByIdAndUpdate(clinicId, clinicData, {
            "new": true
          }));

        case 21:
          updatedClinic = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated clinic successfully!'],
            clinic: updatedClinic
          }));

        case 25:
          _context2.prev = 25;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 29:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 25]]);
};

var getClinics = function getClinics(request, response) {
  var clinics;
  return regeneratorRuntime.async(function getClinics$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(ClinicModel.aggregate([{
            $lookup: {
              from: 'specialities',
              localField: 'speciality',
              foreignField: '_id',
              as: 'speciality'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 3:
          clinics = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            clinics: clinics
          }));

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getClinicsStaffsByOwnerId = function getClinicsStaffsByOwnerId(request, response) {
  var userId, ownerClinics, clinics, staffs;
  return regeneratorRuntime.async(function getClinicsStaffsByOwnerId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = request.params.userId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(ClinicOwnerModel.find({
            ownerId: userId
          }));

        case 4:
          ownerClinics = _context4.sent;
          clinics = ownerClinics.map(function (clinic) {
            return clinic.clinicId;
          });
          _context4.next = 8;
          return regeneratorRuntime.awrap(UserModel.aggregate([{
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
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              password: 0,
              speciality: 0
            }
          }]));

        case 8:
          staffs = _context4.sent;
          staffs.forEach(function (staff) {
            return staff.clinic = staff.clinic[0];
          });
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            staffs: staffs
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

var getClinic = function getClinic(request, response) {
  var clinicId, clinic;
  return regeneratorRuntime.async(function getClinic$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          clinicId = request.params.clinicId;
          _context5.next = 4;
          return regeneratorRuntime.awrap(ClinicModel.aggregate([{
            $match: {
              _id: mongoose.Types.ObjectId(clinicId)
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'speciality',
              foreignField: '_id',
              as: 'specialities'
            }
          }]));

        case 4:
          clinic = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            clinic: clinic[0]
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

var getClinicsByDoctorId = function getClinicsByDoctorId(request, response) {
  var doctorId, clinics;
  return regeneratorRuntime.async(function getClinicsByDoctorId$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          doctorId = request.params.doctorId;
          _context6.next = 4;
          return regeneratorRuntime.awrap(ClinicDoctorModel.aggregate([{
            $match: {
              doctorId: mongoose.Types.ObjectId(doctorId)
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
          clinics = _context6.sent;
          clinics.forEach(function (clinic) {
            clinic.clinic = clinic.clinic[0];
          });
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            clinics: clinics
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

var getClinicsByPatientId = function getClinicsByPatientId(request, response) {
  var patientId, clinics;
  return regeneratorRuntime.async(function getClinicsByPatientId$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          patientId = request.params.patientId;
          _context7.next = 4;
          return regeneratorRuntime.awrap(ClinicPatientModel.aggregate([{
            $match: {
              patientId: mongoose.Types.ObjectId(patientId)
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
          clinics = _context7.sent;
          clinics.forEach(function (clinic) {
            clinic.clinic = clinic.clinic[0];
          });
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            clinics: clinics
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

var getFollowupServiceActiveSubscribedClinics = function getFollowupServiceActiveSubscribedClinics(request, response) {
  var subscriptionList, clinicsIds, uniqueClinicIdsSet, uniqueClinicIdsList, clinics;
  return regeneratorRuntime.async(function getFollowupServiceActiveSubscribedClinics$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(ClinicSubscriptionModel.find({
            isActive: true,
            endDate: {
              $gt: Date.now()
            }
          }));

        case 3:
          subscriptionList = _context8.sent;
          clinicsIds = subscriptionList.map(function (subscription) {
            return subscription.clinicId;
          });
          uniqueClinicIdsSet = new Set(clinicsIds);
          uniqueClinicIdsList = _toConsumableArray(uniqueClinicIdsSet);
          _context8.next = 9;
          return regeneratorRuntime.awrap(ClinicModel.find({
            _id: {
              $in: uniqueClinicIdsList
            }
          }));

        case 9:
          clinics = _context8.sent;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            clinics: clinics
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

var getFollowupServiceSubscribedClinics = function getFollowupServiceSubscribedClinics(request, response) {
  var subscriptionList, clinicsIds, uniqueClinicIdsSet, uniqueClinicIdsList, clinics;
  return regeneratorRuntime.async(function getFollowupServiceSubscribedClinics$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(ClinicSubscriptionModel.find());

        case 3:
          subscriptionList = _context9.sent;
          clinicsIds = subscriptionList.map(function (subscription) {
            return subscription.clinicId;
          });
          uniqueClinicIdsSet = new Set(clinicsIds);
          uniqueClinicIdsList = _toConsumableArray(uniqueClinicIdsSet);
          _context9.next = 9;
          return regeneratorRuntime.awrap(ClinicModel.find({
            _id: {
              $in: uniqueClinicIdsList
            }
          }));

        case 9:
          clinics = _context9.sent;
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            clinics: clinics
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

var deleteClinic = function deleteClinic(request, response) {
  var clinicId, deletedClinic;
  return regeneratorRuntime.async(function deleteClinic$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          clinicId = request.params.clinicId;
          _context10.next = 4;
          return regeneratorRuntime.awrap(ClinicModel.findByIdAndDelete(clinicId));

        case 4:
          deletedClinic = _context10.sent;
          return _context10.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted clinic successfully!',
            clinic: deletedClinic
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

module.exports = {
  addClinic: addClinic,
  updateClinic: updateClinic,
  getClinics: getClinics,
  getClinicsByDoctorId: getClinicsByDoctorId,
  getClinicsByPatientId: getClinicsByPatientId,
  getClinic: getClinic,
  getClinicsStaffsByOwnerId: getClinicsStaffsByOwnerId,
  getFollowupServiceActiveSubscribedClinics: getFollowupServiceActiveSubscribedClinics,
  getFollowupServiceSubscribedClinics: getFollowupServiceSubscribedClinics,
  deleteClinic: deleteClinic
};