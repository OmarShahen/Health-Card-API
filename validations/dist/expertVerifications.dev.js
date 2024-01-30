"use strict";

var utils = require('../utils/utils');

var config = require('../config/config');

var addExpertVerification = function addExpertVerification(expertVerificationData) {
  var name = expertVerificationData.name,
      email = expertVerificationData.email,
      phone = expertVerificationData.phone,
      description = expertVerificationData.description,
      specialityId = expertVerificationData.specialityId,
      websiteURL = expertVerificationData.websiteURL,
      facebookURL = expertVerificationData.facebookURL,
      tiktokURL = expertVerificationData.tiktokURL,
      instagramURL = expertVerificationData.instagramURL,
      youtubeURL = expertVerificationData.youtubeURL,
      linkedInURL = expertVerificationData.linkedInURL;
  if (!name) return {
    isAccepted: false,
    message: 'Name is required',
    field: 'name'
  };
  if (!utils.isNameValid(name)) return {
    isAccepted: false,
    message: 'Invalid name format',
    field: 'name'
  };
  if (!email) return {
    isAccepted: false,
    message: 'Email is required',
    field: 'email'
  };
  if (!utils.isEmailValid(email)) return {
    isAccepted: false,
    message: 'Email format is invalid',
    field: 'email'
  };
  if (!phone) return {
    isAccepted: false,
    message: 'Phone is required',
    field: 'phone'
  };
  if (!utils.isPhoneValid(phone)) return {
    isAccepted: false,
    message: 'Phone format is invalid',
    field: 'phone'
  };
  if (!description) return {
    isAccepted: false,
    message: 'Description is required',
    field: 'description'
  };
  if (typeof description != 'string') return {
    isAccepted: false,
    message: 'Description format is invalid',
    field: 'description'
  };
  if (!specialityId) return {
    isAccepted: false,
    message: 'Speciality ID is required',
    field: 'specialityId'
  };
  if (!utils.isObjectId(specialityId)) return {
    isAccepted: false,
    message: 'Speciality ID format is invalid',
    field: 'specialityId'
  };
  if (!websiteURL && !facebookURL && !tiktokURL && !instagramURL && !youtubeURL && !linkedInURL) return {
    isAccepted: false,
    message: 'Social Media Account is needed',
    field: 'websiteURL'
  };
  if (websiteURL && !utils.isValidURL(websiteURL)) return {
    isAccepted: false,
    message: 'Website URL format is invalid',
    field: 'websiteURL'
  };
  if (facebookURL && !utils.isValidURL(facebookURL)) return {
    isAccepted: false,
    message: 'Facebook URL format is invalid',
    field: 'facebookURL'
  };
  if (tiktokURL && !utils.isValidURL(tiktokURL)) return {
    isAccepted: false,
    message: 'Tiktok URL format is invalid',
    field: 'tiktokURL'
  };
  if (instagramURL && !utils.isValidURL(instagramURL)) return {
    isAccepted: false,
    message: 'Instagram URL format is invalid',
    field: 'instagramURL'
  };
  if (youtubeURL && !utils.isValidURL(youtubeURL)) return {
    isAccepted: false,
    message: 'Youtube URL format is invalid',
    field: 'youtubeURL'
  };
  if (linkedInURL && !utils.isValidURL(linkedInURL)) return {
    isAccepted: false,
    message: 'LinkedIn URL format is invalid',
    field: 'linkedInURL'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: expertVerificationData
  };
};

var updateExpertVerificationStatus = function updateExpertVerificationStatus(expertVerificationData) {
  var status = expertVerificationData.status;
  if (!status) return {
    isAccepted: false,
    message: 'Status is required',
    field: 'status'
  };
  if (typeof status != 'string') return {
    isAccepted: false,
    message: 'Status format is invalid',
    field: 'status'
  };
  if (!config.EXPERT_VERIFICATION_STATUS.includes(status)) return {
    isAccepted: false,
    message: 'Status value is not registered',
    field: 'status'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: expertVerificationData
  };
};

module.exports = {
  addExpertVerification: addExpertVerification,
  updateExpertVerificationStatus: updateExpertVerificationStatus
};