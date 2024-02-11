"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var UserModel = require('../models/UserModel');

var AppointmentModel = require('../models/AppointmentModel');

var ExpertVerificationModel = require('../models/ExpertVerificationModel');

var ReviewModel = require('../models/ReviewModel');

var utils = require('../utils/utils');

var getOverviewAnalytics = function getOverviewAnalytics(request, response) {
  var _utils$statsQueryGene, searchQuery, totalSeekers, totalExperts, totalAppointments, totalExpertVerifications, totalReviews, reviewsRatingList, reviewsRating;

  return regeneratorRuntime.async(function getOverviewAnalytics$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;

          /*const clinicPatientsGrowth = await ClinicPatientModel.aggregate([
              {
                  $match: {
                      clinicId: { $in: uniqueOwnedIdsList }
                  }
              },
              {
                  $group: {
                      _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                      count: { $sum: 1 }
                  }
              }
          ])
            const patientsSurveysOverallExperienceScores = await PatientSurveyModel.aggregate([
              {
                  $match: searchQuery
              },
              {
                  $group: {
                      _id: '$overallExperience',
                      count: { $sum: 1 }
                  }
              }
          ])
            const treatmentsSurveysImprovementScores = await TreatmentSurveyModel.aggregate([
              {
                  $match: searchQuery
              },
              {
                  $group: {
                      _id: '$improvement',
                      count: { $sum: 1 }
                  }
              }
          ])*/
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context.next = 4;
          return regeneratorRuntime.awrap(UserModel.countDocuments(_objectSpread({}, searchQuery, {
            isVerified: true,
            type: 'SEEKER'
          })));

        case 4:
          totalSeekers = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(UserModel.countDocuments(_objectSpread({}, searchQuery, {
            isVerified: true,
            type: 'EXPERT'
          })));

        case 7:
          totalExperts = _context.sent;
          _context.next = 10;
          return regeneratorRuntime.awrap(AppointmentModel.countDocuments(_objectSpread({}, searchQuery, {
            isPaid: true
          })));

        case 10:
          totalAppointments = _context.sent;
          _context.next = 13;
          return regeneratorRuntime.awrap(ExpertVerificationModel.countDocuments(_objectSpread({}, searchQuery)));

        case 13:
          totalExpertVerifications = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(ReviewModel.countDocuments(_objectSpread({}, searchQuery)));

        case 16:
          totalReviews = _context.sent;
          _context.next = 19;
          return regeneratorRuntime.awrap(ReviewModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: null,
              averageRating: {
                $avg: '$rating'
              }
            }
          }]));

        case 19:
          reviewsRatingList = _context.sent;
          reviewsRating = 0;

          if (reviewsRatingList.length != 0) {
            reviewsRating = reviewsRatingList[0].averageRating;
            reviewsRating = Number.parseFloat(reviewsRating.toFixed(2));
          }

          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            totalSeekers: totalSeekers,
            totalExperts: totalExperts,
            totalAppointments: totalAppointments,
            totalExpertVerifications: totalExpertVerifications,
            totalReviews: totalReviews,
            reviewsRating: reviewsRating
          }));

        case 25:
          _context.prev = 25;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 29:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 25]]);
};

var getUsersGrowthStats = function getUsersGrowthStats(request, response) {
  var _request$query, groupBy, type, format, matchQuery, usersGrowth;

  return regeneratorRuntime.async(function getUsersGrowthStats$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _request$query = request.query, groupBy = _request$query.groupBy, type = _request$query.type;
          format = '%Y-%m-%d';

          if (groupBy == 'MONTH') {
            format = '%Y-%m';
          } else if (groupBy == 'YEAR') {
            format = '%Y';
          }

          matchQuery = {
            isVerified: true
          };

          if (type == 'SEEKER') {
            matchQuery.type = 'SEEKER';
          } else if (type == 'EXPERT') {
            matchQuery.type = 'EXPERT';
          }

          _context2.next = 8;
          return regeneratorRuntime.awrap(UserModel.aggregate([{
            $match: matchQuery
          }, {
            $group: {
              _id: {
                $dateToString: {
                  format: format,
                  date: '$createdAt'
                }
              },
              count: {
                $sum: 1
              }
            }
          }, {
            $sort: {
              '_id': 1
            }
          }]));

        case 8:
          usersGrowth = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            usersGrowth: usersGrowth
          }));

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

module.exports = {
  getOverviewAnalytics: getOverviewAnalytics,
  getUsersGrowthStats: getUsersGrowthStats
};