"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ClinicSubscriptionModel = require('../../models/followup-service/ClinicSubscriptionModel');

var ClinicModel = require('../../models/ClinicModel');

var CounterModel = require('../../models/CounterModel');

var clinicSubscriptionValidator = require('../../validations/followup-service/clinics-subscriptions');

var mongoose = require('mongoose');

var addClinicSubscription = function addClinicSubscription(request, response) {
  var dataValidation, clinicId, clinic, clinicSubscriptionList, counter, clinicSubcriptionData, clinicSubscriptionObj, newClinicSubscription;
  return regeneratorRuntime.async(function addClinicSubscription$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          dataValidation = clinicSubscriptionValidator.addClinicSubscription(request.body);

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
          clinicId = request.body.clinicId;
          _context.next = 7;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 7:
          clinic = _context.sent;

          if (clinic) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic ID is not registered',
            field: 'clinicId'
          }));

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(ClinicSubscriptionModel.find({
            clinicId: clinicId,
            isActive: true,
            endDate: {
              $gt: Date.now()
            }
          }));

        case 12:
          clinicSubscriptionList = _context.sent;

          if (!(clinicSubscriptionList.length != 0)) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic has a active subscription',
            field: 'clinicId'
          }));

        case 15:
          _context.next = 17;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'ClinicSubscription'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 17:
          counter = _context.sent;
          clinicSubcriptionData = _objectSpread({}, request.body);
          clinicSubcriptionData.clinicSubscriptionId = counter.value;
          clinicSubscriptionObj = new ClinicSubscriptionModel(clinicSubcriptionData);
          _context.next = 23;
          return regeneratorRuntime.awrap(clinicSubscriptionObj.save());

        case 23:
          newClinicSubscription = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Created clinic subscription successfully!',
            clinicSubscription: newClinicSubscription
          }));

        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 31:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

var getClinicsSubscriptions = function getClinicsSubscriptions(request, response) {
  var clinicsSubscriptions;
  return regeneratorRuntime.async(function getClinicsSubscriptions$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(ClinicSubscriptionModel.aggregate([{
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

        case 3:
          clinicsSubscriptions = _context2.sent;
          clinicsSubscriptions.forEach(function (clinicSubscription) {
            return clinicSubscription.clinic = clinicSubscription.clinic[0];
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsSubscriptions: clinicsSubscriptions
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

var updateClinicSubscriptionActivity = function updateClinicSubscriptionActivity(request, response) {
  var clinicSubscriptionId, isActive, clinicSubscription, subscriptionEndDate, todayDate, clinicSubscriptionList, updatedClinicSubscription;
  return regeneratorRuntime.async(function updateClinicSubscriptionActivity$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          clinicSubscriptionId = request.params.clinicSubscriptionId;
          isActive = request.body.isActive;

          if (!(typeof isActive != 'boolean')) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'isActive format is invalid',
            field: 'isActive'
          }));

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(ClinicSubscriptionModel.findById(clinicSubscriptionId));

        case 7:
          clinicSubscription = _context3.sent;

          if (!(isActive == clinicSubscription.isActive)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic subscription is already in this status',
            field: 'clinicSubscriptionId'
          }));

        case 10:
          subscriptionEndDate = new Date(clinicSubscription.endDate);
          todayDate = new Date();

          if (!(todayDate > subscriptionEndDate)) {
            _context3.next = 14;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic subscription is already expired',
            field: 'clinicSubscriptionId'
          }));

        case 14:
          if (!isActive) {
            _context3.next = 20;
            break;
          }

          _context3.next = 17;
          return regeneratorRuntime.awrap(ClinicSubscriptionModel.find({
            clinicId: clinicSubscription.clinicId,
            isActive: true,
            endDate: {
              $gt: Date.now()
            }
          }));

        case 17:
          clinicSubscriptionList = _context3.sent;

          if (!(clinicSubscriptionList.length != 0)) {
            _context3.next = 20;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic has active subscription',
            field: 'clinicSubscriptionId'
          }));

        case 20:
          _context3.next = 22;
          return regeneratorRuntime.awrap(ClinicSubscriptionModel.findByIdAndUpdate(clinicSubscriptionId, {
            isActive: isActive
          }, {
            "new": true
          }));

        case 22:
          updatedClinicSubscription = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated clinic subscription successfully!',
            clinicSubscription: updatedClinicSubscription
          }));

        case 26:
          _context3.prev = 26;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 30:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 26]]);
};

var getClinicSubscriptions = function getClinicSubscriptions(request, response) {
  var clinicId, clinicsSubscriptions;
  return regeneratorRuntime.async(function getClinicSubscriptions$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          clinicId = request.params.clinicId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(ClinicSubscriptionModel.aggregate([{
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
            $sort: {
              createdAt: -1
            }
          }]));

        case 4:
          clinicsSubscriptions = _context4.sent;
          clinicsSubscriptions.forEach(function (clinicSubscription) {
            return clinicSubscription.clinic = clinicSubscription.clinic[0];
          });
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsSubscriptions: clinicsSubscriptions
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

var deleteClinicSubscription = function deleteClinicSubscription(request, response) {
  var clinicSubscriptionId, deletedClinicSubscription;
  return regeneratorRuntime.async(function deleteClinicSubscription$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          clinicSubscriptionId = request.params.clinicSubscriptionId;
          _context5.next = 4;
          return regeneratorRuntime.awrap(ClinicSubscriptionModel.findByIdAndDelete(clinicSubscriptionId));

        case 4:
          deletedClinicSubscription = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted clinic subscription successfully!',
            clinicSubscription: deletedClinicSubscription
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

var deleteClinicsSubscriptions = function deleteClinicsSubscriptions(request, response) {
  var deletedClinicsSubscriptions;
  return regeneratorRuntime.async(function deleteClinicsSubscriptions$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(ClinicSubscriptionModel.deleteMany());

        case 3:
          deletedClinicsSubscriptions = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted clinics subscriptions successfully!',
            clinicsSubscriptions: deletedClinicsSubscriptions
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

module.exports = {
  addClinicSubscription: addClinicSubscription,
  getClinicsSubscriptions: getClinicsSubscriptions,
  getClinicSubscriptions: getClinicSubscriptions,
  deleteClinicSubscription: deleteClinicSubscription,
  deleteClinicsSubscriptions: deleteClinicsSubscriptions,
  updateClinicSubscriptionActivity: updateClinicSubscriptionActivity
};