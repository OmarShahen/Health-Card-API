"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ExpertVerificationModel = require('../models/ExpertVerificationModel');

var SpecialityModel = require('../models/SpecialityModel');

var CounterModel = require('../models/CounterModel');

var expertVerificationValidation = require('../validations/expertVerifications');

var utils = require('../utils/utils');

var email = require('../mails/send-email');

var config = require('../config/config');

var emailTemplates = require('../mails/templates/messages');

var getExpertVerifications = function getExpertVerifications(request, response) {
  var status, _utils$statsQueryGene, searchQuery, expertsVerifications, matchQuery, totalExpertsVerifications, totalAcceptedExpertsVerifications, totalPendingExpertsVerifications, totalRejectedExpertsVerifications;

  return regeneratorRuntime.async(function getExpertVerifications$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          status = request.query.status;
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene.searchQuery;

          if (status) {
            searchQuery = _objectSpread({}, searchQuery, {
              status: status
            });
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(ExpertVerificationModel.aggregate([{
            $match: searchQuery
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $limit: 25
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'specialityId',
              foreignField: '_id',
              as: 'speciality'
            }
          }]));

        case 6:
          expertsVerifications = _context.sent;
          expertsVerifications.forEach(function (expertVerification) {
            return expertVerification.speciality = expertVerification.speciality[0];
          });
          matchQuery = utils.statsQueryGenerator('none', 0, request.query);
          _context.next = 11;
          return regeneratorRuntime.awrap(ExpertVerificationModel.countDocuments(matchQuery.searchQuery));

        case 11:
          totalExpertsVerifications = _context.sent;
          _context.next = 14;
          return regeneratorRuntime.awrap(ExpertVerificationModel.countDocuments(_objectSpread({}, matchQuery.searchQuery, {
            status: 'ACCEPTED'
          })));

        case 14:
          totalAcceptedExpertsVerifications = _context.sent;
          _context.next = 17;
          return regeneratorRuntime.awrap(ExpertVerificationModel.countDocuments(_objectSpread({}, matchQuery.searchQuery, {
            status: 'PENDING'
          })));

        case 17:
          totalPendingExpertsVerifications = _context.sent;
          _context.next = 20;
          return regeneratorRuntime.awrap(ExpertVerificationModel.countDocuments(_objectSpread({}, matchQuery.searchQuery, {
            status: 'REJECTED'
          })));

        case 20:
          totalRejectedExpertsVerifications = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            totalExpertsVerifications: totalExpertsVerifications,
            totalAcceptedExpertsVerifications: totalAcceptedExpertsVerifications,
            totalPendingExpertsVerifications: totalPendingExpertsVerifications,
            totalRejectedExpertsVerifications: totalRejectedExpertsVerifications,
            expertsVerifications: expertsVerifications
          }));

        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 28:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

var searchExpertsVerificationsByName = function searchExpertsVerificationsByName(request, response) {
  var name, matchQuery, expertsVerifications;
  return regeneratorRuntime.async(function searchExpertsVerificationsByName$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          name = request.query.name;
          name = name ? name : '';
          matchQuery = {
            name: {
              $regex: name,
              $options: 'i'
            }
          };
          _context2.next = 6;
          return regeneratorRuntime.awrap(ExpertVerificationModel.aggregate([{
            $match: matchQuery
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $limit: 25
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'specialityId',
              foreignField: '_id',
              as: 'speciality'
            }
          }]));

        case 6:
          expertsVerifications = _context2.sent;
          expertsVerifications.forEach(function (expertVerification) {
            return expertVerification.speciality = expertVerification.speciality[0];
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            expertsVerifications: expertsVerifications
          }));

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var addExpertVerification = function addExpertVerification(request, response) {
  var dataValidation, specialityId, speciality, counter, expertVerificationData, expertVerificationObj, newExpertVerification, mailData, sentEmail;
  return regeneratorRuntime.async(function addExpertVerification$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = expertVerificationValidation.addExpertVerification(request.body);

          if (dataValidation.isAccepted) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          specialityId = request.body.specialityId;
          _context3.next = 7;
          return regeneratorRuntime.awrap(SpecialityModel.findById(specialityId));

        case 7:
          speciality = _context3.sent;

          if (speciality) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Speciality ID is not registered',
            field: 'specialityId'
          }));

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'ExpertVerification'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 12:
          counter = _context3.sent;
          expertVerificationData = _objectSpread({
            expertVerificationId: counter.value
          }, request.body);
          expertVerificationObj = new ExpertVerificationModel(expertVerificationData);
          _context3.next = 17;
          return regeneratorRuntime.awrap(expertVerificationObj.save());

        case 17:
          newExpertVerification = _context3.sent;
          mailData = {
            receiverEmail: config.NOTIFICATION_EMAIL,
            subject: 'New Expert Verification Request',
            mailBodyText: "You got new expert verification request #".concat(newExpertVerification.expertVerificationId),
            mailBodyHTML: "\n            <strong>ID: </strong><span>#".concat(newExpertVerification.expertVerificationId, "</span><br />\n            <strong>Name: </strong><span>").concat(newExpertVerification.name, "</span><br />\n            <strong>Email: </strong><span>").concat(newExpertVerification.email, "</span><br />\n            <strong>Phone: </strong><span>+").concat(newExpertVerification.countryCode).concat(newExpertVerification.phone, "</span><br />\n            <strong>Speciality: </strong><span>").concat(speciality.name, "</span><br />\n            <strong>Description: </strong><span>").concat(newExpertVerification.description, "</span><br />\n            ")
          };
          _context3.next = 21;
          return regeneratorRuntime.awrap(email.sendEmail(mailData));

        case 21:
          sentEmail = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added expert verification successfully!',
            sentEmail: sentEmail,
            expertVerification: newExpertVerification
          }));

        case 25:
          _context3.prev = 25;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 29:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 25]]);
};

