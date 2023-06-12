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

var addClinic = function addClinic(request, response) {
  var dataValidation, _request$body, ownerId, name, countryCode, phone, speciality, city, country, address, owner, phoneList, specialitiesList, counter, clinicData, clinicObj, newClinic, clinicOwnerData, clinicOwnercObj, newClinicOwner;

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
          _request$body = request.body, ownerId = _request$body.ownerId, name = _request$body.name, countryCode = _request$body.countryCode, phone = _request$body.phone, speciality = _request$body.speciality, city = _request$body.city, country = _request$body.country, address = _request$body.address;
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
          return regeneratorRuntime.awrap(ClinicModel.find({
            countryCode: countryCode,
            phone: phone
          }));

        case 12:
          phoneList = _context.sent;

          if (!(phoneList.length != 0)) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Phone is already registered',
            field: 'phone'
          }));

        case 15:
          _context.next = 17;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: speciality
            }
          }));

        case 17:
          specialitiesList = _context.sent;

          if (!(specialitiesList.length != speciality.length)) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'not registered specialities',
            field: 'speciality'
          }));

        case 20:
          _context.next = 22;
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

        case 22:
          counter = _context.sent;
          clinicData = {
            clinicId: counter.value,
            ownerId: ownerId,
            speciality: speciality,
            name: name,
            countryCode: countryCode,
            phone: phone,
            city: city,
            country: country,
            address: address
          };
          clinicObj = new ClinicModel(clinicData);
          _context.next = 27;
          return regeneratorRuntime.awrap(clinicObj.save());

        case 27:
          newClinic = _context.sent;
          clinicOwnerData = {
            ownerId: ownerId,
            clinicId: newClinic._id
          };
          clinicOwnercObj = new ClinicOwnerModel(clinicOwnerData);
          _context.next = 32;
          return regeneratorRuntime.awrap(clinicOwnercObj.save());

        case 32:
          newClinicOwner = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added clinic successfully!',
            clinic: newClinic,
            clinicOwner: newClinicOwner
          }));

        case 36:
          _context.prev = 36;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 40:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 36]]);
};

var getClinics = function getClinics(request, response) {
  var clinics;
  return regeneratorRuntime.async(function getClinics$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(ClinicModel.aggregate([{
            $lookup: {
              from: 'specialities',
              localField: 'speciality',
              foreignField: '_id',
              as: 'specialitiesTest'
            }
          }]));

        case 3:
          clinics = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            clinics: clinics
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

var getClinicsByDoctorId = function getClinicsByDoctorId(request, response) {
  var doctorId, clinics;
  return regeneratorRuntime.async(function getClinicsByDoctorId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          doctorId = request.params.doctorId;
          _context3.next = 4;
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
          clinics = _context3.sent;
          clinics.forEach(function (clinic) {
            clinic.clinic = clinic.clinic[0];
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
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

var getClinicsByPatientId = function getClinicsByPatientId(request, response) {
  var patientId, clinics;
  return regeneratorRuntime.async(function getClinicsByPatientId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          patientId = request.params.patientId;
          _context4.next = 4;
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
          clinics = _context4.sent;
          clinics.forEach(function (clinic) {
            clinic.clinic = clinic.clinic[0];
          });
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            clinics: clinics
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

module.exports = {
  addClinic: addClinic,
  getClinics: getClinics,
  getClinicsByDoctorId: getClinicsByDoctorId,
  getClinicsByPatientId: getClinicsByPatientId
};