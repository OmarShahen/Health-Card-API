"use strict";

var SpecialityModel = require('../models/SpecialityModel');

var CounterModel = require('../models/CounterModel');

var specialityValidation = require('../validations/specialities');

var getSpecialities = function getSpecialities(request, response) {
  var specialities;
  return regeneratorRuntime.async(function getSpecialities$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(SpecialityModel.find());

        case 3:
          specialities = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            specialities: specialities
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

var addSpeciality = function addSpeciality(request, response) {
  var dataValidation, _request$body, name, description, nameList, counter, specialityData, specialityObj, newSpeciality;

  return regeneratorRuntime.async(function addSpeciality$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = specialityValidation.addSpeciality(request.body);

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
          _request$body = request.body, name = _request$body.name, description = _request$body.description;
          _context2.next = 7;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            name: name
          }));

        case 7:
          nameList = _context2.sent;

          if (!(nameList.length != 0)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'speciality name is already registered',
            field: 'name'
          }));

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'speciality'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 12:
          counter = _context2.sent;
          specialityData = {
            specialityId: counter.value,
            name: name,
            description: description
          };
          specialityObj = new SpecialityModel(specialityData);
          _context2.next = 17;
          return regeneratorRuntime.awrap(specialityObj.save());

        case 17:
          newSpeciality = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'added speciality successfully!',
            speciality: newSpeciality
          }));

        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var deleteSpeciality = function deleteSpeciality(request, response) {
  var specialityId, deletedSpeciality;
  return regeneratorRuntime.async(function deleteSpeciality$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          specialityId = request.params.specialityId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(SpecialityModel.findByIdAndDelete(specialityId));

        case 4:
          deletedSpeciality = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'deleted speciality successfully!',
            speciality: deletedSpeciality
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

var deleteSpecialities = function deleteSpecialities(request, response) {
  var deletedSpecialities;
  return regeneratorRuntime.async(function deleteSpecialities$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(SpecialityModel.deleteMany({}));

        case 3:
          deletedSpecialities = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'deleted all records successfully!',
            noOfDeletedRecords: deletedSpecialities.deletedCount
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

var updateSpeciality = function updateSpeciality(request, response) {
  var dataValidation, specialityId, _request$body2, name, description, speciality, nameList, specialityData, updatedspeciality;

  return regeneratorRuntime.async(function updateSpeciality$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          dataValidation = specialityValidation.updateSpeciality(request.body);

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
          specialityId = request.params.specialityId;
          _request$body2 = request.body, name = _request$body2.name, description = _request$body2.description;
          _context5.next = 8;
          return regeneratorRuntime.awrap(SpecialityModel.findById(specialityId));

        case 8:
          speciality = _context5.sent;

          if (!(name != speciality.name)) {
            _context5.next = 15;
            break;
          }

          _context5.next = 12;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            name: name
          }));

        case 12:
          nameList = _context5.sent;

          if (!(nameList.length != 0)) {
            _context5.next = 15;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'speciality name is already registered',
            field: 'name'
          }));

        case 15:
          specialityData = {
            name: name,
            description: description
          };
          _context5.next = 18;
          return regeneratorRuntime.awrap(SpecialityModel.findByIdAndUpdate(specialityId, specialityData, {
            "new": true
          }));

        case 18:
          updatedspeciality = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'updated speciality successfully!',
            speciality: updatedspeciality
          }));

        case 22:
          _context5.prev = 22;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 26:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

module.exports = {
  getSpecialities: getSpecialities,
  addSpeciality: addSpeciality,
  deleteSpeciality: deleteSpeciality,
  deleteSpecialities: deleteSpecialities,
  updateSpeciality: updateSpeciality
};