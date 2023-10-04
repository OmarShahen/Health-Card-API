"use strict";

var ArrivalMethodModel = require('../models/ArrivalMethodModel');

var ClinicPatientModel = require('../models/ClinicPatientModel');

var PatientSurveyModel = require('../models/followup-service/patientSurveyModel');

var arrivalMethodValidation = require('../validations/arrival-methods');

var getArrivalMethods = function getArrivalMethods(request, response) {
  var arrivalMethods;
  return regeneratorRuntime.async(function getArrivalMethods$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(ArrivalMethodModel.find().sort({
            createdAt: -1
          }));

        case 3:
          arrivalMethods = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            arrivalMethods: arrivalMethods
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

var addArrivalMethod = function addArrivalMethod(request, response) {
  var dataValidation, name, arrivalMethodsList, arrivalMethodData, arrivalMethodObj, newArrivalMethod;
  return regeneratorRuntime.async(function addArrivalMethod$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = arrivalMethodValidation.addArrivalMethod(request.body);

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
          name = request.body.name;
          _context2.next = 7;
          return regeneratorRuntime.awrap(ArrivalMethodModel.find({
            name: name
          }));

        case 7:
          arrivalMethodsList = _context2.sent;

          if (!(arrivalMethodsList.length != 0)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Arrival name is already registered',
            field: 'name'
          }));

        case 10:
          arrivalMethodData = {
            name: name
          };
          arrivalMethodObj = new ArrivalMethodModel(arrivalMethodData);
          _context2.next = 14;
          return regeneratorRuntime.awrap(arrivalMethodObj.save());

        case 14:
          newArrivalMethod = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'New arrival method is added successfully!',
            arrivalMethod: newArrivalMethod
          }));

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var updateArrivalMethod = function updateArrivalMethod(request, response) {
  var dataValidation, arrivalMethodId, name, arrivalMethod, nameList, arrivalMethodData, updatedArrivalMethod;
  return regeneratorRuntime.async(function updateArrivalMethod$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = arrivalMethodValidation.updateArrivalMethod(request.body);

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
          arrivalMethodId = request.params.arrivalMethodId;
          name = request.body.name;
          _context3.next = 8;
          return regeneratorRuntime.awrap(ArrivalMethodModel.findById(arrivalMethodId));

        case 8:
          arrivalMethod = _context3.sent;

          if (!(name != arrivalMethod.name)) {
            _context3.next = 15;
            break;
          }

          _context3.next = 12;
          return regeneratorRuntime.awrap(ArrivalMethodModel.find({
            name: name
          }));

        case 12:
          nameList = _context3.sent;

          if (!(nameList.length != 0)) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Arrival method name is already registered',
            field: 'name'
          }));

        case 15:
          arrivalMethodData = {
            name: name
          };
          _context3.next = 18;
          return regeneratorRuntime.awrap(ArrivalMethodModel.findByIdAndUpdate(arrivalMethodId, arrivalMethodData, {
            "new": true
          }));

        case 18:
          updatedArrivalMethod = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated arrival method successfully!',
            arrivalMethod: updatedArrivalMethod
          }));

        case 22:
          _context3.prev = 22;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

var deleteArrivalMethod = function deleteArrivalMethod(request, response) {
  var arrivalMethodId, patientsSurveysList, deletedArrivalMethod;
  return regeneratorRuntime.async(function deleteArrivalMethod$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          arrivalMethodId = request.params.arrivalMethodId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(PatientSurveyModel.find({
            arrivalMethodId: arrivalMethodId
          }));

        case 4:
          patientsSurveysList = _context4.sent;

          if (!(patientsSurveysList.length != 0)) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Arrival method is registered with patients surveys',
            field: 'arrivalMethodId'
          }));

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap(ArrivalMethodModel.findByIdAndDelete(arrivalMethodId));

        case 9:
          deletedArrivalMethod = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted arrival method successfully!',
            arrivalMethod: deletedArrivalMethod
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

module.exports = {
  getArrivalMethods: getArrivalMethods,
  addArrivalMethod: addArrivalMethod,
  updateArrivalMethod: updateArrivalMethod,
  deleteArrivalMethod: deleteArrivalMethod
};