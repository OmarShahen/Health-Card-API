"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var mongoose = require('mongoose');

var statsQueryGenerator = function statsQueryGenerator() {
  var entityIdKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'none';
  var entityIdValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var datesQuery = arguments.length > 2 ? arguments[2] : undefined;
  var dateField = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'createdAt';
  var from = datesQuery.from,
      to = datesQuery.to,
      until = datesQuery.until,
      specific = datesQuery.specific;
  var searchQuery = {};

  if (entityIdKey == 'none') {} else if (typeof entityIdValue == 'string') {
    searchQuery[entityIdKey] = mongoose.Types.ObjectId(entityIdValue);
  } else if (_typeof(entityIdValue) == 'object') {
    searchQuery[entityIdKey] = {
      $in: entityIdValue
    };
  }

  var toDate = new Date();
  var fromDate = new Date();

  if (until) {
    toDate = new Date(until);
    var dateQuery = {
      $lte: toDate
    };
    searchQuery[dateField] = dateQuery;
  } else if (from && to) {
    fromDate = new Date(from);
    toDate = new Date(to);
    var _dateQuery = {
      $gte: fromDate,
      $lte: toDate
    };
    searchQuery[dateField] = _dateQuery;
  } else if (specific) {
    var fromDateTemp = new Date(specific);
    toDate = new Date(fromDateTemp.setDate(fromDateTemp.getDate() + 1));
    fromDate = new Date(specific);
    var _dateQuery2 = {
      $gte: fromDate,
      $lte: toDate
    };
    searchQuery[dateField] = _dateQuery2;
  }

  return {
    searchQuery: searchQuery,
    fromDate: fromDate,
    toDate: toDate
  };
};

var growthDatePicker = function growthDatePicker(until, to, specific) {
  var growthUntilDate;

  if (until) {
    growthUntilDate = until;
  } else if (to) {
    growthUntilDate = to;
  } else if (specific) {
    growthUntilDate = specific;
  }

  return growthUntilDate;
};

module.exports = {
  statsQueryGenerator: statsQueryGenerator,
  growthDatePicker: growthDatePicker
};