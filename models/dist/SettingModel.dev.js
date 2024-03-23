"use strict";

var mongoose = require('mongoose');

var SettingSchema = new mongoose.Schema({
  notificationEmail: {
    type: String,
    required: true
  },
  paymentCommission: {
    type: Number,
    required: true
  },
  currencyPriceUSD: {
    type: Number,
    "default": 48
  },
  supportNumber: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

SettingSchema.statics.getSettings = function _callee() {
  var settings, settingsData;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(this.findOne());

        case 2:
          settings = _context.sent;

          if (settings) {
            _context.next = 8;
            break;
          }

          settingsData = {
            notificationEmail: 'omarredaelsayedmohamed@gmail.com',
            paymentCommission: 0.1,
            supportNumber: '+201065630331'
          };
          _context.next = 7;
          return regeneratorRuntime.awrap(this.create(settingsData));

        case 7:
          settings = _context.sent;

        case 8:
          return _context.abrupt("return", settings);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
};

module.exports = mongoose.model('Setting', SettingSchema);