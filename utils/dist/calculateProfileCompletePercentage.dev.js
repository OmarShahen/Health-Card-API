"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var calculateExpertProfileCompletePercentage = function calculateExpertProfileCompletePercentage(userProfile) {
  var missingFields = [];
  var requiredFields = ['firstName', 'email', 'profileImageURL', 'phone', 'dateOfBirth', 'gender', 'title', 'description'];
  var totalFields = requiredFields.length + 4;
  var completedFields = 0;

  for (var _i = 0, _requiredFields = requiredFields; _i < _requiredFields.length; _i++) {
    var field = _requiredFields[_i];

    if (userProfile[field]) {
      completedFields++;
    } else {
      missingFields.push(field);
    }
  }

  if (userProfile.speciality && userProfile.speciality.length <= 1) {
    completedFields++;
  } else {
    missingFields.push('speciality');
  }

  if (userProfile.subSpeciality && userProfile.subSpeciality.length <= 1) {
    completedFields++;
  } else {
    missingFields.push('subSpeciality');
  }

  if (userProfile.pricing && userProfile.pricing.length <= 2) {
    completedFields++;
  } else {
    missingFields.push('pricing');
  }

  var _userProfile$paymentI = userProfile.paymentInfo,
      bankAccount = _userProfile$paymentI.bankAccount,
      mobileWallet = _userProfile$paymentI.mobileWallet;

  if (bankAccount.accountNumber || mobileWallet.walletNumber) {
    completedFields++;
  } else {
    missingFields.push('paymentInfo');
  }

  requiredFields = [].concat(_toConsumableArray(requiredFields), ['speciality', 'subSpeciality', 'pricing', 'paymentInfo']);
  var completionPercentage = completedFields / totalFields * 100;
  return {
    completionPercentage: Number.parseInt(completionPercentage.toFixed(0)),
    requiredFields: requiredFields,
    missingFields: missingFields
  };
};

module.exports = {
  calculateExpertProfileCompletePercentage: calculateExpertProfileCompletePercentage
};