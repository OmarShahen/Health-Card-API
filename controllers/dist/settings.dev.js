"use strict";

var SettingModel = require('../models/SettingModel');

var settingsValidation = require('../validations/settings');

var getSettings = function getSettings(request, response) {
  var settings;
  return regeneratorRuntime.async(function getSettings$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(SettingModel.getSettings());

        case 3:
          settings = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            settings: settings
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

var getSeekerSettings = function getSeekerSettings(request, response) {
  var settings, seekerSettings;
  return regeneratorRuntime.async(function getSeekerSettings$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(SettingModel.getSettings());

        case 3:
          settings = _context2.sent;
          seekerSettings = {
            paymentCommission: settings.paymentCommission,
            currencyPriceUSD: settings.currencyPriceUSD
          };
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            settings: seekerSettings
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

var updateSettings = function updateSettings(request, response) {
  var dataValidation, settings, updatedSettings;
  return regeneratorRuntime.async(function updateSettings$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = settingsValidation.updateSettings(request.body);

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
          _context3.next = 6;
          return regeneratorRuntime.awrap(SettingModel.getSettings());

        case 6:
          settings = _context3.sent;
          _context3.next = 9;
          return regeneratorRuntime.awrap(SettingModel.findByIdAndUpdate(settings._id, request.body, {
            "new": true
          }));

        case 9:
          updatedSettings = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated settings successfully!',
            settings: updatedSettings
          }));

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

module.exports = {
  getSettings: getSettings,
  updateSettings: updateSettings,
  getSeekerSettings: getSeekerSettings
};