"use strict";

var config = require('../config/config');

var getSettings = function getSettings(request, response) {
  return regeneratorRuntime.async(function getSettings$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            config: config
          }));

        case 4:
          _context.prev = 4;
          _context.t0 = _context["catch"](0);
          consol.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 8:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 4]]);
};

module.exports = {
  getSettings: getSettings
};