"use strict";

var UserModel = require('../models/UserModel');

var getClinicStaffs = function getClinicStaffs(request, response) {
  var clinicId, staffs;
  return regeneratorRuntime.async(function getClinicStaffs$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          clinicId = request.params.clinicId;
          _context.next = 4;
          return regeneratorRuntime.awrap(UserModel.find({
            clinicId: clinicId
          }).select({
            password: 0
          }));

        case 4:
          staffs = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            staffs: staffs
          }));

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = {
  getClinicStaffs: getClinicStaffs
};