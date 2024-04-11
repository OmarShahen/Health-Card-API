"use strict";

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ReviewModel = require('../models/ReviewModel');

var UserModel = require('../models/UserModel');

var CounterModel = require('../models/CounterModel');

var reviewValidation = require('../validations/reviews');

var mongoose = require('mongoose');

var utils = require('../utils/utils');

var getReviews = function getReviews(request, response) {
  var _utils$statsQueryGene, searchQuery, reviews, totalReviews;

  return regeneratorRuntime.async(function getReviews$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context.next = 4;
          return regeneratorRuntime.awrap(ReviewModel.aggregate([{
            $match: searchQuery
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $limit: 25
          }, {
            $lookup: {
              from: 'users',
              localField: 'seekerId',
              foreignField: '_id',
              as: 'seeker'
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'expertId',
              foreignField: '_id',
              as: 'expert'
            }
          }, {
            $project: {
              'seeker.password': 0,
              'expert.password': 0
            }
          }]));

        case 4:
          reviews = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(ReviewModel.countDocuments(searchQuery));

        case 7:
          totalReviews = _context.sent;
          reviews.forEach(function (review) {
            review.seeker = review.seeker[0];
            review.expert = review.expert[0];
          });
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            totalReviews: totalReviews,
            reviews: reviews
          }));

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var getReviewsStats = function getReviewsStats(request, response) {
  var _utils$statsQueryGene2, searchQuery, reviewsStats;

  return regeneratorRuntime.async(function getReviewsStats$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _utils$statsQueryGene2 = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene2.searchQuery;
          _context2.next = 4;
          return regeneratorRuntime.awrap(ReviewModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$rating',
              count: {
                $sum: 1
              }
            }
          }]));

        case 4:
          reviewsStats = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            reviewsStats: reviewsStats
          }));

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getExpertReviewsStats = function getExpertReviewsStats(request, response) {
  var userId, matchQuery, reviewsRatingList, reviewsCommunicationList, reviewsUnderstandingList, reviewsSolutionsList, reviewsCommitmentList, reviewsRating, reviewsCommunication, reviewsUnderstanding, reviewsSolutions, reviewsCommitment;
  return regeneratorRuntime.async(function getExpertReviewsStats$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = request.params.userId;
          matchQuery = {
            expertId: mongoose.Types.ObjectId(userId)
          };
          _context3.next = 5;
          return regeneratorRuntime.awrap(ReviewModel.aggregate([{
            $match: matchQuery
          }, {
            $group: {
              _id: null,
              averageRating: {
                $avg: '$rating'
              }
            }
          }]));

        case 5:
          reviewsRatingList = _context3.sent;
          _context3.next = 8;
          return regeneratorRuntime.awrap(ReviewModel.aggregate([{
            $match: matchQuery
          }, {
            $group: {
              _id: null,
              averageCommunication: {
                $avg: '$communication'
              }
            }
          }]));

        case 8:
          reviewsCommunicationList = _context3.sent;
          _context3.next = 11;
          return regeneratorRuntime.awrap(ReviewModel.aggregate([{
            $match: matchQuery
          }, {
            $group: {
              _id: null,
              averageUnderstanding: {
                $avg: '$understanding'
              }
            }
          }]));

        case 11:
          reviewsUnderstandingList = _context3.sent;
          _context3.next = 14;
          return regeneratorRuntime.awrap(ReviewModel.aggregate([{
            $match: matchQuery
          }, {
            $group: {
              _id: null,
              averageSolutions: {
                $avg: '$solutions'
              }
            }
          }]));

        case 14:
          reviewsSolutionsList = _context3.sent;
          _context3.next = 17;
          return regeneratorRuntime.awrap(ReviewModel.aggregate([{
            $match: matchQuery
          }, {
            $group: {
              _id: null,
              averageCommitment: {
                $avg: '$commitment'
              }
            }
          }]));

        case 17:
          reviewsCommitmentList = _context3.sent;
          reviewsRating = 0;
          reviewsCommunication = 0;
          reviewsUnderstanding = 0;
          reviewsSolutions = 0;
          reviewsCommitment = 0;

          if (reviewsRatingList.length != 0) {
            reviewsRating = reviewsRatingList[0].averageRating;
          }

          if (reviewsCommunicationList.length != 0) {
            reviewsCommunication = reviewsCommunicationList[0].averageCommunication;
          }

          if (reviewsUnderstandingList.length != 0) {
            reviewsUnderstanding = reviewsUnderstandingList[0].averageUnderstanding;
          }

          if (reviewsSolutionsList.length != 0) {
            reviewsSolutions = reviewsSolutionsList[0].averageSolutions;
          }

          if (reviewsCommitmentList.length != 0) {
            reviewsCommitment = reviewsCommitmentList[0].averageCommitment;
          }

          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            reviewsRating: reviewsRating,
            reviewsCommunication: reviewsCommunication,
            reviewsUnderstanding: reviewsUnderstanding,
            reviewsSolutions: reviewsSolutions,
            reviewsCommitment: reviewsCommitment
          }));

        case 31:
          _context3.prev = 31;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 35:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 31]]);
};

