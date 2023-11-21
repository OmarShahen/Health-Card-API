"use strict";

var utils = require('../../utils/utils');

var addMessageTemplate = function addMessageTemplate(messageTemplateData) {
  var name = messageTemplateData.name,
      categoryId = messageTemplateData.categoryId,
      description = messageTemplateData.description;
  if (!name) return {
    isAccepted: false,
    message: 'Name is required',
    field: 'name'
  };
  if (typeof name != 'string') return {
    isAccepted: false,
    message: 'Name format is invalid',
    field: 'name'
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
  if (!categoryId) return {
    isAccepted: false,
    message: 'Category ID is required',
    field: 'categoryId'
  };
  if (!utils.isObjectId(categoryId)) return {
    isAccepted: false,
    message: 'Category ID format is invalid',
    field: 'categoryId'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: messageTemplateData
  };
};

var updateMessageTemplate = function updateMessageTemplate(messageTemplateData) {
  var name = messageTemplateData.name,
      description = messageTemplateData.description,
      categoryId = messageTemplateData.categoryId;
  if (!name) return {
    isAccepted: false,
    message: 'Name is required',
    field: 'name'
  };
  if (typeof name != 'string') return {
    isAccepted: false,
    message: 'Name format is invalid',
    field: 'name'
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
  if (!categoryId) return {
    isAccepted: false,
    message: 'Category ID is required',
    field: 'categoryId'
  };
  if (!utils.isObjectId(categoryId)) return {
    isAccepted: false,
    message: 'Category ID format is invalid',
    field: 'categoryId'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: messageTemplateData
  };
};

module.exports = {
  addMessageTemplate: addMessageTemplate,
  updateMessageTemplate: updateMessageTemplate
};