"use strict";

var config = require('../config/config');

var utils = require('../utils/utils');

var checkSpeciality = function checkSpeciality(specialities) {
  for (var i = 0; i < specialities.length; i++) {
    if (!utils.isObjectId(specialities[i])) {
      return false;
    }
  }

  return true;
};

var updateUserMainData = function updateUserMainData(userData) {
  var firstName = userData.firstName,
      phone = userData.phone,
      gender = userData.gender,
      dateOfBirth = userData.dateOfBirth;
  if (firstName && !utils.isNameValid(firstName)) return {
    isAccepted: false,
    message: 'Invalid name formate',
    field: 'firstName'
  };
  if (phone && typeof phone != 'number') return {
    isAccepted: false,
    message: 'Invalid phone format',
    field: 'phone'
  };
  if (gender && !config.GENDER.includes(gender)) return {
    isAccepted: false,
    message: 'Invalid gender',
    field: 'gender'
  };
  if (dateOfBirth && !utils.isDateValid(dateOfBirth)) return {
    isAccepted: false,
    message: 'Date of birth format is invalid',
    field: 'dateOfBirth'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: userData
  };
};

var updateUserProfileImage = function updateUserProfileImage(userData) {
  var profileImageURL = userData.profileImageURL;
  if (!profileImageURL) return {
    isAccepted: false,
    message: 'Image URL is required',
    field: 'profileImageURL'
  };
  if (!utils.isValidURL(profileImageURL)) return {
    isAccepted: false,
    message: 'Image URL format is invalid',
    field: 'profileImageURL'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: userData
  };
};

var updateUserVisibility = function updateUserVisibility(userData) {
  var isShow = userData.isShow;
  if (typeof isShow != 'boolean') return {
    isAccepted: false,
    message: 'Invalid isShow format',
    field: 'isShow'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: userData
  };
};

var updateUserBlocked = function updateUserBlocked(userData) {
  var isBlocked = userData.isBlocked;
  if (typeof isBlocked != 'boolean') return {
    isAccepted: false,
    message: 'Invalid isBlocked format',
    field: 'isBlocked'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: userData
  };
};

var updateUserActivation = function updateUserActivation(userData) {
  var isDeactivated = userData.isDeactivated;
  if (typeof isDeactivated != 'boolean') return {
    isAccepted: false,
    message: 'Invalid isDeactivated format',
    field: 'isDeactivated'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: userData
  };
};

var updateUserSpeciality = function updateUserSpeciality(userData) {
  var speciality = userData.speciality;
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
    data: userData
  };
};

var updateUserEmail = function updateUserEmail(userData) {
  var email = userData.email;
  if (!email) return {
    isAccepted: false,
    message: 'email is required',
    field: 'email'
  };
  if (!utils.isEmailValid(email)) return {
    isAccepted: false,
    message: 'invalid email formate',
    field: 'email'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: userData
  };
};

var updateUserLanguage = function updateUserLanguage(userData) {
  var lang = userData.lang;
  if (!lang) return {
    isAccepted: false,
    message: 'language is required',
    field: 'lang'
  };
  if (!config.LANGUAGES.includes(lang)) return {
    isAccepted: false,
    message: 'invalid lang format',
    field: 'lang'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: userData
  };
};

var updateUserPassword = function updateUserPassword(userData) {
  var password = userData.password;
  if (!password) return {
    isAccepted: false,
    message: 'password is required',
    field: 'password'
  };
  if (typeof password != 'string') return {
    isAccepted: false,
    message: 'invalid password formate',
    field: 'password'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: userData
  };
};

var verifyAndUpdateUserPassword = function verifyAndUpdateUserPassword(userData) {
  var newPassword = userData.newPassword,
      currentPassword = userData.currentPassword;
  if (!newPassword) return {
    isAccepted: false,
    message: 'new password is required',
    field: 'newPassword'
  };
  if (typeof newPassword != 'string') return {
    isAccepted: false,
    message: 'invalid new password format',
    field: 'newPassword'
  };
  if (!currentPassword) return {
    isAccepted: false,
    message: 'current password is required',
    field: 'currentPassword'
  };
  if (typeof currentPassword != 'string') return {
    isAccepted: false,
    message: 'invalid current password format',
    field: 'currentPassword'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: userData
  };
};

var addEmployeeUser = function addEmployeeUser(userData) {
  var firstName = userData.firstName,
      lastName = userData.lastName,
      email = userData.email,
      password = userData.password,
      countryCode = userData.countryCode,
      phone = userData.phone,
      gender = userData.gender;
  if (!firstName) return {
    isAccepted: false,
    message: 'First name is required',
    field: 'firstName'
  };
  if (!utils.isNameValid(firstName)) return {
    isAccepted: false,
    message: 'Invalid name formate',
    field: 'firstName'
  };
  if (!lastName) return {
    isAccepted: false,
    message: 'Last name is required',
    field: 'lastName'
  };
  if (!utils.isNameValid(lastName)) return {
    isAccepted: false,
    message: 'Invalid name formate',
    field: 'lastName'
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
    data: userData
  };
};

module.exports = {
  updateUserMainData: updateUserMainData,
  updateUserProfileImage: updateUserProfileImage,
  updateUserEmail: updateUserEmail,
  updateUserPassword: updateUserPassword,
  updateUserLanguage: updateUserLanguage,
  verifyAndUpdateUserPassword: verifyAndUpdateUserPassword,
  updateUserSpeciality: updateUserSpeciality,
  addEmployeeUser: addEmployeeUser,
  updateUserActivation: updateUserActivation,
  updateUserVisibility: updateUserVisibility,
  updateUserBlocked: updateUserBlocked
};