var getReviewsByExpertId = function getReviewsByExpertId(request, response) {
  var userId, _request$query, limit, isHide, _utils$statsQueryGene3, searchQuery, reviews;

  return regeneratorRuntime.async(function getReviewsByExpertId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = request.params.userId;
          _request$query = request.query, limit = _request$query.limit, isHide = _request$query.isHide;
          _utils$statsQueryGene3 = utils.statsQueryGenerator('expertId', userId, request.query), searchQuery = _utils$statsQueryGene3.searchQuery;

          if (isHide == 'TRUE') {
            searchQuery.isHide = true;
          } else if (isHide == 'FALSE') {
            searchQuery.isHide = false;
          }

          limit = limit ? Number.parseInt(limit) : 10;
          _context4.next = 8;
          return regeneratorRuntime.awrap(ReviewModel.aggregate([{
            $match: searchQuery
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $limit: limit
          }, {
            $lookup: {
              from: 'users',
              localField: 'seekerId',
              foreignField: '_id',
              as: 'seeker'
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'expertId',
              foreignField: '_id',
              as: 'expert'
            }
          }, {
            $project: {
              'seeker.password': 0,
              'expert.password': 0
            }
          }]));

        case 8:
          reviews = _context4.sent;
          reviews.map(function (review) {
            review.seeker = review.seeker[0];
            review.expert = review.expert[0];
          });
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            reviews: reviews
          }));

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var searchReviewsByExpertIdAndSeekerName = function searchReviewsByExpertIdAndSeekerName(request, response) {
  var userId, name, reviews;
  return regeneratorRuntime.async(function searchReviewsByExpertIdAndSeekerName$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = request.params.userId;
          name = request.query.name;

          if (name) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'No name to search for',
            field: 'name'
          }));

        case 5:
          _context5.next = 7;
          return regeneratorRuntime.awrap(ReviewModel.aggregate([{
            $match: {
              expertId: mongoose.Types.ObjectId(userId)
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'seekerId',
              foreignField: '_id',
              as: 'seeker'
            }
          }, {
            $match: {
              $or: [{
                'seeker.firstName': {
                  $regex: new RegExp(name, 'i')
                }
              }]
            }
          }, {
            $limit: 25
          }, {
            $lookup: {
              from: 'users',
              localField: 'expertId',
              foreignField: '_id',
              as: 'expert'
            }
          }, {
            $project: {
              'expert.password': 0,
              'seeker.password': 0
            }
          }]));

        case 7:
          reviews = _context5.sent;
          reviews.forEach(function (review) {
            review.seeker = review.seeker[0];
            review.expert = review.expert[0];
          });
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            reviews: reviews
          }));

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 16:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var addReview = function addReview(request, response) {
  var dataValidation, _request$body, seekerId, expertId, seekerPromise, expertPromise, _ref, _ref2, seeker, expert, counter, reviewData, reviewObj, newReview, averageRatingList, newRating, updatedUser;

  return regeneratorRuntime.async(function addReview$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          dataValidation = reviewValidation.addReview(request.body);

          if (dataValidation.isAccepted) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body = request.body, seekerId = _request$body.seekerId, expertId = _request$body.expertId;
          seekerPromise = UserModel.findById(seekerId);
          expertPromise = UserModel.findById(expertId);
          _context6.next = 9;
          return regeneratorRuntime.awrap(Promise.all([seekerPromise, expertPromise]));

        case 9:
          _ref = _context6.sent;
          _ref2 = _slicedToArray(_ref, 2);
          seeker = _ref2[0];
          expert = _ref2[1];

          if (seeker) {
            _context6.next = 15;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Seeker ID is not registered',
            field: 'seekerId'
          }));

        case 15:
          if (expert) {
            _context6.next = 17;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Expert ID is not registered',
            field: 'expertId'
          }));

        case 17:
          _context6.next = 19;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'review'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 19:
          counter = _context6.sent;
          reviewData = _objectSpread({
            reviewId: counter.value
          }, request.body);
          reviewObj = new ReviewModel(reviewData);
          _context6.next = 24;
          return regeneratorRuntime.awrap(reviewObj.save());

        case 24:
          newReview = _context6.sent;
          _context6.next = 27;
          return regeneratorRuntime.awrap(ReviewModel.aggregate([{
            $match: {
              expertId: expert._id
            }
          }, {
            $group: {
              _id: '$expertId',
              averageRating: {
                $avg: '$rating'
              }
            }
          }]));

        case 27:
          averageRatingList = _context6.sent;
          newRating = averageRatingList[0].averageRating;
          _context6.next = 31;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(expert._id, {
            totalReviews: expert.totalReviews + 1,
            rating: newRating
          }, {
            "new": true
          }));

        case 31:
          updatedUser = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Review is added successfully!',
            review: newReview,
            expert: updatedUser
          }));

        case 35:
          _context6.prev = 35;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 39:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 35]]);
};

