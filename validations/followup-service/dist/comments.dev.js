"use strict";

var utils = require('../../utils/utils');

var config = require('../../config/config');

var addComment = function addComment(commentData) {
  var clinicId = commentData.clinicId,
      patientId = commentData.patientId,
      memberId = commentData.memberId,
      description = commentData.description,
      category = commentData.category,
      type = commentData.type;
  if (!clinicId) return {
    isAccepted: false,
    message: 'Clinic ID is required',
    field: 'clinicId'
  };
  if (!utils.isObjectId(clinicId)) return {
    isAccepted: false,
    message: 'Invalid clinic ID format',
    field: 'clinicId'
  };
  if (patientId && !utils.isObjectId(patientId)) return {
    isAccepted: false,
    message: 'Invalid patient ID format',
    field: 'patientId'
  };
  if (!memberId) return {
    isAccepted: false,
    message: 'Member ID is required',
    field: 'memberId'
  };
  if (!utils.isObjectId(memberId)) return {
    isAccepted: false,
    message: 'Invalid member ID format',
    field: 'memberId'
  };
  if (!description) return {
    isAccepted: false,
    message: 'Description is required',
    field: 'description'
  };
  if (typeof description != 'string') return {
    isAccepted: false,
    message: 'Invalid description format',
    field: 'description'
  };
  if (!category) return {
    isAccepted: false,
    message: 'Category is required',
    field: 'category'
  };
  if (typeof category != 'string') return {
    isAccepted: false,
    message: 'Invalid category format',
    field: 'category'
  };
  if (!type) return {
    isAccepted: false,
    message: 'Type is required',
    field: 'type'
  };
  if (!config.COMMENT_TYPES.includes(type)) return {
    isAccepted: false,
    message: 'Invalid type format',
    field: 'type'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: commentData
  };
};

var updateComment = function updateComment(commentData) {
  var description = commentData.description,
      category = commentData.category,
      type = commentData.type;
  if (description && typeof description != 'string') return {
    isAccepted: false,
    message: 'Invalid description format',
    field: 'description'
  };
  if (category && typeof category != 'string') return {
    isAccepted: false,
    message: 'Invalid category format',
    field: 'category'
  };
  if (type && !config.COMMENT_TYPES.includes(type)) return {
    isAccepted: false,
    message: 'Invalid type format',
    field: 'type'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: commentData
  };
};

module.exports = {
  addComment: addComment,
  updateComment: updateComment
};