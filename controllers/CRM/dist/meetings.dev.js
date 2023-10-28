"use strict";

var MeetingModel = require('../../models/CRM/MeetingModel');

var LeadModel = require('../../models/CRM/LeadModel');

var CounterModel = require('../../models/CounterModel');

var meetingsValidation = require('../../validations/CRM/meetings');

var utils = require('../../utils/utils');

var getMeetings = function getMeetings(request, response) {
  var _utils$statsQueryGene, searchQuery, meetings;

  return regeneratorRuntime.async(function getMeetings$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context.next = 4;
          return regeneratorRuntime.awrap(MeetingModel.aggregate([{
            $match: searchQuery
          }, {
            $lookup: {
              from: 'leads',
              localField: 'leadId',
              foreignField: '_id',
              as: 'lead'
            }
          }]));

        case 4:
          meetings = _context.sent;
          meetings.forEach(function (meeting) {
            return meeting.lead = meeting.lead[0];
          });
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            meetings: meetings
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

var addMeeting = function addMeeting(request, response) {
  var dataValidation, _request$body, leadId, status, reservationTime, lead, counter, meetingData, meetingObj, newMeeting;

  return regeneratorRuntime.async(function addMeeting$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = meetingsValidation.addMeeting(request.body);

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
          _request$body = request.body, leadId = _request$body.leadId, status = _request$body.status, reservationTime = _request$body.reservationTime;
          _context2.next = 7;
          return regeneratorRuntime.awrap(LeadModel.findById(leadId));

        case 7:
          lead = _context2.sent;

          if (lead) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Lead ID does not exist',
            field: 'leadId'
          }));

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'meeting'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 12:
          counter = _context2.sent;
          meetingData = {
            meetingId: counter.value,
            leadId: leadId,
            status: status,
            reservationTime: reservationTime
          };
          meetingObj = new MeetingModel(meetingData);
          _context2.next = 17;
          return regeneratorRuntime.awrap(meetingObj.save());

        case 17:
          newMeeting = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added new meeting successfully!',
            meeting: newMeeting
          }));

        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var updateMeetingStatus = function updateMeetingStatus(request, response) {
  var dataValidation, meetingId, status, updatedMeeting;
  return regeneratorRuntime.async(function updateMeetingStatus$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = meetingsValidation.updateMeetingStatus(request.body);

          if (dataValidation.isAccepted) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          meetingId = request.params.meetingId;
          status = request.body.status;
          _context3.next = 8;
          return regeneratorRuntime.awrap(MeetingModel.findByIdAndUpdate(meetingId, {
            status: status
          }, {
            "new": true
          }));

        case 8:
          updatedMeeting = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated meeting successfully!',
            meeting: updatedMeeting
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

var deleteMeeting = function deleteMeeting(request, response) {
  var meetingId, deletedMeeting;
  return regeneratorRuntime.async(function deleteMeeting$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          meetingId = request.params.meetingId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(MeetingModel.findByIdAndDelete(meetingId));

        case 4:
          deletedMeeting = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted meeting successfully!',
            meeting: deletedMeeting
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

module.exports = {
  getMeetings: getMeetings,
  addMeeting: addMeeting,
  updateMeetingStatus: updateMeetingStatus,
  deleteMeeting: deleteMeeting
};