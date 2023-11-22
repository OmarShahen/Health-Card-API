"use strict";

var utils = require('../../utils/utils');

var config = require('../../config/config');

var addMessageSent = function addMessageSent(messageSentData) {
  var messageTemplateId = messageSentData.messageTemplateId,
      leadId = messageSentData.leadId,
      platform = messageSentData.platform,
      isOpened = messageSentData.isOpened,
      openedDate = messageSentData.openedDate,
      isResponded = messageSentData.isResponded,
      respondedDate = messageSentData.respondedDate,
      isCTADone = messageSentData.isCTADone;
  if (!messageTemplateId) return {
    isAccepted: false,
    message: 'Message template ID is required',
    field: 'messageTemplateId'
  };
  if (!utils.isObjectId(messageTemplateId)) return {
    isAccepted: false,
    message: 'Message template ID format is invalid',
    field: 'messageTemplateId'
  };
  if (!leadId) return {
    isAccepted: false,
    message: 'Lead ID is required',
    field: 'leadId'
  };
  if (!utils.isObjectId(leadId)) return {
    isAccepted: false,
    message: 'Lead ID format is invalid',
    field: 'leadId'
  };
  if (!platform) return {
    isAccepted: false,
    message: 'Platform is required',
    field: 'platform'
  };
  if (typeof platform != 'string') return {
    isAccepted: false,
    message: 'Platform format is invalid',
    field: 'platform'
  };
  if (!config.MESSAGE_SENT_PLATFORMS.includes(platform)) return {
    isAccepted: false,
    message: 'Platform value is not valid',
    field: 'platform'
  };
  /*if(typeof isOpened != 'boolean') return { isAccepted: false, message: 'Opened format is invalid', field: 'isOpened' }
    if(!openedDate) return { isAccepted: false, message: 'Opened date is required', field: 'openedDate' }
    if(!utils.isDateTimeValid(openedDate)) return { isAccepted: false, message: 'Opened date format is invalid', field: 'openedDate' }
  
  if(typeof isResponded != 'boolean') return { isAccepted: false, message: 'Responded format is invalid', field: 'isResponded' }
    if(!respondedDate) return { isAccepted: false, message: 'Responded date is required', field: 'respondedDate' }
    if(!utils.isDateTimeValid(respondedDate)) return { isAccepted: false, message: 'Responded date format is invalid', field: 'respondedDate' }
    if(typeof isCTADone != 'boolean') return { isAccepted: false, message: 'CTA format is invalid', field: 'isCTADone' }*/

  return {
    isAccepted: true,
    message: 'data is valid',
    data: messageSentData
  };
};

var updateMessageSent = function updateMessageSent(messageSentData) {
  var platform = messageSentData.platform,
      isOpened = messageSentData.isOpened,
      openedDate = messageSentData.openedDate,
      isResponded = messageSentData.isResponded,
      respondedDate = messageSentData.respondedDate,
      isCTADone = messageSentData.isCTADone;
  if (!platform) return {
    isAccepted: false,
    message: 'Platform is required',
    field: 'platform'
  };
  if (typeof platform != 'string') return {
    isAccepted: false,
    message: 'Platform format is invalid',
    field: 'platform'
  };
  if (!config.MESSAGE_SENT_PLATFORMS.includes(platform)) return {
    isAccepted: false,
    message: 'Platform value is not valid',
    field: 'platform'
  };
  if (typeof isOpened != 'boolean') return {
    isAccepted: false,
    message: 'Opened format is invalid',
    field: 'isOpened'
  };
  if (isOpened && !openedDate) return {
    isAccepted: false,
    message: 'Opened date is required',
    field: 'openedDate'
  };
  if (isOpened && !utils.isDateTimeValid(openedDate)) return {
    isAccepted: false,
    message: 'Opened date format is invalid',
    field: 'openedDate'
  };
  if (typeof isResponded != 'boolean') return {
    isAccepted: false,
    message: 'Responded format is invalid',
    field: 'isResponded'
  };
  if (isResponded && !respondedDate) return {
    isAccepted: false,
    message: 'Responded date is required',
    field: 'respondedDate'
  };
  if (isResponded && !utils.isDateTimeValid(respondedDate)) return {
    isAccepted: false,
    message: 'Responded date format is invalid',
    field: 'respondedDate'
  };
  if (typeof isCTADone != 'boolean') return {
    isAccepted: false,
    message: 'CTA format is invalid',
    field: 'isCTADone'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: messageSentData
  };
};

var updateMessageSentCTA = function updateMessageSentCTA(messageSentData) {
  var isCTADone = messageSentData.isCTADone;
  if (typeof isCTADone != 'boolean') return {
    isAccepted: false,
    message: 'CTA format is invalid',
    field: 'isCTADone'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: messageSentData
  };
};

var updateMessageSentOpen = function updateMessageSentOpen(messageSentData) {
  var isOpened = messageSentData.isOpened,
      openedDate = messageSentData.openedDate;
  if (typeof isOpened != 'boolean') return {
    isAccepted: false,
    message: 'Opened format is invalid',
    field: 'isOpened'
  };
  if (!openedDate) return {
    isAccepted: false,
    message: 'Opened date is required',
    field: 'openedDate'
  };
  if (!utils.isDateTimeValid(openedDate)) return {
    isAccepted: false,
    message: 'Opened date format is invalid',
    field: 'openedDate'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: messageSentData
  };
};

var updateMessageSentRespond = function updateMessageSentRespond(messageSentData) {
  var isResponded = messageSentData.isResponded,
      respondedDate = messageSentData.respondedDate;
  if (typeof isResponded != 'boolean') return {
    isAccepted: false,
    message: 'Responded format is invalid',
    field: 'isResponded'
  };
  if (!respondedDate) return {
    isAccepted: false,
    message: 'Responded date is required',
    field: 'respondedDate'
  };
  if (!utils.isDateTimeValid(respondedDate)) return {
    isAccepted: false,
    message: 'Responded date format is invalid',
    field: 'respondedDate'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: messageSentData
  };
};

module.exports = {
  addMessageSent: addMessageSent,
  updateMessageSent: updateMessageSent,
  updateMessageSentCTA: updateMessageSentCTA,
  updateMessageSentOpen: updateMessageSentOpen,
  updateMessageSentRespond: updateMessageSentRespond
};