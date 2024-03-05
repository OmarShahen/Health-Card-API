"use strict";

var utils = require('../utils/utils');

var UserModel = require('../models/UserModel');

var AppointmentModel = require('../models/AppointmentModel');

var SpecialityModel = require('../models/SpecialityModel');

var OpeningTimeModel = require('../models/OpeningTimeModel');

var ReviewModel = require('../models/ReviewModel');

var ExpertVerificationModel = require('../models/ExpertVerificationModel');

var ServiceModel = require('../models/ServiceModel');

var PromoCodeModel = require('../models/PromoCodeModel');

var verifyUserId = function verifyUserId(request, response, next) {
  var userId, user;
  return regeneratorRuntime.async(function verifyUserId$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = request.params.userId;

          if (utils.isObjectId(userId)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid user Id formate',
            field: 'userId'
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(UserModel.findById(userId));

        case 6:
          user = _context.sent;

          if (user) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'user Id does not exist',
            field: 'userId'
          }));

        case 9:
          return _context.abrupt("return", next());

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyAppointmentId = function verifyAppointmentId(request, response, next) {
  var appointmentId, appointment;
  return regeneratorRuntime.async(function verifyAppointmentId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          appointmentId = request.params.appointmentId;

          if (utils.isObjectId(appointmentId)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid appointment Id formate',
            field: 'appointmentId'
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(AppointmentModel.findById(appointmentId));

        case 6:
          appointment = _context2.sent;

          if (appointment) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'appointment Id does not exist',
            field: 'appointmentId'
          }));

        case 9:
          return _context2.abrupt("return", next());

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifySpecialityId = function verifySpecialityId(request, response, next) {
  var specialityId, speciality;
  return regeneratorRuntime.async(function verifySpecialityId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          specialityId = request.params.specialityId;

          if (utils.isObjectId(specialityId)) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid speciality Id formate',
            field: 'specialityId'
          }));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(SpecialityModel.findById(specialityId));

        case 6:
          speciality = _context3.sent;

          if (speciality) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'speciality Id does not exist',
            field: 'specialityId'
          }));

        case 9:
          return _context3.abrupt("return", next());

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyOpeningTimeId = function verifyOpeningTimeId(request, response, next) {
  var openingTimeId, openingTime;
  return regeneratorRuntime.async(function verifyOpeningTimeId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          openingTimeId = request.params.openingTimeId;

          if (utils.isObjectId(openingTimeId)) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid opening ID format',
            field: 'openingTimeId'
          }));

        case 4:
          _context4.next = 6;
          return regeneratorRuntime.awrap(OpeningTimeModel.findById(openingTimeId));

        case 6:
          openingTime = _context4.sent;

          if (openingTime) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'Opening ID does not exist',
            field: 'openingTimeId'
          }));

        case 9:
          return _context4.abrupt("return", next());

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyReviewId = function verifyReviewId(request, response, next) {
  var reviewId, review;
  return regeneratorRuntime.async(function verifyReviewId$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          reviewId = request.params.reviewId;

          if (utils.isObjectId(reviewId)) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid review ID format',
            field: 'reviewId'
          }));

        case 4:
          _context5.next = 6;
          return regeneratorRuntime.awrap(ReviewModel.findById(reviewId));

        case 6:
          review = _context5.sent;

          if (review) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'Review ID does not exist',
            field: 'reviewId'
          }));

        case 9:
          return _context5.abrupt("return", next());

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 16:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyExpertVerificationId = function verifyExpertVerificationId(request, response, next) {
  var expertVerificationId, expertVerification;
  return regeneratorRuntime.async(function verifyExpertVerificationId$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          expertVerificationId = request.params.expertVerificationId;

          if (utils.isObjectId(expertVerificationId)) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid expert verification ID format',
            field: 'expertVerificationId'
          }));

        case 4:
          _context6.next = 6;
          return regeneratorRuntime.awrap(ExpertVerificationModel.findById(expertVerificationId));

        case 6:
          expertVerification = _context6.sent;

          if (expertVerification) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'Expert verification ID does not exist',
            field: 'expertVerificationId'
          }));

        case 9:
          return _context6.abrupt("return", next());

        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
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
  }, null, null, [[0, 12]]);
};

var verifyServiceId = function verifyServiceId(request, response, next) {
  var serviceId, service;
  return regeneratorRuntime.async(function verifyServiceId$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          serviceId = request.params.serviceId;

          if (utils.isObjectId(serviceId)) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid service ID format',
            field: 'serviceId'
          }));

        case 4:
          _context7.next = 6;
          return regeneratorRuntime.awrap(ServiceModel.findById(serviceId));

        case 6:
          service = _context7.sent;

          if (service) {
            _context7.next = 9;
            break;
          }

          return _context7.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'Service ID does not exist',
            field: 'serviceId'
          }));

        case 9:
          return _context7.abrupt("return", next());

        case 12:
          _context7.prev = 12;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyPromoCodeId = function verifyPromoCodeId(request, response, next) {
  var promoCodeId, promoCode;
  return regeneratorRuntime.async(function verifyPromoCodeId$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          promoCodeId = request.params.promoCodeId;

          if (utils.isObjectId(promoCodeId)) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid promo code ID format',
            field: 'promoCodeId'
          }));

        case 4:
          _context8.next = 6;
          return regeneratorRuntime.awrap(PromoCodeModel.findById(promoCodeId));

        case 6:
          promoCode = _context8.sent;

          if (promoCode) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'Promo code ID does not exist',
            field: 'promoCodeId'
          }));

        case 9:
          return _context8.abrupt("return", next());

        case 12:
          _context8.prev = 12;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 16:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

module.exports = {
  verifyUserId: verifyUserId,
  verifyAppointmentId: verifyAppointmentId,
  verifySpecialityId: verifySpecialityId,
  verifyOpeningTimeId: verifyOpeningTimeId,
  verifyReviewId: verifyReviewId,
  verifyExpertVerificationId: verifyExpertVerificationId,
  verifyServiceId: verifyServiceId,
  verifyPromoCodeId: verifyPromoCodeId
};