var updateExpertVerificationStatus = function updateExpertVerificationStatus(request, response) {
  var expertVerificationId, status, dataValidation, updatedExpertVerification, emailSent, mailData, mailtemplateData, _mailData;

  return regeneratorRuntime.async(function updateExpertVerificationStatus$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          expertVerificationId = request.params.expertVerificationId;
          status = request.body.status;
          dataValidation = expertVerificationValidation.updateExpertVerificationStatus(request.body);

          if (dataValidation.isAccepted) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 6:
          _context4.next = 8;
          return regeneratorRuntime.awrap(ExpertVerificationModel.findByIdAndUpdate(expertVerificationId, {
            status: status
          }, {
            "new": true
          }));

        case 8:
          updatedExpertVerification = _context4.sent;

          if (!(status == 'REJECTED')) {
            _context4.next = 14;
            break;
          }

          mailData = {
            receiverEmail: updatedExpertVerification.email,
            subject: 'Expert Verification Request - Rejection',
            mailBodyHTML: emailTemplates.getExpertVerificationRejectionMessage({
              expertName: updatedExpertVerification.name
            })
          };
          _context4.next = 13;
          return regeneratorRuntime.awrap(email.sendEmail(mailData));

        case 13:
          emailSent = _context4.sent;

        case 14:
          if (!(status == 'ACCEPTED')) {
            _context4.next = 20;
            break;
          }

          mailtemplateData = {
            expertName: updatedExpertVerification.name,
            signupLink: "".concat(config.EXPERT_SIGNUP_LINK, "?type=EXPERT&expertVerification=").concat(updatedExpertVerification._id)
          };
          _mailData = {
            receiverEmail: updatedExpertVerification.email,
            subject: 'Congratulations! Your Expert Verification Request has been Accepted',
            mailBodyHTML: emailTemplates.getExpertVerificationAcceptanceMessage(mailtemplateData)
          };
          _context4.next = 19;
          return regeneratorRuntime.awrap(email.sendEmail(_mailData));

        case 19:
          emailSent = _context4.sent;

        case 20:
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated expert verification status successfully!',
            emailSent: emailSent,
            expertVerification: updatedExpertVerification
          }));

        case 23:
          _context4.prev = 23;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 27:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 23]]);
};

var deleteExpertVerification = function deleteExpertVerification(request, response) {
  var expertVerificationId, deletedExpertVerification;
  return regeneratorRuntime.async(function deleteExpertVerification$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          expertVerificationId = request.params.expertVerificationId;
          _context5.next = 4;
          return regeneratorRuntime.awrap(ExpertVerificationModel.findByIdAndDelete(expertVerificationId));

        case 4:
          deletedExpertVerification = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted expert verification successfully!',
            expertVerification: deletedExpertVerification
          }));

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getExpertVerificationsGrowthStats = function getExpertVerificationsGrowthStats(request, response) {
  var groupBy, format, countMethod, expertsVerificationsGrowth;
  return regeneratorRuntime.async(function getExpertVerificationsGrowthStats$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          groupBy = request.query.groupBy;
          format = '%Y-%m-%d';
          countMethod = {
            $sum: 1
          };

          if (groupBy == 'MONTH') {
            format = '%Y-%m';
          } else if (groupBy == 'YEAR') {
            format = '%Y';
          }

          _context6.next = 7;
          return regeneratorRuntime.awrap(ExpertVerificationModel.aggregate([{
            $group: {
              _id: {
                $dateToString: {
                  format: format,
                  date: '$createdAt'
                }
              },
              count: countMethod
            }
          }, {
            $sort: {
              '_id': 1
            }
          }]));

        case 7:
          expertsVerificationsGrowth = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            expertsVerificationsGrowth: expertsVerificationsGrowth
          }));

        case 11:
          _context6.prev = 11;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 15:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

module.exports = {
  getExpertVerifications: getExpertVerifications,
  addExpertVerification: addExpertVerification,
  searchExpertsVerificationsByName: searchExpertsVerificationsByName,
  deleteExpertVerification: deleteExpertVerification,
  updateExpertVerificationStatus: updateExpertVerificationStatus,
  getExpertVerificationsGrowthStats: getExpertVerificationsGrowthStats
};