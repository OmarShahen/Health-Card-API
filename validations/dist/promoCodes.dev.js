"use strict";

var utils = require('../utils/utils');

var addPromoCode = function addPromoCode(promoCodeData) {
  var code = promoCodeData.code,
      percentage = promoCodeData.percentage,
      maxUsage = promoCodeData.maxUsage,
      userMaxUsage = promoCodeData.userMaxUsage,
      expirationDate = promoCodeData.expirationDate;
  if (!code) return {
    isAccepted: false,
    message: 'Code is required',
    field: 'code'
  };
  if (typeof code != 'string') return {
    isAccepted: false,
    message: 'Invalid code format',
    field: 'code'
  };
  if (typeof percentage != 'number') return {
    isAccepted: false,
    message: 'Percentage format is invalid',
    field: 'percentage'
  };
  if (percentage > 1) return {
    isAccepted: false,
    message: 'Percentage is higher than 1',
    field: 'percentage'
  };
  if (typeof maxUsage != 'number') return {
    isAccepted: false,
    message: 'Max usage format is invalid',
    field: 'maxUsage'
  };
  if (typeof userMaxUsage != 'number') return {
    isAccepted: false,
    message: 'User max usage format is invalid',
    field: 'userMaxUsage'
  };
  if (expirationDate && !utils.isDateValid(expirationDate)) return {
    isAccepted: false,
    message: 'Expiration date format is invalid',
    field: 'expirationDate'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: promoCodeData
  };
};

var updatePromoCode = function updatePromoCode(promoCodeData) {
  var code = promoCodeData.code,
      percentage = promoCodeData.percentage,
      maxUsage = promoCodeData.maxUsage,
      userMaxUsage = promoCodeData.userMaxUsage,
      expirationDate = promoCodeData.expirationDate;
  if (!code) return {
    isAccepted: false,
    message: 'Code is required',
    field: 'code'
  };
  if (typeof code != 'string') return {
    isAccepted: false,
    message: 'Invalid code format',
    field: 'code'
  };
  if (typeof percentage != 'number') return {
    isAccepted: false,
    message: 'Percentage format is invalid',
    field: 'percentage'
  };
  if (percentage > 1) return {
    isAccepted: false,
    message: 'Percentage is higher than 1',
    field: 'percentage'
  };
  if (typeof maxUsage != 'number') return {
    isAccepted: false,
    message: 'Max usage format is invalid',
    field: 'maxUsage'
  };
  if (typeof userMaxUsage != 'number') return {
    isAccepted: false,
    message: 'User max usage format is invalid',
    field: 'userMaxUsage'
  };
  if (expirationDate && !utils.isDateValid(expirationDate)) return {
    isAccepted: false,
    message: 'Expiration date format is invalid',
    field: 'expirationDate'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: promoCodeData
  };
};

var updatePromoCodeActivity = function updatePromoCodeActivity(promoCodeData) {
  var isActive = promoCodeData.isActive;
  if (typeof isActive != 'boolean') return {
    isAccepted: false,
    message: 'isActive format is invalid',
    field: 'isActive'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: promoCodeData
  };
};

module.exports = {
  addPromoCode: addPromoCode,
  updatePromoCodeActivity: updatePromoCodeActivity,
  updatePromoCode: updatePromoCode
};