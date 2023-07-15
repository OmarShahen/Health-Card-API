"use strict";

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

var PatientModel = require('../models/PatientModel');

var isClinicsInTestMode = function isClinicsInTestMode(clinics) {
  for (var i = 0; i < clinics.length; i++) {
    if (clinics[i].clinic.mode == 'TEST') {
      return true;
    }
  }

  return false;
};

var getTestModePatients = function getTestModePatients(clinicId) {
  var patients, clinicPatients;
  return regeneratorRuntime.async(function getTestModePatients$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(PatientModel.find({
            cardId: {
              $in: [18101851, 18101852, 18101853]
            }
          }));

        case 2:
          patients = _context.sent;
          clinicPatients = patients.map(function (patient) {
            return {
              clinicId: clinicId,
              patientId: patient._id
            };
          });
          return _context.abrupt("return", clinicPatients);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

var addClinic = function addClinic(request, response) {
  var dataValidation, _request$body, ownerId, name, speciality, city, country, owner, specialitiesList, ownerClinics, mode, counter, clinicData, clinicObj, newClinic, clinicOwnerData, clinicOwnerObj, newClinicOwner, newClinicDoctor, clinicDoctorData, clinicDoctorcObj, testPatients;

  return regeneratorRuntime.async(function addClinic$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = clinicValidation.addClinic(request.body);

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
          _request$body = request.body, ownerId = _request$body.ownerId, name = _request$body.name, speciality = _request$body.speciality, city = _request$body.city, country = _request$body.country;
          _context2.next = 7;
          return regeneratorRuntime.awrap(UserModel.findById(ownerId));

        case 7:
          owner = _context2.sent;

          if (owner) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Owner Id does not exist',
            field: 'ownerId'
          }));

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: speciality
            }
          }));

        case 12:
          specialitiesList = _context2.sent;

          if (!(specialitiesList.length != speciality.length)) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'not registered specialities',
            field: 'speciality'
          }));

        case 15:
          _context2.next = 17;
          return regeneratorRuntime.awrap(ClinicOwnerModel.aggregate([{
            $match: {
              ownerId: mongoose.Types.ObjectId(ownerId),
              isCreator: true
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }]));

        case 17:
          ownerClinics = _context2.sent;
          ownerClinics.forEach(function (ownerClinic) {
            return ownerClinic.clinic = ownerClinic.clinic[0];
          });

          if (!isClinicsInTestMode(ownerClinics)) {
            _context2.next = 21;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: "cannot create clinic in test mode",
            field: 'ownerId'
          }));

        case 21:
          mode = 'PRODUCTION';

          if (ownerClinics.length == 0) {
            mode = 'TEST';
          }

          _context2.next = 25;
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

        case 25:
          counter = _context2.sent;
          clinicData = {
            clinicId: counter.value,
            mode: mode,
            ownerId: ownerId,
            speciality: speciality,
            name: name,
            city: city,
            country: country
          };
          clinicObj = new ClinicModel(clinicData);
          _context2.next = 30;
          return regeneratorRuntime.awrap(clinicObj.save());

        case 30:
          newClinic = _context2.sent;
          clinicOwnerData = {
            ownerId: ownerId,
            clinicId: newClinic._id,
            isCreator: true
          };
          clinicOwnerObj = new ClinicOwnerModel(clinicOwnerData);
          _context2.next = 35;
          return regeneratorRuntime.awrap(clinicOwnerObj.save());

        case 35:
          newClinicOwner = _context2.sent;
          newClinicDoctor = {};

          if (!owner.roles.includes('DOCTOR')) {
            _context2.next = 43;
            break;
          }

          clinicDoctorData = {
            doctorId: ownerId,
            clinicId: newClinic._id
          };
          clinicDoctorcObj = new ClinicDoctorModel(clinicDoctorData);
          _context2.next = 42;
          return regeneratorRuntime.awrap(clinicDoctorcObj.save());

        case 42:
          newClinicDoctor = _context2.sent;

        case 43:
          if (!(ownerClinics.length == 0 || !owner.roles.includes('OWNER'))) {
            _context2.next = 46;
            break;
          }

          _context2.next = 46;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(ownerId, {
            $push: {
              roles: 'OWNER'
            }
          }, {
            "new": true
          }));

        case 46:
          if (!(mode == 'TEST')) {
            _context2.next = 57;
            break;
          }

          _context2.next = 49;
          return regeneratorRuntime.awrap(getTestModePatients(newClinic._id));

        case 49:
          testPatients = _context2.sent;
          _context2.next = 52;
          return regeneratorRuntime.awrap(ClinicPatientModel.insertMany(testPatients));

        case 52:
          if (!owner.roles.includes('DOCTOR')) {
            _context2.next = 57;
            break;
          }

          console.log('here');
          testPatients.forEach(function (patient) {
            return patient.doctorId = owner._id;
          });
          _context2.next = 57;
          return regeneratorRuntime.awrap(ClinicPatientDoctorModel.insertMany(testPatients));

        case 57:
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added clinic successfully!',
            clinic: newClinic,
            clinicDoctor: newClinicDoctor,
            clinicOwner: newClinicOwner
          }));

        case 60:
          _context2.prev = 60;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 64:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 60]]);
};

