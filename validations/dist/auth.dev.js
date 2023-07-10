"use strict";

var validator = require('../utils/utils');

var config = require('../config/config');

var checkSpeciality = function checkSpeciality(specialities) {
  for (var i = 0; i < specialities.length; i++) {
    if (!validator.isObjectId(specialities[i])) {
      return false;
    }
  }

  return true;
};

var checkRoles = function checkRoles(roles) {
  for (var i = 0; i < roles.length; i++) {
    var isValid = false;

    for (var j = 0; j < config.ROLES.length; j++) {
      if (roles[i] == config.ROLES[j]) {
        isValid = true;
        break;
      }
    }

    if (!isValid) {
      return {
        isAccepted: false,
        message: 'roles format is invalid',
        field: 'roles'
      };
    }
  }

  return {
    isAccepted: true,
    message: 'data is valid',
    data: roles
  };
};

var signup = function signup(doctorData) {
  var firstName = doctorData.firstName,
      lastName = doctorData.lastName,
      email = doctorData.email,
      roles = doctorData.roles,
      gender = doctorData.gender,
      dateOfBirth = doctorData.dateOfBirth,
      password = doctorData.password,
      speciality = doctorData.speciality;
  if (!firstName) return {
    isAccepted: false,
    message: 'First name is required',
    field: 'firstName'
  };
  if (!validator.isNameValid(firstName)) return {
    isAccepted: false,
    message: 'Invalid name formate',
    field: 'firstName'
  };
  if (!lastName) return {
    isAccepted: false,
    message: 'Last name is required',
    field: 'lastName'
  };
  if (!validator.isNameValid(lastName)) return {
    isAccepted: false,
    message: 'Invalid name formate',
    field: 'lastName'
  };
  if (!email) return {
    isAccepted: false,
    message: 'Email is required',
    field: 'email'
  };
  if (!validator.isEmailValid(email)) return {
    isAccepted: false,
    message: 'Email formate is invalid',
    field: 'email'
  };
  if (!roles) return {
    isAccepted: false,
    message: 'Roles is required',
    field: 'roles'
  };
  if (!Array.isArray(roles)) return {
    isAccepted: false,
    message: 'Roles must be a list',
    field: 'roles'
  };
  var rolesValidation = checkRoles(roles);
  if (!rolesValidation.isAccepted) return rolesValidation;
  if (!password) return {
    isAccepted: false,
    message: 'Password is required',
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
  if (!dateOfBirth) return {
    isAccepted: false,
    message: 'Date of birth',
    field: 'dateOfBirth'
  };
  if (!validator.isDateValid(dateOfBirth)) return {
    isAccepted: false,
    message: 'Date of birth format is invalid',
    field: 'dateOfBirth'
  };

  if (roles.includes('DOCTOR')) {
    if (!speciality) return {
      isAccepted: false,
      message: 'Speciality is required',
      field: 'speciality'
    };
    if (!Array.isArray(speciality)) return {
      isAccepted: false,
      message: 'Speciality must be a list',
      field: 'speciality'
    };
    if (speciality.length == 0) return {
      isAccepted: false,
      message: 'Speciality must be atleast one',
      field: 'speciality'
    };
  }

  return {
    isAccepted: true,
    message: 'data is valid',
    data: doctorData
  };
};

var login = function login(doctorData) {
  var email = doctorData.email,
      password = doctorData.password;
  if (!email) return {
    isAccepted: false,
    message: 'Email is required',
    field: 'email'
  };
  if (!validator.isEmailValid(email)) return {
    isAccepted: false,
    message: 'Invalid email formate',
    field: 'email'
  };
  if (!password) return {
    isAccepted: false,
    message: 'Password is required',
    field: 'password'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: doctorData
  };
};

var forgotPassword = function forgotPassword(emailData) {
  var email = emailData.email;
  if (!email) return {
    isAccepted: false,
    message: 'Email is required',
    field: 'email'
  };
  if (!validator.isEmailValid(email)) return {
    isAccepted: false,
    message: 'Invalid email format',
    field: 'email'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: emailData
  };
};

var resetPassword = function resetPassword(resetData) {
  var email = resetData.email,
      verificationCode = resetData.verificationCode,
      password = resetData.password;
  if (!email) return {
    isAccepted: false,
    message: 'Email is required',
    field: 'email'
  };
  if (!validator.isEmailValid(email)) return {
    isAccepted: false,
    message: 'Invalid email format',
    field: 'email'
  };
  if (!verificationCode) return {
    isAccepted: false,
    message: 'Verification code is required',
    field: 'verificationCode'
  };
  if (typeof verificationCode != 'number') return {
    isAccepted: false,
    message: 'Invalid verification code format',
    field: 'verificationCode'
  };
  if (!password) return {
    isAccepted: false,
    message: 'Password is required',
    field: 'password'
  };
  if (typeof password != 'string') return {
    isAccepted: false,
    message: 'Invalid password format',
    field: 'password'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: resetData
  };
};

var verifyResetPasswordVerificationCode = function verifyResetPasswordVerificationCode(resetData) {
  var email = resetData.email,
      verificationCode = resetData.verificationCode;
  if (!email) return {
    isAccepted: false,
    message: 'Email is required',
    field: 'email'
  };
  if (!validator.isEmailValid(email)) return {
    isAccepted: false,
    message: 'Invalid email format',
    field: 'email'
  };
  if (!verificationCode) return {
    isAccepted: false,
    message: 'Verification code is required',
    field: 'verificationCode'
  };
  if (typeof verificationCode != 'number') return {
    isAccepted: false,
    message: 'Invalid verification code format',
    field: 'verificationCode'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: resetData
  };
};

var verifyDeleteAccountVerificationCode = function verifyDeleteAccountVerificationCode(verificationData) {
  var verificationCode = verificationData.verificationCode;
  console.log(verificationData);
  if (!verificationCode) return {
    isAccepted: false,
    message: 'Verification code is required',
    field: 'verificationCode'
  };
  if (typeof verificationCode != 'number') return {
    isAccepted: false,
    message: 'Invalid verification code format',
    field: 'verificationCode'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: verificationData
  };
};

var verifyPersonalInfo = function verifyPersonalInfo(verifyData) {
  var firstName = verifyData.firstName,
      lastName = verifyData.lastName;
  if (!firstName) return {
    isAccepted: false,
    message: 'First name is required',
    field: 'firstName'
  };
  if (!validator.isNameValid(firstName)) return {
    isAccepted: false,
    message: 'Invalid name formate',
    field: 'firstName'
  };
  if (!lastName) return {
    isAccepted: false,
    message: 'Last name is required',
    field: 'lastName'
  };
  if (!validator.isNameValid(lastName)) return {
    isAccepted: false,
    message: 'Invalid name formate',
    field: 'lastName'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: verifyData
  };
};

var verifyDemographicInfo = function verifyDemographicInfo(verifyData) {
  var gender = verifyData.gender,
      dateOfBirth = verifyData.dateOfBirth;
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
  if (!dateOfBirth) return {
    isAccepted: false,
    message: 'Date of birth',
    field: 'dateOfBirth'
  };
  if (!validator.isDateValid(dateOfBirth)) return {
    isAccepted: false,
    message: 'Date of birth format is invalid',
    field: 'dateOfBirth'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: verifyData
  };
};

var verifySpecialityInfo = function verifySpecialityInfo(verifyData) {
  var speciality = verifyData.speciality;
  if (!speciality) return {
    isAccepted: false,
    message: 'Speciality is required',
    field: 'speciality'
  };
  if (!Array.isArray(speciality)) return {
    isAccepted: false,
    message: 'Speciality must be a list',
    field: 'speciality'
  };
  if (speciality.length == 0) return {
    isAccepted: false,
    message: 'Speciality must be atleast one',
    field: 'speciality'
  };
  if (!checkSpeciality(speciality)) return {
    isAccepted: false,
    message: 'Invalid speciality format',
    field: 'speciality'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: verifyData
  };
};

var addUserEmailVerificationCode = function addUserEmailVerificationCode(userVerificationData) {
  var userId = userVerificationData.userId,
      email = userVerificationData.email;
  if (!userId) return {
    isAccepted: false,
    message: 'User Id is required',
    field: 'userId'
  };
  if (!validator.isObjectId(userId)) return {
    isAccepted: false,
    message: 'User Id format is invalid',
    field: 'userId'
  };
  if (!email) return {
    isAccepted: false,
    message: 'Email is required',
    field: 'email'
  };
  if (!validator.isEmailValid(email)) return {
    isAccepted: false,
    message: 'Email format is invalid',
    field: 'email'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: userVerificationData
  };
};

module.exports = {
  signup: signup,
  login: login,
  verifyPersonalInfo: verifyPersonalInfo,
  verifyDemographicInfo: verifyDemographicInfo,
  verifySpecialityInfo: verifySpecialityInfo,
  addUserEmailVerificationCode: addUserEmailVerificationCode,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
  verifyResetPasswordVerificationCode: verifyResetPasswordVerificationCode,
  verifyDeleteAccountVerificationCode: verifyDeleteAccountVerificationCode
};