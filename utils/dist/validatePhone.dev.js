"use strict";

var isPhoneValid = function isPhoneValid(phoneNumber) {
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 11;
  var numbers = '0123456789';

  if (max && phoneNumber.length != max) {
    return false;
  }

  for (var i = 0; i < phoneNumber.length; i++) {
    var found = false;

    for (var j = 0; j < numbers.length; j++) {
      if (phoneNumber[i] == numbers[j]) {
        found = true;
        break;
      }
    }

    if (found == false) {
      return false;
    }
  }

  return true;
};

module.exports = {
  isPhoneValid: isPhoneValid
};