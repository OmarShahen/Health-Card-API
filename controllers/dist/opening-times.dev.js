"use strict";

var OpeningTimeModel = require('../models/OpeningTimeModel');

var openingTimeValidation = require('../validations/opening-times');

var LeadModel = require('../models/CRM/LeadModel');

var UserModel = require('../models/UserModel');

var CounterModel = require('../models/CounterModel');

var utils = require('../utils/utils');

var mongoose = require('mongoose');

var getOpeningTimes = function getOpeningTimes(request, response) {
  var _utils$statsQueryGene, searchQuery, limit, openingTimes, totalOpeningTimes;

  return regeneratorRuntime.async(function getOpeningTimes$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          limit = 10;
          _context.next = 5;
          return regeneratorRuntime.awrap(OpeningTimeModel.aggregate([{
            $match: searchQuery
          }, {
            $sort: {
              updatedAt: -1
            }
          }, {
            $limit: limit
          }, {
            $lookup: {
              from: 'leads',
              localField: 'leadId',
              foreignField: '_id',
              as: 'lead'
            }
          }]));

        case 5:
          openingTimes = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(OpeningTimeModel.countDocuments(searchQuery));

        case 8:
          totalOpeningTimes = _context.sent;
          openingTimes.forEach(function (openTime) {
            return openTime.lead = openTime.lead[0];
          });
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            totalOpeningTimes: totalOpeningTimes,
            openingTimes: openingTimes
          }));

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var getOpeningTimesByLeadId = function getOpeningTimesByLeadId(request, response) {
  var leadId, openingTimes;
  return regeneratorRuntime.async(function getOpeningTimesByLeadId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          leadId = request.params.leadId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(OpeningTimeModel.aggregate([{
            $match: {
              leadId: mongoose.Types.ObjectId(leadId)
            }
          }, {
            $lookup: {
              from: 'leads',
              localField: 'leadId',
              foreignField: '_id',
              as: 'lead'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 4:
          openingTimes = _context2.sent;
          openingTimes.forEach(function (openTime) {
            return openTime.lead = openTime.lead[0];
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            openingTimes: openingTimes
          }));

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getOpeningTimesByExpertId = function getOpeningTimesByExpertId(request, response) {
  var userId, openingTimes;
  return regeneratorRuntime.async(function getOpeningTimesByExpertId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = request.params.userId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(OpeningTimeModel.aggregate([{
            $match: {
              expertId: mongoose.Types.ObjectId(userId)
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'expertId',
              foreignField: '_id',
              as: 'expert'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 4:
          openingTimes = _context3.sent;
          openingTimes.forEach(function (openTime) {
            return openTime.expert = openTime.expert[0];
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            openingTimes: openingTimes
          }));

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getOpeningTimesByExpertIdAndDay = function getOpeningTimesByExpertIdAndDay(request, response) {
  var _request$params, userId, weekday, openingTime;

  return regeneratorRuntime.async(function getOpeningTimesByExpertIdAndDay$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _request$params = request.params, userId = _request$params.userId, weekday = _request$params.weekday;
          _context4.next = 4;
          return regeneratorRuntime.awrap(OpeningTimeModel.find({
            expertId: userId,
            weekday: weekday
          }));

        case 4:
          openingTime = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            openingTime: openingTime
          }));

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var searchOpeningTimes = function searchOpeningTimes(request, response) {
  var _request$query, county, weekday, pipeLine, openingTimes, totalOpeningTimes;

  return regeneratorRuntime.async(function searchOpeningTimes$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _request$query = request.query, county = _request$query.county, weekday = _request$query.weekday;
          pipeLine = [];

          if (weekday) {
            pipeLine.push({
              $match: {
                weekday: weekday
              }
            });
          }

          pipeLine.push({
            $lookup: {
              from: 'leads',
              localField: 'leadId',
              foreignField: '_id',
              as: 'lead'
            }
          });

          if (county) {
            pipeLine.push({
              $match: {
                'lead.county': county
              }
            });
          }

          pipeLine.push({
            $sort: {
              'openingTime.hour': 1
            }
          });
          _context5.next = 9;
          return regeneratorRuntime.awrap(OpeningTimeModel.aggregate(pipeLine));

        case 9:
          openingTimes = _context5.sent;
          totalOpeningTimes = openingTimes.length;
          openingTimes.forEach(function (openTime) {
            return openTime.lead = openTime.lead[0];
          });
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            totalOpeningTimes: totalOpeningTimes,
            openingTimes: openingTimes
          }));

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 19:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var addOpeningTime = function addOpeningTime(request, response) {
  var dataValidation, _request$body, leadId, expertId, weekday, openingTime, closingTime, lead, expert, searchQuery, openingTimeList, openingSplitted, openingHour, openingMinute, closingSplitted, closingHour, closingMinute, counter, openingTimeData, openingTimeObj, newOpeningTime;

  return regeneratorRuntime.async(function addOpeningTime$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          dataValidation = openingTimeValidation.addOpeningTime(request.body);

          if (dataValidation.isAccepted) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body = request.body, leadId = _request$body.leadId, expertId = _request$body.expertId, weekday = _request$body.weekday, openingTime = _request$body.openingTime, closingTime = _request$body.closingTime;

          if (!leadId) {
            _context6.next = 11;
            break;
          }

          _context6.next = 8;
          return regeneratorRuntime.awrap(LeadModel.findById(leadId));

        case 8:
          lead = _context6.sent;

          if (lead) {
            _context6.next = 11;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Lead ID is not registered',
            field: 'leadId'
          }));

        case 11:
          if (!expertId) {
            _context6.next = 17;
            break;
          }

          _context6.next = 14;
          return regeneratorRuntime.awrap(UserModel.findById(expertId));

        case 14:
          expert = _context6.sent;

          if (expert) {
            _context6.next = 17;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Expert ID is not registered',
            field: 'expertId'
          }));

        case 17:
          searchQuery = {};

          if (leadId) {
            searchQuery = {
              leadId: leadId,
              weekday: weekday,
              isActive: true
            };
          } else if (expertId) {
            searchQuery = {
              expertId: expertId,
              weekday: weekday,
              isActive: true
            };
          }

          _context6.next = 21;
          return regeneratorRuntime.awrap(OpeningTimeModel.find(searchQuery));

        case 21:
          openingTimeList = _context6.sent;

          if (!(openingTimeList.length != 0)) {
            _context6.next = 24;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Opening time is already registered',
            field: 'weekday'
          }));

        case 24:
          openingSplitted = openingTime.split(':');
          openingHour = Number.parseInt(openingSplitted[0]);
          openingMinute = Number.parseInt(openingSplitted[1]);
          closingSplitted = closingTime.split(':');
          closingHour = Number.parseInt(closingSplitted[0]);
          closingMinute = Number.parseInt(closingSplitted[1]);
          _context6.next = 32;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'OpeningTime'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 32:
          counter = _context6.sent;
          openingTimeData = {
            leadId: leadId,
            expertId: expertId,
            openingTimeId: counter.value,
            weekday: weekday,
            openingTime: {
              hour: openingHour,
              minute: openingMinute
            },
            closingTime: {
              hour: closingHour,
              minute: closingMinute
            }
          };
          openingTimeObj = new OpeningTimeModel(openingTimeData);
          _context6.next = 37;
          return regeneratorRuntime.awrap(openingTimeObj.save());

        case 37:
          newOpeningTime = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added opening time successfully!',
            openingTime: newOpeningTime
          }));

        case 41:
          _context6.prev = 41;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 45:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 41]]);
};

