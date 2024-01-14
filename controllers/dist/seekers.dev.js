"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var UserModel = require('../models/UserModel');

var AppointmentModel = require('../models/AppointmentModel');

var PaymentModel = require('../models/PaymentModel');

var ReviewModel = require('../models/ReviewModel');

var utils = require('../utils/utils');

var getSeekers = function getSeekers(request, response) {
  var _utils$statsQueryGene, searchQuery, matchQuery, seekers, totalSeekers;

  return regeneratorRuntime.async(function getSeekers$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          matchQuery = _objectSpread({}, searchQuery, {
            type: 'SEEKER',
            isVerified: true
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(UserModel.aggregate([{
            $match: matchQuery
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $limit: 25
          }, {
            $project: {
              password: 0
            }
          }]));

        case 5:
          seekers = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(UserModel.countDocuments(matchQuery));

        case 8:
          totalSeekers = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            totalSeekers: totalSeekers,
            seekers: seekers
          }));

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
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

var searchSeekersByName = function searchSeekersByName(request, response) {
  var name, matchQuery, seekers;
  return regeneratorRuntime.async(function searchSeekersByName$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          name = request.query.name;
          name = name ? name : '';
          matchQuery = {
            isVerified: true,
            type: 'SEEKER',
            firstName: {
              $regex: name,
              $options: 'i'
            }
          };
          _context2.next = 6;
          return regeneratorRuntime.awrap(UserModel.aggregate([{
            $match: matchQuery
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $limit: 25
          }, {
            $project: {
              password: 0
            }
          }]));

        case 6:
          seekers = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            seekers: seekers
          }));

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var deleteSeeker = function deleteSeeker(request, response) {
  var userId, appointmentsPromise, paymentsPromise, reviewsPromise, _ref, _ref2, appointments, payments, reviews, deletedUser;

  return regeneratorRuntime.async(function deleteSeeker$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = request.params.userId;
          appointmentsPromise = AppointmentModel.find({
            seekerId: userId
          });
          paymentsPromise = PaymentModel.find({
            seekerId: userId
          });
          reviewsPromise = ReviewModel.find({
            seekerId: userId
          });
          _context3.next = 7;
          return regeneratorRuntime.awrap(Promise.all([appointmentsPromise, paymentsPromise, reviewsPromise]));

        case 7:
          _ref = _context3.sent;
          _ref2 = _slicedToArray(_ref, 3);
          appointments = _ref2[0];
          payments = _ref2[1];
          reviews = _ref2[2];

          if (!(appointments.length != 0)) {
            _context3.next = 14;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Seeker is registered with appointments',
            field: 'appointments'
          }));

        case 14:
          if (!(payments.length != 0)) {
            _context3.next = 16;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Seeker is registered with payments',
            field: 'payments'
          }));

        case 16:
          if (!(reviews.length != 0)) {
            _context3.next = 18;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Seeker is registered with reviews',
            field: 'reviews'
          }));

        case 18:
          _context3.next = 20;
          return regeneratorRuntime.awrap(UserModel.findByIdAndDelete(userId));

        case 20:
          deletedUser = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted seeker successfully!',
            user: deletedUser
          }));

        case 24:
          _context3.prev = 24;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 28:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

module.exports = {
  searchSeekersByName: searchSeekersByName,
  getSeekers: getSeekers,
  deleteSeeker: deleteSeeker
};