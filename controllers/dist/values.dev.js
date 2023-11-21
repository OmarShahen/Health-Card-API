"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ValueModel = require('../models/ValueModel');

var valueValidation = require('../validations/values');

var CounterModel = require('../models/CounterModel');

var getValues = function getValues(request, response) {
  var entity, searchQuery, values;
  return regeneratorRuntime.async(function getValues$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          entity = request.query.entity;
          searchQuery = entity ? {
            entity: entity
          } : {};
          _context.next = 5;
          return regeneratorRuntime.awrap(ValueModel.find(searchQuery).sort({
            createdAt: -1
          }));

        case 5:
          values = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            values: values
          }));

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var addValue = function addValue(request, response) {
  var dataValidation, _request$body, value, entity, valueList, counter, valueData, valueObj, newValue;

  return regeneratorRuntime.async(function addValue$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = valueValidation.addValue(request.body);

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
          _request$body = request.body, value = _request$body.value, entity = _request$body.entity;
          _context2.next = 7;
          return regeneratorRuntime.awrap(ValueModel.find({
            value: value,
            entity: entity
          }));

        case 7:
          valueList = _context2.sent;

          if (!(valueList.length != 0)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'value is already registered with this entity',
            field: 'value'
          }));

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'Value'
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
          valueData = _objectSpread({
            valueId: counter.value
          }, request.body);
          valueObj = new ValueModel(valueData);
          _context2.next = 17;
          return regeneratorRuntime.awrap(valueObj.save());

        case 17:
          newValue = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added value successfully!',
            value: newValue
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

var deleteValue = function deleteValue(request, response) {
  var valueId, deletedValue;
  return regeneratorRuntime.async(function deleteValue$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          valueId = request.params.valueId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(ValueModel.findByIdAndDelete(valueId));

        case 4:
          deletedValue = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Value is deleted successfully!',
            value: deletedValue
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

var updateValueValue = function updateValueValue(request, response) {
  var dataValidation, valueId, value, valueList, updatedValue;
  return regeneratorRuntime.async(function updateValueValue$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          dataValidation = valueValidation.updateValueValue(request.body);

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
          valueId = request.params.valueId;
          _context4.next = 7;
          return regeneratorRuntime.awrap(ValueModel.findById(valueId));

        case 7:
          value = _context4.sent;

          if (!(value.value != request.body.value)) {
            _context4.next = 14;
            break;
          }

          _context4.next = 11;
          return regeneratorRuntime.awrap(ValueModel.find({
            value: request.body.value,
            entity: value.entity
          }));

        case 11:
          valueList = _context4.sent;

          if (!(valueList.length != 0)) {
            _context4.next = 14;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'value is already registered with this entity',
            field: 'value'
          }));

        case 14:
          _context4.next = 16;
          return regeneratorRuntime.awrap(ValueModel.findByIdAndUpdate(valueId, {
            value: request.body.value
          }, {
            "new": true
          }));

        case 16:
          updatedValue = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated value successfully!',
            value: updatedValue
          }));

        case 20:
          _context4.prev = 20;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
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
  }, null, null, [[0, 20]]);
};

module.exports = {
  getValues: getValues,
  addValue: addValue,
  deleteValue: deleteValue,
  updateValueValue: updateValueValue
};