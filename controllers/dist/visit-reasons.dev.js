"use strict";

var VisitReasonModel = require('../models/VisitReasonModel');

var CounterModel = require('../models/CounterModel');

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
  var dataValidation, _request$body, name, description, nameList, counter, visitReasonData, visitReasonObj, newVisitReason;

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
          _request$body = request.body, name = _request$body.name, description = _request$body.description;
          _context2.next = 7;
          return regeneratorRuntime.awrap(VisitReasonModel.find({
            name: name
          }));

        case 7:
          nameList = _context2.sent;

          if (!(nameList.length != 0)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'visit reason name is already registered',
            field: 'name'
          }));

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'visitReason'
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
          visitReasonData = {
            visitReasonId: counter.value,
            name: name,
            description: description
          };
          visitReasonObj = new VisitReasonModel(visitReasonData);
          _context2.next = 17;
          return regeneratorRuntime.awrap(visitReasonObj.save());

        case 17:
          newVisitReason = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'added visit reason successfully!',
            visitReason: newVisitReason
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

var deleteVisitReason = function deleteVisitReason(request, response) {
  var visitReasonId, deletedVisitReason;
  return regeneratorRuntime.async(function deleteVisitReason$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          visitReasonId = request.params.visitReasonId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(VisitReasonModel.findByIdAndDelete(visitReasonId));

        case 4:
          deletedVisitReason = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'deleted visit reason successfully!',
            visitReason: deletedVisitReason
          }));

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var deleteVisitReasons = function deleteVisitReasons(request, response) {
  var deletedVisitReasons;
  return regeneratorRuntime.async(function deleteVisitReasons$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(VisitReasonModel.deleteMany({}));

        case 3:
          deletedVisitReasons = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'deleted all records successfully!',
            noOfDeletedRecords: deletedVisitReasons.deletedCount
          }));

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var updateVisitReason = function updateVisitReason(request, response) {
  var dataValidation, visitReasonId, _request$body2, name, description, visitReason, nameList, visitReasonData, updatedVisitReason;

  return regeneratorRuntime.async(function updateVisitReason$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          dataValidation = visitReasonValidation.updateVisitReason(request.body);

          if (dataValidation.isAccepted) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          visitReasonId = request.params.visitReasonId;
          _request$body2 = request.body, name = _request$body2.name, description = _request$body2.description;
          _context5.next = 8;
          return regeneratorRuntime.awrap(VisitReasonModel.findById(visitReasonId));

        case 8:
          visitReason = _context5.sent;

          if (!(name != visitReason.name)) {
            _context5.next = 15;
            break;
          }

          _context5.next = 12;
          return regeneratorRuntime.awrap(VisitReasonModel.find({
            name: name
          }));

        case 12:
          nameList = _context5.sent;

          if (!(nameList.length != 0)) {
            _context5.next = 15;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'visit reason name is already registered',
            field: 'name'
          }));

        case 15:
          visitReasonData = {
            name: name,
            description: description
          };
          _context5.next = 18;
          return regeneratorRuntime.awrap(VisitReasonModel.findByIdAndUpdate(visitReasonId, visitReasonData, {
            "new": true
          }));

        case 18:
          updatedVisitReason = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'updated visit reason successfully!',
            visitReason: updatedVisitReason
          }));

        case 22:
          _context5.prev = 22;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 26:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

module.exports = {
  getVisitReasons: getVisitReasons,
  addVisitReason: addVisitReason,
  deleteVisitReason: deleteVisitReason,
  deleteVisitReasons: deleteVisitReasons,
  updateVisitReason: updateVisitReason
};