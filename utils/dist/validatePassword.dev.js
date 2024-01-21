"use strict";

var isPasswordStrong = function isPasswordStrong(password) {
  var minLength = 8;
  var hasUppercase = /[A-Z]/.test(password);
  var hasLowercase = /[a-z]/.test(password);
  var hasNumber = /[0-9]/.test(password);
  var hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  if (password.length < minLength) {
    return {
      isAccepted: false,
      message: 'Weak: Password should be at least 8 characters long'
    };
  } else if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
    return {
      isAccepted: false,
      message: 'Medium: Password should include uppercase, lowercase, numbers, and special characters'
    };
  }

  return {
    isAccepted: true,
    message: 'Strong: Password meets the criteria for a strong password'
  };
};

module.exports = {
  isPasswordStrong: isPasswordStrong
};