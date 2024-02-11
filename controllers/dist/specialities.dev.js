"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SpecialityModel = require('../models/SpecialityModel');

var CounterModel = require('../models/CounterModel');

var specialityValidation = require('../validations/specialities');

var UserModel = require('../models/UserModel');

var mongoose = require('mongoose');

var getSpecialities = function getSpecialities(request, response) {
  var show, matchQuery, specialities;
  return regeneratorRuntime.async(function getSpecialities$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          show = request.query.show;
          matchQuery = {
            type: 'MAIN'
          };

          if (show == 'TRUE') {
            matchQuery.isShow = true;
          } else if (show == 'FALSE') {
            matchQuery.isShow = false;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(SpecialityModel.find(matchQuery));

        case 6:
          specialities = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            specialities: specialities
          }));

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var getSpeciality = function getSpeciality(request, response) {
  var specialityId, speciality;
  return regeneratorRuntime.async(function getSpeciality$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          specialityId = request.params.specialityId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(SpecialityModel.findById(specialityId));

        case 4:
          speciality = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            speciality: speciality
          }));

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getSubSpecialitiesOfMainSpeciality = function getSubSpecialitiesOfMainSpeciality(request, response) {
  var specialityId, specialities;
  return regeneratorRuntime.async(function getSubSpecialitiesOfMainSpeciality$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          specialityId = request.params.specialityId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            mainSpecialityId: specialityId,
            type: 'SUB'
          }));

        case 4:
          specialities = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            specialities: specialities
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

var addSpeciality = function addSpeciality(request, response) {
  var dataValidation, _request$body, name, type, mainSpecialityId, nameList, mainSpecialityList, counter, specialityData, specialityObj, newSpeciality;

  return regeneratorRuntime.async(function addSpeciality$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          dataValidation = specialityValidation.addSpeciality(request.body);

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
          _request$body = request.body, name = _request$body.name, type = _request$body.type, mainSpecialityId = _request$body.mainSpecialityId;
          _context4.next = 7;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            name: name
          }));

        case 7:
          nameList = _context4.sent;

          if (!(nameList.length != 0)) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'speciality name is already registered',
            field: 'name'
          }));

        case 10:
          if (!(type == 'SUB')) {
            _context4.next = 16;
            break;
          }

          _context4.next = 13;
          return regeneratorRuntime.awrap(SpecialityModel.findById(mainSpecialityId));

        case 13:
          mainSpecialityList = _context4.sent;

          if (!(mainSpecialityList.length == 0)) {
            _context4.next = 16;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Main speciality ID is not registered',
            field: 'mainSpecialityId'
          }));

        case 16:
          _context4.next = 18;
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

        case 18:
          counter = _context4.sent;
          specialityData = _objectSpread({
            specialityId: counter.value
          }, request.body);
          specialityObj = new SpecialityModel(specialityData);
          _context4.next = 23;
          return regeneratorRuntime.awrap(specialityObj.save());

        case 23:
          newSpeciality = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'added speciality successfully!',
            speciality: newSpeciality
          }));

        case 27:
          _context4.prev = 27;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 31:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

var deleteSpeciality = function deleteSpeciality(request, response) {
  var specialityId, mainUsersList, subUsersList, deletedSpeciality;
  return regeneratorRuntime.async(function deleteSpeciality$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          specialityId = request.params.specialityId;
          _context5.next = 4;
          return regeneratorRuntime.awrap(UserModel.find({
            speciality: {
              $in: [mongoose.Types.ObjectId(specialityId)]
            }
          }));

        case 4:
          mainUsersList = _context5.sent;

          if (!(mainUsersList.length != 0)) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Specialty registered with users',
            field: 'specialityId'
          }));

        case 7:
          _context5.next = 9;
          return regeneratorRuntime.awrap(UserModel.find({
            subSpeciality: {
              $in: [mongoose.Types.ObjectId(specialityId)]
            }
          }));

        case 9:
          subUsersList = _context5.sent;

          if (!(subUsersList.length != 0)) {
            _context5.next = 12;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Subspecialty registered with users',
            field: 'specialityId'
          }));

        case 12:
          _context5.next = 14;
          return regeneratorRuntime.awrap(SpecialityModel.findByIdAndDelete(specialityId));

        case 14:
          deletedSpeciality = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'deleted specialty successfully!',
            speciality: deletedSpeciality
          }));

        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 22:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var deleteSpecialities = function deleteSpecialities(request, response) {
  var deletedSpecialities;
  return regeneratorRuntime.async(function deleteSpecialities$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(SpecialityModel.deleteMany({}));

        case 3:
          deletedSpecialities = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'deleted all records successfully!',
            noOfDeletedRecords: deletedSpecialities.deletedCount
          }));

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var updateSpeciality = function updateSpeciality(request, response) {
  var dataValidation, specialityId, _request$body2, name, description, speciality, nameList, specialityData, updatedspeciality;

  return regeneratorRuntime.async(function updateSpeciality$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          dataValidation = specialityValidation.updateSpeciality(request.body);

          if (dataValidation.isAccepted) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          specialityId = request.params.specialityId;
          _request$body2 = request.body, name = _request$body2.name, description = _request$body2.description;
          _context7.next = 8;
          return regeneratorRuntime.awrap(SpecialityModel.findById(specialityId));

        case 8:
          speciality = _context7.sent;

          if (!(name != speciality.name)) {
            _context7.next = 15;
            break;
          }

          _context7.next = 12;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            name: name
          }));

        case 12:
          nameList = _context7.sent;

          if (!(nameList.length != 0)) {
            _context7.next = 15;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'speciality name is already registered',
            field: 'name'
          }));

        case 15:
          specialityData = {
            name: name,
            description: description
          };
          _context7.next = 18;
          return regeneratorRuntime.awrap(SpecialityModel.findByIdAndUpdate(specialityId, specialityData, {
            "new": true
          }));

        case 18:
          updatedspeciality = _context7.sent;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'updated speciality successfully!',
            speciality: updatedspeciality
          }));

        case 22:
          _context7.prev = 22;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 26:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

var updateSpecialityShowStatus = function updateSpecialityShowStatus(request, response) {
  var dataValidation, specialityId, isShow, updatedspeciality;
  return regeneratorRuntime.async(function updateSpecialityShowStatus$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          dataValidation = specialityValidation.updateSpecialityShowStatus(request.body);

          if (dataValidation.isAccepted) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          specialityId = request.params.specialityId;
          isShow = request.body.isShow;
          _context8.next = 8;
          return regeneratorRuntime.awrap(SpecialityModel.findByIdAndUpdate(specialityId, {
            isShow: isShow
          }, {
            "new": true
          }));

        case 8:
          updatedspeciality = _context8.sent;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'updated speciality show successfully!',
            speciality: updatedspeciality
          }));

        case 12:
          _context8.prev = 12;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 16:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

module.exports = {
  getSpecialities: getSpecialities,
  getSpeciality: getSpeciality,
  getSubSpecialitiesOfMainSpeciality: getSubSpecialitiesOfMainSpeciality,
  addSpeciality: addSpeciality,
  deleteSpeciality: deleteSpeciality,
  deleteSpecialities: deleteSpecialities,
  updateSpeciality: updateSpeciality,
  updateSpecialityShowStatus: updateSpecialityShowStatus
};