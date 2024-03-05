"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PromoCodeModel = require('../models/PromoCodeModel');

var promoCodeValidation = require('../validations/promoCodes');

var CounterModel = require('../models/CounterModel');

var AppointmentModel = require('../models/AppointmentModel');

var getPromoCodes = function getPromoCodes(request, response) {
  var promoCodes;
  return regeneratorRuntime.async(function getPromoCodes$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(PromoCodeModel.find().sort({
            createdAt: -1
          }));

        case 3:
          promoCodes = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            promoCodes: promoCodes
          }));

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getPromoCodeByCode = function getPromoCodeByCode(request, response) {
  var code, promoCodes;
  return regeneratorRuntime.async(function getPromoCodeByCode$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          code = request.params.code;
          _context2.next = 4;
          return regeneratorRuntime.awrap(PromoCodeModel.find({
            code: code
          }));

        case 4:
          promoCodes = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            promoCodes: promoCodes
          }));

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
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
  }, null, null, [[0, 8]]);
};

var addPromoCode = function addPromoCode(request, response) {
  var dataValidation, code, promoCodesList, counter, promoCodeData, promoCodeObj, newPromoCode;
  return regeneratorRuntime.async(function addPromoCode$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = promoCodeValidation.addPromoCode(request.body);

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
          code = request.body.code;
          _context3.next = 7;
          return regeneratorRuntime.awrap(PromoCodeModel.find({
            code: code
          }));

        case 7:
          promoCodesList = _context3.sent;

          if (!(promoCodesList.length != 0)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Code is already registered',
            field: 'code'
          }));

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'promoCode'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 12:
          counter = _context3.sent;
          promoCodeData = _objectSpread({
            promoCodeId: counter.value
          }, request.body);
          promoCodeObj = new PromoCodeModel(promoCodeData);
          _context3.next = 17;
          return regeneratorRuntime.awrap(promoCodeObj.save());

        case 17:
          newPromoCode = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added promo code successfully!',
            promoCode: newPromoCode
          }));

        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 24:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var updatePromoCode = function updatePromoCode(request, response) {
  var dataValidation, promoCodeId, code, promoCode, promoCodesList, updatedPromoCode;
  return regeneratorRuntime.async(function updatePromoCode$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          dataValidation = promoCodeValidation.updatePromoCode(request.body);

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
          promoCodeId = request.params.promoCodeId;
          code = request.body.code;
          _context4.next = 8;
          return regeneratorRuntime.awrap(PromoCodeModel.findById(promoCodeId));

        case 8:
          promoCode = _context4.sent;

          if (!(promoCode.code != code)) {
            _context4.next = 15;
            break;
          }

          _context4.next = 12;
          return regeneratorRuntime.awrap(PromoCodeModel.find({
            code: code
          }));

        case 12:
          promoCodesList = _context4.sent;

          if (!(promoCodesList.length != 0)) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Code is already registered',
            field: 'code'
          }));

        case 15:
          _context4.next = 17;
          return regeneratorRuntime.awrap(PromoCodeModel.findByIdAndUpdate(promoCodeId, request.body, {
            "new": true
          }));

        case 17:
          updatedPromoCode = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated promo code successfully!',
            promoCode: updatedPromoCode
          }));

        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 24:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var updatePromoCodeActivity = function updatePromoCodeActivity(request, response) {
  var promoCodeId, dataValidation, isActive, updatedPromoCode;
  return regeneratorRuntime.async(function updatePromoCodeActivity$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          promoCodeId = request.params.promoCodeId;
          dataValidation = promoCodeValidation.updatePromoCodeActivity(request.body);

          if (dataValidation.isAccepted) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          isActive = request.body.isActive;
          _context5.next = 8;
          return regeneratorRuntime.awrap(PromoCodeModel.findByIdAndUpdate(promoCodeId, {
            isActive: isActive
          }, {
            "new": true
          }));

        case 8:
          updatedPromoCode = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated promo code successfully!',
            promoCode: updatedPromoCode
          }));

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var deletePromoCode = function deletePromoCode(request, response) {
  var promoCodeId, totalAppointments, deletedPromoCode;
  return regeneratorRuntime.async(function deletePromoCode$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          promoCodeId = request.params.promoCodeId;
          _context6.next = 4;
          return regeneratorRuntime.awrap(AppointmentModel.countDocuments({
            promoCodeId: promoCodeId
          }));

        case 4:
          totalAppointments = _context6.sent;

          if (!(totalAppointments != 0)) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Promo Code is registered with appointments',
            field: 'promoCodeId'
          }));

        case 7:
          _context6.next = 9;
          return regeneratorRuntime.awrap(PromoCodeModel.findByIdAndDelete(promoCodeId));

        case 9:
          deletedPromoCode = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted promo code successfully!',
            promoCode: deletedPromoCode
          }));

        case 13:
          _context6.prev = 13;
          _context6.t0 = _context6["catch"](0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 16:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

module.exports = {
  getPromoCodes: getPromoCodes,
  addPromoCode: addPromoCode,
  updatePromoCode: updatePromoCode,
  getPromoCodeByCode: getPromoCodeByCode,
  updatePromoCodeActivity: updatePromoCodeActivity,
  deletePromoCode: deletePromoCode
};