"use strict";

var PatientSurveyModel = require('../../models/followup-service/patientSurveyModel');

var getPatientsSurveys = function getPatientsSurveys(request, response) {
  var patientsSurveys;
  return regeneratorRuntime.async(function getPatientsSurveys$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(PatientSurveyModel.find());

        case 3:
          patientsSurveys = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            patientsSurveys: patientsSurveys
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
  getPatientsSurveys: getPatientsSurveys
};