var updateClinic = function updateClinic(request, response) {
  var dataValidation, clinicId, _request$body2, name, speciality, city, country, specialitiesList, clinicData, updatedClinic;

  return regeneratorRuntime.async(function updateClinic$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = clinicValidation.updateClinic(request.body);

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
          clinicId = request.params.clinicId;
          _request$body2 = request.body, name = _request$body2.name, speciality = _request$body2.speciality, city = _request$body2.city, country = _request$body2.country;
          _context3.next = 8;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: speciality
            }
          }));

        case 8:
          specialitiesList = _context3.sent;

          if (!(specialitiesList.length != speciality.length)) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'not registered specialities',
            field: 'speciality'
          }));

        case 11:
          clinicData = {
            speciality: specialitiesList.map(function (special) {
              return special._id;
            }),
            name: name,
            city: city,
            country: country
          };
          _context3.next = 14;
          return regeneratorRuntime.awrap(ClinicModel.findByIdAndUpdate(clinicId, clinicData, {
            "new": true
          }));

        case 14:
          updatedClinic = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated clinic successfully!',
            clinic: updatedClinic
          }));

        case 18:
          _context3.prev = 18;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 22:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var getClinics = function getClinics(request, response) {
  var clinics;
  return regeneratorRuntime.async(function getClinics$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(ClinicModel.aggregate([{
            $lookup: {
              from: 'specialities',
              localField: 'speciality',
              foreignField: '_id',
              as: 'specialitiesTest'
            }
          }]));

        case 3:
          clinics = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            clinics: clinics
          }));

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getClinicsStaffsByOwnerId = function getClinicsStaffsByOwnerId(request, response) {
  var userId, ownerClinics, clinics, staffs;
  return regeneratorRuntime.async(function getClinicsStaffsByOwnerId$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = request.params.userId;
          _context5.next = 4;
          return regeneratorRuntime.awrap(ClinicOwnerModel.find({
            ownerId: userId
          }));

        case 4:
          ownerClinics = _context5.sent;
          clinics = ownerClinics.map(function (clinic) {
            return clinic.clinicId;
          });
          _context5.next = 8;
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
          staffs = _context5.sent;
          staffs.forEach(function (staff) {
            return staff.clinic = staff.clinic[0];
          });
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            staffs: staffs
          }));

        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 17:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var getClinic = function getClinic(request, response) {
  var clinicId, clinic;
  return regeneratorRuntime.async(function getClinic$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          clinicId = request.params.clinicId;
          _context6.next = 4;
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
          clinic = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            clinic: clinic[0]
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

var getClinicsByDoctorId = function getClinicsByDoctorId(request, response) {
  var doctorId, clinics;
  return regeneratorRuntime.async(function getClinicsByDoctorId$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          doctorId = request.params.doctorId;
          _context7.next = 4;
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

var getClinicsByPatientId = function getClinicsByPatientId(request, response) {
  var patientId, clinics;
  return regeneratorRuntime.async(function getClinicsByPatientId$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          patientId = request.params.patientId;
          _context8.next = 4;
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
          clinics = _context8.sent;
          clinics.forEach(function (clinic) {
            clinic.clinic = clinic.clinic[0];
          });
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            clinics: clinics
          }));

        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

module.exports = {
  addClinic: addClinic,
  updateClinic: updateClinic,
  getClinics: getClinics,
  getClinicsByDoctorId: getClinicsByDoctorId,
  getClinicsByPatientId: getClinicsByPatientId,
  getClinic: getClinic,
  getClinicsStaffsByOwnerId: getClinicsStaffsByOwnerId
};