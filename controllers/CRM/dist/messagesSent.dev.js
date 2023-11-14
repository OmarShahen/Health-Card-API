"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var MessageSentModel = require('../../models/CRM/MessageSentModel');

var MessageTemplateModel = require('../../models/CRM/MessageTemplateModel');

var LeadModel = require('../../models/CRM/LeadModel');

var CounterModel = require('../../models/CounterModel');

var messageSentValidation = require('../../validations/CRM/messagesSent');

var utils = require('../../utils/utils');

var getMessagesSent = function getMessagesSent(request, response) {
  var _utils$statsQueryGene, searchQuery, messagesSent;

  return regeneratorRuntime.async(function getMessagesSent$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context.next = 4;
          return regeneratorRuntime.awrap(MessageSentModel.aggregate([{
            $match: searchQuery
          }, {
            $lookup: {
              from: 'leads',
              localField: 'leadId',
              foreignField: '_id',
              as: 'lead'
            }
          }, {
            $lookup: {
              from: 'messagetemplates',
              localField: 'messageTemplateId',
              foreignField: '_id',
              as: 'messageTemplate'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 4:
          messagesSent = _context.sent;
          messagesSent.forEach(function (message) {
            message.lead = message.lead[0];
            message.messageTemplate = message.messageTemplate[0];
          });
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            messagesSent: messagesSent
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

var addMessageSent = function addMessageSent(request, response) {
  var dataValidation, _request$body, leadId, messageTemplateId, leadPromise, messageTemplatePromise, _ref, _ref2, lead, messageTemplate, counter, messageSentData, messageSentObj, newMessageSent;

  return regeneratorRuntime.async(function addMessageSent$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = messageSentValidation.addMessageSent(request.body);

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
          _request$body = request.body, leadId = _request$body.leadId, messageTemplateId = _request$body.messageTemplateId;
          leadPromise = LeadModel.findById(leadId);
          messageTemplatePromise = MessageTemplateModel.findById(messageTemplateId);
          _context2.next = 9;
          return regeneratorRuntime.awrap(Promise.all([leadPromise, messageTemplatePromise]));

        case 9:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 2);
          lead = _ref2[0];
          messageTemplate = _ref2[1];

          if (lead) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Lead ID is not registered',
            field: 'leadId'
          }));

        case 15:
          if (messageTemplate) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Message template ID is not registered',
            field: 'messageTemplateId'
          }));

        case 17:
          _context2.next = 19;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'MessageSent'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 19:
          counter = _context2.sent;
          messageSentData = _objectSpread({
            messageSentId: counter.value
          }, request.body);
          messageSentObj = new MessageSentModel(messageSentData);
          _context2.next = 24;
          return regeneratorRuntime.awrap(messageSentObj.save());

        case 24:
          newMessageSent = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Message Sent is created successfully!',
            messageSent: newMessageSent
          }));

        case 28:
          _context2.prev = 28;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 32:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 28]]);
};

var deleteMessageSent = function deleteMessageSent(request, response) {
  var messageSentId, deletedMessageSent;
  return regeneratorRuntime.async(function deleteMessageSent$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          messageSentId = request.params.messageSentId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(MessageSentModel.findByIdAndDelete(messageSentId));

        case 4:
          deletedMessageSent = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted message sent successfully!',
            messageSent: deletedMessageSent
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

var updateMessageSentCTA = function updateMessageSentCTA(request, response) {
  var dataValidation, messageSentId, isCTADone, updatedMessageSent;
  return regeneratorRuntime.async(function updateMessageSentCTA$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          dataValidation = messageSentValidation.updateMessageSentCTA(request.body);

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
          messageSentId = request.params.messageSentId;
          isCTADone = request.body.isCTADone;
          _context4.next = 8;
          return regeneratorRuntime.awrap(MessageSentModel.findByIdAndUpdate(messageSentId, {
            isCTADone: isCTADone
          }, {
            "new": true
          }));

        case 8:
          updatedMessageSent = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Message Sent CTA is updated successfully!',
            messageSent: updatedMessageSent
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

var updateMessageSentOpen = function updateMessageSentOpen(request, response) {
  var dataValidation, messageSentId, _request$body2, isOpened, openedDate, updatedMessageSent;

  return regeneratorRuntime.async(function updateMessageSentOpen$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          dataValidation = messageSentValidation.updateMessageSentOpen(request.body);

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
          messageSentId = request.params.messageSentId;
          _request$body2 = request.body, isOpened = _request$body2.isOpened, openedDate = _request$body2.openedDate;
          _context5.next = 8;
          return regeneratorRuntime.awrap(MessageSentModel.findByIdAndUpdate(messageSentId, {
            isOpened: isOpened,
            openedDate: openedDate
          }, {
            "new": true
          }));

        case 8:
          updatedMessageSent = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Message Sent open is updated successfully!',
            messageSent: updatedMessageSent
          }));

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

var updateMessageSentRespond = function updateMessageSentRespond(request, response) {
  var dataValidation, messageSentId, _request$body3, isResponded, respondedDate, updatedMessageSent;

  return regeneratorRuntime.async(function updateMessageSentRespond$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          dataValidation = messageSentValidation.updateMessageSentRespond(request.body);

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
          messageSentId = request.params.messageSentId;
          _request$body3 = request.body, isResponded = _request$body3.isResponded, respondedDate = _request$body3.respondedDate;
          _context6.next = 8;
          return regeneratorRuntime.awrap(MessageSentModel.findByIdAndUpdate(messageSentId, {
            isResponded: isResponded,
            respondedDate: respondedDate
          }, {
            "new": true
          }));

        case 8:
          updatedMessageSent = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Message Sent respond is updated successfully!',
            messageSent: updatedMessageSent
          }));

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

module.exports = {
  getMessagesSent: getMessagesSent,
  addMessageSent: addMessageSent,
  deleteMessageSent: deleteMessageSent,
  updateMessageSentCTA: updateMessageSentCTA,
  updateMessageSentOpen: updateMessageSentOpen,
  updateMessageSentRespond: updateMessageSentRespond
};