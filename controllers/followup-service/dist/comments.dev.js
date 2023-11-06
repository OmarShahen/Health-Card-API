"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var CommentModel = require('../../models/followup-service/CommentModel');

var UserModel = require('../../models/UserModel');

var PatientModel = require('../../models/PatientModel');

var ClinicModel = require('../../models/ClinicModel');

var CounterModel = require('../../models/CounterModel');

var commentValidation = require('../../validations/followup-service/comments');

var utils = require('../../utils/utils');

var getComments = function getComments(request, response) {
  var _utils$statsQueryGene, searchQuery, comments;

  return regeneratorRuntime.async(function getComments$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context.next = 4;
          return regeneratorRuntime.awrap(CommentModel.aggregate([{
            $match: searchQuery
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 4:
          comments = _context.sent;
          comments.forEach(function (comment) {
            comment.patient = comment.patient[0];
            comment.clinic = comment.clinic[0];
          });
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            comments: comments
          }));

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var addComment = function addComment(request, response) {
  var dataValidation, _request$body, clinicId, patientId, memberId, memberPromise, clinicPromise, _ref, _ref2, member, clinic, patient, counter, commentData, commentObj, newComment;

  return regeneratorRuntime.async(function addComment$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = commentValidation.addComment(request.body);

          if (dataValidation.isAccepted) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body = request.body, clinicId = _request$body.clinicId, patientId = _request$body.patientId, memberId = _request$body.memberId;
          memberPromise = UserModel.findById(memberId);
          clinicPromise = ClinicModel.findById(clinicId);
          _context2.next = 9;
          return regeneratorRuntime.awrap(Promise.all([memberPromise, clinicPromise]));

        case 9:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 2);
          member = _ref2[0];
          clinic = _ref2[1];

          if (member) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Member ID does not exist',
            field: 'doneById'
          }));

        case 15:
          if (!patientId) {
            _context2.next = 21;
            break;
          }

          _context2.next = 18;
          return regeneratorRuntime.awrap(PatientModel.findById(patientId));

        case 18:
          patient = _context2.sent;

          if (patient) {
            _context2.next = 21;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Patient ID does not exist',
            field: 'patientId'
          }));

        case 21:
          if (clinic) {
            _context2.next = 23;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic ID does not exist',
            field: 'clinicId'
          }));

        case 23:
          _context2.next = 25;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'Comment'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 25:
          counter = _context2.sent;
          commentData = _objectSpread({
            commentId: counter.value
          }, request.body);
          commentObj = new CommentModel(commentData);
          _context2.next = 30;
          return regeneratorRuntime.awrap(commentObj.save());

        case 30:
          newComment = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added comment successfully!',
            comment: newComment
          }));

        case 34:
          _context2.prev = 34;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 38:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 34]]);
};

var updateComment = function updateComment(request, response) {
  var commentId, dataValidation, updatedComment;
  return regeneratorRuntime.async(function updateComment$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          commentId = request.params.commentId;
          dataValidation = commentValidation.updateComment(request.body);

          if (dataValidation.isAccepted) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(CommentModel.findByIdAndUpdate(commentId, request.body, {
            "new": true
          }));

        case 7:
          updatedComment = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated comment successfully!',
            comment: updatedComment
          }));

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var deleteComment = function deleteComment(request, response) {
  var commentId, deletedComment;
  return regeneratorRuntime.async(function deleteComment$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          commentId = request.params.commentId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(CommentModel.findByIdAndDelete(commentId));

        case 4:
          deletedComment = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted comment successfully!',
            comment: deletedComment
          }));

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = {
  getComments: getComments,
  addComment: addComment,
  updateComment: updateComment,
  deleteComment: deleteComment
};