var updateOpeningTime = function updateOpeningTime(request, response) {
  var dataValidation, openingTimeId, _request$body2, weekday, openingTime, closingTime, openingTimeObj, searchQuery, openingTimeList, openingSplitted, openingHour, openingMinute, closingSplitted, closingHour, closingMinute, openingTimeData, updatedOpeningTime;

  return regeneratorRuntime.async(function updateOpeningTime$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          dataValidation = openingTimeValidation.updateOpeningTime(request.body);

          if (dataValidation.isAccepted) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          openingTimeId = request.params.openingTimeId;
          _request$body2 = request.body, weekday = _request$body2.weekday, openingTime = _request$body2.openingTime, closingTime = _request$body2.closingTime;
          _context7.next = 8;
          return regeneratorRuntime.awrap(OpeningTimeModel.findById(openingTimeId));

        case 8:
          openingTimeObj = _context7.sent;

          if (!(openingTimeObj.weekday != weekday)) {
            _context7.next = 17;
            break;
          }

          searchQuery = {};

          if (openingTimeObj.leadId) {
            searchQuery = {
              leadId: openingTimeObj.leadId,
              weekday: weekday
            };
          } else if (openingTimeObj.clinicId) {
            searchQuery = {
              clinicId: openingTimeObj.clinicId,
              weekday: weekday
            };
          }

          _context7.next = 14;
          return regeneratorRuntime.awrap(OpeningTimeModel.find(searchQuery));

        case 14:
          openingTimeList = _context7.sent;

          if (!(openingTimeList.length != 0)) {
            _context7.next = 17;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Opening time is already registered',
            field: 'weekday'
          }));

        case 17:
          openingSplitted = openingTime.split(':');
          openingHour = Number.parseInt(openingSplitted[0]);
          openingMinute = Number.parseInt(openingSplitted[1]);
          closingSplitted = closingTime.split(':');
          closingHour = Number.parseInt(closingSplitted[0]);
          closingMinute = Number.parseInt(closingSplitted[1]);
          openingTimeData = {
            weekday: weekday,
            openingTime: {
              hour: openingHour,
              minute: openingMinute
            },
            closingTime: {
              hour: closingHour,
              minute: closingMinute
            }
          };
          _context7.next = 26;
          return regeneratorRuntime.awrap(OpeningTimeModel.findByIdAndUpdate(openingTimeId, openingTimeData, {
            "new": true
          }));

        case 26:
          updatedOpeningTime = _context7.sent;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated opening time successfully!',
            openingTime: updatedOpeningTime
          }));

        case 30:
          _context7.prev = 30;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 34:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 30]]);
};

