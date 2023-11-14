"use strict";

var addMessageTemplate = function addMessageTemplate(messageTemplateData) {
  var name = messageTemplateData.name,
      description = messageTemplateData.description,
      category = messageTemplateData.category;
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
  if (!category) return {
    isAccepted: false,
    message: 'Category is required',
    field: 'category'
  };
  if (typeof category != 'string') return {
    isAccepted: false,
    message: 'Category format is invalid',
    field: 'category'
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
      category = messageTemplateData.category;
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
  if (!category) return {
    isAccepted: false,
    message: 'Category is required',
    field: 'category'
  };
  if (typeof category != 'string') return {
    isAccepted: false,
    message: 'Category format is invalid',
    field: 'category'
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