var deleteReview = function deleteReview(request, response) {
  var reviewId, deletedReview, expert, averageRatingList, newRating, updatedUser;
  return regeneratorRuntime.async(function deleteReview$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          reviewId = request.params.reviewId;
          _context7.next = 4;
          return regeneratorRuntime.awrap(ReviewModel.findByIdAndDelete(reviewId));

        case 4:
          deletedReview = _context7.sent;
          _context7.next = 7;
          return regeneratorRuntime.awrap(UserModel.findById(deletedReview.expertId));

        case 7:
          expert = _context7.sent;
          _context7.next = 10;
          return regeneratorRuntime.awrap(ReviewModel.aggregate([{
            $match: {
              expertId: expert._id
            }
          }, {
            $group: {
              _id: '$expertId',
              averageRating: {
                $avg: '$rating'
              }
            }
          }]));

        case 10:
          averageRatingList = _context7.sent;
          newRating = 5;

          if (averageRatingList.length != 0) {
            newRating = (_readOnlyError("newRating"), averageRatingList[0].total / 100);
          }

          _context7.next = 15;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(expert._id, {
            totalReviews: expert.totalReviews - 1,
            rating: newRating
          }, {
            "new": true
          }));

        case 15:
          updatedUser = _context7.sent;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted review successfully!',
            review: deletedReview,
            expert: updatedUser
          }));

        case 19:
          _context7.prev = 19;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 23:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var updateReviewVisibility = function updateReviewVisibility(request, response) {
  var dataValidation, reviewId, isHide, updatedReview;
  return regeneratorRuntime.async(function updateReviewVisibility$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          dataValidation = reviewValidation.updateReviewVisibility(request.body);

          if (dataValidation.isAccepted) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          reviewId = request.params.reviewId;
          isHide = request.body.isHide;
          _context8.next = 8;
          return regeneratorRuntime.awrap(ReviewModel.findByIdAndUpdate(reviewId, {
            isHide: isHide
          }, {
            "new": true
          }));

        case 8:
          updatedReview = _context8.sent;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated review visibility successfully!',
            review: updatedReview
          }));

        case 12:
          _context8.prev = 12;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 16:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

module.exports = {
  getReviews: getReviews,
  addReview: addReview,
  deleteReview: deleteReview,
  getReviewsByExpertId: getReviewsByExpertId,
  searchReviewsByExpertIdAndSeekerName: searchReviewsByExpertIdAndSeekerName,
  getReviewsStats: getReviewsStats,
  getExpertReviewsStats: getExpertReviewsStats,
  updateReviewVisibility: updateReviewVisibility
};