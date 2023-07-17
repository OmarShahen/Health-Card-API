"use strict";

var SubscriptionModel = require('../models/SubscriptionModel');

var getSubscriptions = function getSubscriptions(request, response) {
  var subscriptions;
  return regeneratorRuntime.async(function getSubscriptions$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(SubscriptionModel.find());

        case 3:
          subscriptions = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            subscriptions: subscriptions
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

module.exports = {
  getSubscriptions: getSubscriptions
};