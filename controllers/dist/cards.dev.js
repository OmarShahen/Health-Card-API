"use strict";

var CardModel = require('../models/CardModel');

var cardValidation = require('../validations/cards');

var PatientModel = require('../models/PatientModel');

var getCards = function getCards(request, response) {
  var cards;
  return regeneratorRuntime.async(function getCards$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(CardModel.find().sort({
            createdAt: -1
          }));

        case 3:
          cards = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            cards: cards
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

var addCard = function addCard(request, response) {
  var dataValidation, _request$body, cardId, cvc, cardsList, cardData, cardObj, newCard;

  return regeneratorRuntime.async(function addCard$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = cardValidation.addCard(request.body);

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
          _request$body = request.body, cardId = _request$body.cardId, cvc = _request$body.cvc;
          _context2.next = 7;
          return regeneratorRuntime.awrap(CardModel.find({
            cardId: cardId
          }));

        case 7:
          cardsList = _context2.sent;

          if (!(cardsList.length != 0)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'card Id is already registered',
            field: 'cardId'
          }));

        case 10:
          cardData = {
            cardId: cardId,
            cvc: cvc
          };
          cardObj = new CardModel(cardData);
          _context2.next = 14;
          return regeneratorRuntime.awrap(cardObj.save());

        case 14:
          newCard = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added card successfully!',
            card: newCard
          }));

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var updateCardActivity = function updateCardActivity(request, response) {
  var cardId, dataValidation, isActive, updatedCard;
  return regeneratorRuntime.async(function updateCardActivity$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          cardId = request.params.cardId;
          dataValidation = cardValidation.updateCardActivity(request.body);

          if (dataValidation.isAccepted) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          isActive = request.body.isActive;
          _context3.next = 8;
          return regeneratorRuntime.awrap(CardModel.updateOne({
            cardId: cardId
          }, {
            isActive: isActive
          }));

        case 8:
          updatedCard = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated card activity successfully!',
            card: updatedCard
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

var deleteCard = function deleteCard(request, response) {
  var cardId, patientsList, deletedCard;
  return regeneratorRuntime.async(function deleteCard$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          cardId = request.params.cardId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(PatientModel.find({
            cardId: cardId
          }));

        case 4:
          patientsList = _context4.sent;

          if (!(patientsList.length != 0)) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'card Id is registered with patient',
            field: 'cardId'
          }));

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap(CardModel.deleteOne({
            cardId: cardId
          }));

        case 9:
          deletedCard = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted card successfully!',
            card: deletedCard
          }));

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

module.exports = {
  getCards: getCards,
  addCard: addCard,
  updateCardActivity: updateCardActivity,
  deleteCard: deleteCard
};