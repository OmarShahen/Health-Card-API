"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MessageTemplateModel = require('../../models/CRM/MessageTemplateModel');

var CounterModel = require('../../models/CounterModel');

var MessageTemplateValidation = require('../../validations/CRM/messagesTemplates');

var utils = require('../../utils/utils');

var getMessagesTemplates = function getMessagesTemplates(request, response) {
  var _utils$statsQueryGene, searchQuery, messagesTemplates;

  return regeneratorRuntime.async(function getMessagesTemplates$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context.next = 4;
          return regeneratorRuntime.awrap(MessageTemplateModel.find(searchQuery).sort({
            createdAt: -1
          }));

        case 4:
          messagesTemplates = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            messagesTemplates: messagesTemplates
          }));

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var addMessageTemplate = function addMessageTemplate(request, response) {
  var dataValidation, _request$body, name, category, messageTemplateList, counter, messageTemplateData, messageTemplateObj, newMessageTemplate;

  return regeneratorRuntime.async(function addMessageTemplate$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = MessageTemplateValidation.addMessageTemplate(request.body);

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
          _request$body = request.body, name = _request$body.name, category = _request$body.category;
          _context2.next = 7;
          return regeneratorRuntime.awrap(MessageTemplateModel.find({
            name: name,
            category: category
          }));

        case 7:
          messageTemplateList = _context2.sent;

          if (!(messageTemplateList.length != 0)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Name is already registered',
            field: 'name'
          }));

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'MessageTemplate'
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
          messageTemplateData = _objectSpread({
            messageTemplateId: counter.value
          }, request.body);
          messageTemplateObj = new MessageTemplateModel(messageTemplateData);
          _context2.next = 17;
          return regeneratorRuntime.awrap(messageTemplateObj.save());

        case 17:
          newMessageTemplate = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Message template is added successfully!',
            messageTemplate: newMessageTemplate
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

var updateMessageTemplate = function updateMessageTemplate(request, response) {
  var dataValidation, messageTemplateId, _request$body2, name, category, messageTemplate, messageTemplateList, updatedMessageTemplate;

  return regeneratorRuntime.async(function updateMessageTemplate$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = MessageTemplateValidation.updateMessageTemplate(request.body);

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
          messageTemplateId = request.params.messageTemplateId;
          _request$body2 = request.body, name = _request$body2.name, category = _request$body2.category;
          _context3.next = 8;
          return regeneratorRuntime.awrap(MessageTemplateModel.findById(messageTemplateId));

        case 8:
          messageTemplate = _context3.sent;

          if (!(messageTemplate.name != name)) {
            _context3.next = 15;
            break;
          }

          _context3.next = 12;
          return regeneratorRuntime.awrap(MessageTemplateModel.find({
            name: name,
            category: category
          }));

        case 12:
          messageTemplateList = _context3.sent;

          if (!(messageTemplateList.length != 0)) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Name is already registered',
            field: 'name'
          }));

        case 15:
          _context3.next = 17;
          return regeneratorRuntime.awrap(MessageTemplateModel.findByIdAndUpdate(messageTemplateId, request.body, {
            "new": true
          }));

        case 17:
          updatedMessageTemplate = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Message template is updated successfully!',
            messageTemplate: updatedMessageTemplate
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

var deleteMessageTemplate = function deleteMessageTemplate(request, response) {
  var messageTemplateId, deletedMessageTemplate;
  return regeneratorRuntime.async(function deleteMessageTemplate$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          messageTemplateId = request.params.messageTemplateId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(MessageTemplateModel.findByIdAndDelete(messageTemplateId));

        case 4:
          deletedMessageTemplate = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted message template successfully!',
            messageTemplate: deletedMessageTemplate
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
  getMessagesTemplates: getMessagesTemplates,
  addMessageTemplate: addMessageTemplate,
  updateMessageTemplate: updateMessageTemplate,
  deleteMessageTemplate: deleteMessageTemplate
};