"use strict";

var isNameValid = function isNameValid(username) {
  var invalidChars = "0123456789~!@#$%^&*()_=+|][{};:<>/";
  if (typeof username != 'string') return false;

  for (var i = 0; i < invalidChars.length; i++) {
    for (var j = 0; j < username.length; j++) {
      if (invalidChars[i] == username[j]) {
        return false;
      }
    }
  }

  return true;
};

module.exports = {
  isNameValid: isNameValid
};