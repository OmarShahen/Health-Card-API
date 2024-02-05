"use strict";

var utils = require('../utils/utils');

var addReview = function addReview(reviewData) {
  var expertId = reviewData.expertId,
      seekerId = reviewData.seekerId,
      rating = reviewData.rating,
      communication = reviewData.communication,
      understanding = reviewData.understanding,
      solutions = reviewData.solutions,
      commitment = reviewData.commitment,
      note = reviewData.note,
      isRecommend = reviewData.isRecommend;
  if (!expertId) return {
    isAccepted: false,
    message: 'Expert ID is required',
    field: 'expertId'
  };
  if (!utils.isObjectId(expertId)) return {
    isAccepted: false,
    message: 'Invalid expert ID format',
    field: 'expertId'
  };
  if (!seekerId) return {
    isAccepted: false,
    message: 'Seeker ID is required',
    field: 'seekerId'
  };
  if (!utils.isObjectId(seekerId)) return {
    isAccepted: false,
    message: 'Invalid seeker ID format',
    field: 'seekerId'
  };
  if (note && typeof note != 'string') return {
    isAccepted: false,
    message: 'Invalid note format',
    field: 'note'
  };
  if (!rating) return {
    isAccepted: false,
    message: 'Rating is required',
    field: 'rating'
  };
  if (typeof rating != 'number') return {
    isAccepted: false,
    message: 'Rating format is invalid',
    field: 'rating'
  };
  if (!communication) return {
    isAccepted: false,
    message: 'Communication is required',
    field: 'communication'
  };
  if (typeof communication != 'number') return {
    isAccepted: false,
    message: 'Communication format is invalid',
    field: 'communication'
  };
  if (!understanding) return {
    isAccepted: false,
    message: 'Understanding is required',
    field: 'understanding'
  };
  if (typeof understanding != 'number') return {
    isAccepted: false,
    message: 'Understanding format is invalid',
    field: 'understanding'
  };
  if (!solutions) return {
    isAccepted: false,
    message: 'Solutions is required',
    field: 'solutions'
  };
  if (typeof solutions != 'number') return {
    isAccepted: false,
    message: 'Solutions format is invalid',
    field: 'solutions'
  };
  if (!commitment) return {
    isAccepted: false,
    message: 'Commitment is required',
    field: 'commitment'
  };
  if (typeof commitment != 'number') return {
    isAccepted: false,
    message: 'Commitment format is invalid',
    field: 'commitment'
  };
  if (typeof isRecommend != 'boolean') return {
    isAccepted: false,
    message: 'Is recommend format is invalid',
    field: 'isRecommend'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: reviewData
  };
};

module.exports = {
  addReview: addReview
};