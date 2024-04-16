"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ViewModel = require('../models/ViewModel');

var UserModel = require('../models/UserModel');

var viewValidation = require('../validations/views');

var mongoose = require('mongoose');

var utils = require('../utils/utils');

var getViews = function getViews(request, response) {
  var views;
  return regeneratorRuntime.async(function getViews$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(ViewModel.find().sort({
            createdAt: -1
          }));

        case 3:
          views = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            views: views
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

var addView = function addView(request, response) {
  var dataValidation, _request$body, seekerId, expertId, seekerPromise, expertPromise, _ref, _ref2, seeker, expert, viewData, viewObj, newView, updatedExpert;

  return regeneratorRuntime.async(function addView$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = viewValidation.addView(request.body);

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
          _request$body = request.body, seekerId = _request$body.seekerId, expertId = _request$body.expertId;
          seekerPromise = UserModel.findById(seekerId);
          expertPromise = UserModel.findById(expertId);
          _context2.next = 9;
          return regeneratorRuntime.awrap(Promise.all([seekerPromise, expertPromise]));

        case 9:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 2);
          seeker = _ref2[0];
          expert = _ref2[1];

          if (seeker) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Seeker ID does not exists',
            field: 'seekerId'
          }));

        case 15:
          if (expert) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Expert ID does not exists',
            field: 'expertId'
          }));

        case 17:
          viewData = _objectSpread({}, request.body);
          viewObj = new ViewModel(viewData);
          _context2.next = 21;
          return regeneratorRuntime.awrap(viewObj.save());

        case 21:
          newView = _context2.sent;
          _context2.next = 24;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(expertId, {
            $inc: {
              views: 1
            }
          }, {
            "new": true
          }));

        case 24:
          updatedExpert = _context2.sent;
          updatedExpert.password = undefined;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added view successfully!',
            view: newView,
            expert: updatedExpert
          }));

        case 29:
          _context2.prev = 29;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 33:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 29]]);
};

var getExpertViewsGrowthStats = function getExpertViewsGrowthStats(request, response) {
  var userId, groupBy, format, _utils$statsQueryGene, searchQuery, viewsGrowth;

  return regeneratorRuntime.async(function getExpertViewsGrowthStats$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = request.params.userId;
          groupBy = request.query.groupBy;
          format = '%Y-%m-%d';

          if (groupBy == 'MONTH') {
            format = '%Y-%m';
          } else if (groupBy == 'YEAR') {
            format = '%Y';
          }

          _utils$statsQueryGene = utils.statsQueryGenerator('expertId', userId, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context3.next = 8;
          return regeneratorRuntime.awrap(ViewModel.aggregate([{
            $match: searchQuery
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
          viewsGrowth = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            viewsGrowth: viewsGrowth
          }));

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
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

var getExpertPagesStats = function getExpertPagesStats(request, response) {
  var userId, _utils$statsQueryGene2, searchQuery, viewsStats;

  return regeneratorRuntime.async(function getExpertPagesStats$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = request.params.userId;
          _utils$statsQueryGene2 = utils.statsQueryGenerator('expertId', userId, request.query), searchQuery = _utils$statsQueryGene2.searchQuery;
          _context4.next = 5;
          return regeneratorRuntime.awrap(ViewModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$page',
              count: {
                $sum: 1
              }
            }
          }]));

        case 5:
          viewsStats = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            viewsStats: viewsStats
          }));

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getExpertViewsTotal = function getExpertViewsTotal(request, response) {
  var userId, _utils$statsQueryGene3, searchQuery, totalViews;

  return regeneratorRuntime.async(function getExpertViewsTotal$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = request.params.userId;
          _utils$statsQueryGene3 = utils.statsQueryGenerator('expertId', userId, request.query), searchQuery = _utils$statsQueryGene3.searchQuery;
          _context5.next = 5;
          return regeneratorRuntime.awrap(ViewModel.countDocuments(searchQuery));

        case 5:
          totalViews = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            totalViews: totalViews
          }));

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

module.exports = {
  getViews: getViews,
  addView: addView,
  getExpertViewsGrowthStats: getExpertViewsGrowthStats,
  getExpertPagesStats: getExpertPagesStats,
  getExpertViewsTotal: getExpertViewsTotal
};