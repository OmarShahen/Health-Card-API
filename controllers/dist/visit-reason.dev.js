"use strict";

var VisitReasonModel = require('../models/VisitReasonModel');

var visitReasonValidation = require('../validations/visit-reasons');

var getVisitReasons = function getVisitReasons(request, response) {
  var visitReasons;
  return regeneratorRuntime.async(function getVisitReasons$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(VisitReasonModel.find());

        case 3:
          visitReasons = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            visitReasons: visitReasons
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

var addVisitReason = function addVisitReason(request, response) {
  var dataValidation;
  return regeneratorRuntime.async(function addVisitReason$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = visitReasonValidation.addVisitReason(request.body);

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
          console.log(request.body);
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'added visit reason successfully!'
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

module.exports = {
  getVisitReasons: getVisitReasons,
  addVisitReason: addVisitReason
};