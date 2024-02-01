"use strict";

var utils = require('../utils/utils');

var config = require('../config/config');

var addExpert = function addExpert(expertData) {
  var firstName = expertData.firstName,
      email = expertData.email,
      countryCode = expertData.countryCode,
      phone = expertData.phone,
      password = expertData.password,
      gender = expertData.gender;
  if (!firstName) return {
    isAccepted: false,
    message: 'Name is required',
    field: 'firstName'
  };
  if (!utils.isNameValid(firstName)) return {
    isAccepted: false,
    message: 'Invalid name format',
    field: 'firstName'
  };
  if (!email) return {
    isAccepted: false,
    message: 'Email is required',
    field: 'email'
  };
  if (!utils.isEmailValid(email)) return {
    isAccepted: false,
    message: 'Email formate is invalid',
    field: 'email'
  };
  if (!countryCode) return {
    isAccepted: false,
    message: 'Country code is required',
    field: 'countryCode'
  };
  if (typeof countryCode != 'number') return {
    isAccepted: false,
    message: 'Country code format is invalid',
    field: 'countryCode'
  };
  if (!phone) return {
    isAccepted: false,
    message: 'Phone is required',
    field: 'phone'
  };
  if (typeof phone != 'number') return {
    isAccepted: false,
    message: 'Phone format is invalid',
    field: 'phone'
  };
  if (!password) return {
    isAccepted: false,
    message: 'Password is required',
    field: 'password'
  };
  var validatedPassword = utils.isPasswordStrong(password);
  if (!validatedPassword.isAccepted) return {
    isAccepted: false,
    message: validatedPassword.message,
    field: 'password'
  };
  if (!gender) return {
    isAccepted: false,
    message: 'Gender is required',
    field: 'gender'
  };
  if (!config.GENDER.includes(gender)) return {
    isAccepted: false,
    message: 'Invalid gender',
    field: 'gender'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: expertData
  };
};

var addBankInfo = function addBankInfo(expertData) {
  var accountNumber = expertData.accountNumber,
      accountHolderName = expertData.accountHolderName,
      bankName = expertData.bankName;
  if (!accountNumber) return {
    isAccepted: false,
    message: 'Account number is required',
    field: 'accountNumber'
  };
  if (typeof accountNumber != 'number') return {
    isAccepted: false,
    message: 'Account number format is invalid',
    field: 'accountNumber'
  };
  if (!accountHolderName) return {
    isAccepted: false,
    message: 'Account holder name is required',
    field: 'accountHolderName'
  };
  if (typeof accountHolderName != 'string') return {
    isAccepted: false,
    message: 'Invalid account holder name format',
    field: 'accountHolderName'
  };
  if (!bankName) return {
    isAccepted: false,
    message: 'Bank name is required',
    field: 'bankName'
  };
  if (typeof bankName != 'string') return {
    isAccepted: false,
    message: 'Invalid bank name format',
    field: 'bankName'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: expertData
  };
};

var addMobileWalletInfo = function addMobileWalletInfo(expertData) {
  var walletNumber = expertData.walletNumber;
  if (!walletNumber) return {
    isAccepted: false,
    message: 'Wallet number is required',
    field: 'walletNumber'
  };
  if (typeof walletNumber != 'string') return {
    isAccepted: false,
    message: 'Wallet number format is invalid',
    field: 'walletNumber'
  };
  if (!utils.isPhoneValid(walletNumber)) return {
    isAccepted: false,
    message: 'Wallet phone number format is invalid',
    field: 'walletNumber'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: expertData
  };
};

var updateExpertOnBoarding = function updateExpertOnBoarding(expertData) {
  var isOnBoarded = expertData.isOnBoarded;
  if (typeof isOnBoarded != 'boolean') return {
    isAccepted: false,
    message: 'OnBoarded format is invalid',
    field: 'isOnBoarded'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: expertData
  };
};

module.exports = {
  addExpert: addExpert,
  addBankInfo: addBankInfo,
  addMobileWalletInfo: addMobileWalletInfo,
  updateExpertOnBoarding: updateExpertOnBoarding
};