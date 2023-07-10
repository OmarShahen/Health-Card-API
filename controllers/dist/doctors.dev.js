"use strict";

var ClinicDoctorsModel = require('../models/ClinicDoctorModel');

var mongoose = require('mongoose');

var getClinicDoctors = function getClinicDoctors(request, response) {
  var clinicId, doctors;
  return regeneratorRuntime.async(function getClinicDoctors$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          clinicId = request.params.clinicId;
          _context.next = 4;
          return regeneratorRuntime.awrap(ClinicDoctorsModel.aggregate([{
            $match: {
              clinicId: mongoose.Types.ObjectId(clinicId)
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctor'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'doctor.password': 0
            }
          }]));

        case 4:
          doctors = _context.sent;
          doctors.forEach(function (doctor) {
            doctor.doctor = doctor.doctor[0];
          });
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            doctors: doctors
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

module.exports = {
  getClinicDoctors: getClinicDoctors
};