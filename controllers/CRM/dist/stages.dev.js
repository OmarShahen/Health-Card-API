"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var StageModel = require('../../models/CRM/StageModel');

var LeadModel = require('../../models/CRM/LeadModel');

var CounterModel = require('../../models/CounterModel');

var stageValidation = require('../../validations/CRM/stages');

var utils = require('../../utils/utils');

var getStages = function getStages(request, response) {
  var _utils$statsQueryGene, searchQuery, stages;

  return regeneratorRuntime.async(function getStages$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context.next = 4;
          return regeneratorRuntime.awrap(StageModel.aggregate([{
            $match: searchQuery
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
          stages = _context.sent;
          stages.forEach(function (stage) {
            return stage.lead = stage.lead[0];
          });
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            stages: stages
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

var getStagesByLeadId = function getStagesByLeadId(request, response) {
  var leadId, _utils$statsQueryGene2, searchQuery, stages;

  return regeneratorRuntime.async(function getStagesByLeadId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          leadId = request.params.leadId;
          _utils$statsQueryGene2 = utils.statsQueryGenerator('leadId', leadId, request.query), searchQuery = _utils$statsQueryGene2.searchQuery;
          _context2.next = 5;
          return regeneratorRuntime.awrap(StageModel.aggregate([{
            $match: searchQuery
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

        case 5:
          stages = _context2.sent;
          stages.forEach(function (stage) {
            return stage.lead = stage.lead[0];
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            stages: stages
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

var addStage = function addStage(request, response) {
  var dataValidation, leadId, lead, counter, stageData, stageObj, newStage;
  return regeneratorRuntime.async(function addStage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = stageValidation.addStage(request.body);

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
          leadId = request.body.leadId;
          _context3.next = 7;
          return regeneratorRuntime.awrap(LeadModel.findById(leadId));

        case 7:
          lead = _context3.sent;

          if (lead) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Lead ID is not registered',
            field: 'leadId'
          }));

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'Stage'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 12:
          counter = _context3.sent;
          stageData = _objectSpread({
            stageId: counter.value
          }, request.body);
          stageObj = new StageModel(stageData);
          _context3.next = 17;
          return regeneratorRuntime.awrap(stageObj.save());

        case 17:
          newStage = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Stage is added successfully!',
            stage: newStage
          }));

        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 25:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var updateStage = function updateStage(request, response) {
  var dataValidation, stageId, _request$body, stage, note, updatedStage;

  return regeneratorRuntime.async(function updateStage$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          dataValidation = stageValidation.updateStage(request.body);

          if (dataValidation.isAccepted) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          stageId = request.params.stageId;
          _request$body = request.body, stage = _request$body.stage, note = _request$body.note;
          _context4.next = 8;
          return regeneratorRuntime.awrap(StageModel.findByIdAndUpdate(stageId, {
            stage: stage,
            note: note
          }, {
            "new": true
          }));

        case 8:
          updatedStage = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Stage is updated successfully!',
            stage: updatedStage
          }));

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

var deleteStage = function deleteStage(request, response) {
  var stageId, deletedStage;
  return regeneratorRuntime.async(function deleteStage$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          stageId = request.params.stageId;
          _context5.next = 4;
          return regeneratorRuntime.awrap(StageModel.findByIdAndDelete(stageId));

        case 4:
          deletedStage = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted stage successfully!',
            stage: deletedStage
          }));

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = {
  getStages: getStages,
  getStagesByLeadId: getStagesByLeadId,
  addStage: addStage,
  updateStage: updateStage,
  deleteStage: deleteStage
};