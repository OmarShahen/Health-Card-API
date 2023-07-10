"use strict";

var utils = require('../utils/utils');

var addCard = function addCard(cardData) {
  var cardId = cardData.cardId,
      cvc = cardData.cvc;
  if (!cardId) return {
    isAccepted: false,
    message: 'card Id is required',
    field: 'cardId'
  };
  if (typeof cardId != 'number') return {
    isAccepted: false,
    message: 'card Id format is invalid',
    field: 'cardId'
  };
  if (!cvc) return {
    isAccepted: false,
    message: 'cvc is required',
    field: 'cvc'
  };
  if (typeof cvc != 'number') return {
    isAccepted: false,
    message: 'cvc format is invalid',
    field: 'cvc'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: cardData
  };
};

var updateCardActivity = function updateCardActivity(cardData) {
  var isActive = cardData.isActive;
  if (typeof isActive != 'boolean') return {
    isAccepted: false,
    message: 'isActive is required',
    field: 'isActive'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: cardData
  };
};

module.exports = {
  addCard: addCard,
  updateCardActivity: updateCardActivity
};