var updateOpeningTimeActivityStatus = function updateOpeningTimeActivityStatus(request, response) {
  var dataValidation, openingTimeId, isActive, updatedOpeningTime;
  return regeneratorRuntime.async(function updateOpeningTimeActivityStatus$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          dataValidation = openingTimeValidation.updateOpeningTimeActivityStatus(request.body);

          if (dataValidation.isAccepted) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          openingTimeId = request.params.openingTimeId;
          isActive = request.body.isActive;
          _context8.next = 8;
          return regeneratorRuntime.awrap(OpeningTimeModel.findByIdAndUpdate(openingTimeId, {
            isActive: isActive
          }, {
            "new": true
          }));

        case 8:
          updatedOpeningTime = _context8.sent;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated opening time successfully!',
            openingTime: updatedOpeningTime
          }));

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

var deleteOpeningTime = function deleteOpeningTime(request, response) {
  var openingTimeId, deletedOpeningTime;
  return regeneratorRuntime.async(function deleteOpeningTime$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          openingTimeId = request.params.openingTimeId;
          _context9.next = 4;
          return regeneratorRuntime.awrap(OpeningTimeModel.findByIdAndDelete(openingTimeId));

        case 4:
          deletedOpeningTime = _context9.sent;
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted opening time successfully!',
            openingTime: deletedOpeningTime
          }));

        case 8:
          _context9.prev = 8;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 12:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = {
  getOpeningTimes: getOpeningTimes,
  getOpeningTimesByLeadId: getOpeningTimesByLeadId,
  getOpeningTimesByExpertId: getOpeningTimesByExpertId,
  getOpeningTimesByExpertIdAndDay: getOpeningTimesByExpertIdAndDay,
  addOpeningTime: addOpeningTime,
  updateOpeningTime: updateOpeningTime,
  updateOpeningTimeActivityStatus: updateOpeningTimeActivityStatus,
  deleteOpeningTime: deleteOpeningTime,
  searchOpeningTimes: searchOpeningTimes
};