"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var UserModel = require('../models/UserModel');

var AppointmentModel = require('../models/AppointmentModel');

var PaymentModel = require('../models/PaymentModel');

var ReviewModel = require('../models/ReviewModel');

var expertValidation = require('../validations/experts');

var mongoose = require('mongoose');

var CounterModel = require('../models/CounterModel');

var bcrypt = require('bcrypt');

var config = require('../config/config');

var utils = require('../utils/utils');

var searchExperts = function searchExperts(request, response) {
  var specialityId, _request$query, gender, sortBy, subSpecialityId, page, limit, skip, matchQuery, sortQuery, experts, totalExperts;

  return regeneratorRuntime.async(function searchExperts$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          specialityId = request.params.specialityId;
          _request$query = request.query, gender = _request$query.gender, sortBy = _request$query.sortBy, subSpecialityId = _request$query.subSpecialityId, page = _request$query.page, limit = _request$query.limit;
          page = page ? page : 1;
          limit = limit ? limit : 10;
          skip = (page - 1) * limit;
          matchQuery = {
            speciality: {
              $in: [mongoose.Types.ObjectId(specialityId)]
            },
            isVerified: true,
            isShow: true,
            isDeactivated: false,
            isBlocked: false,
            type: 'EXPERT'
          };
          sortQuery = {
            createdAt: -1
          };

          if (gender) {
            matchQuery.gender = gender;
          }

          if (subSpecialityId) {
            matchQuery.subSpeciality = {
              $in: [mongoose.Types.ObjectId(subSpecialityId)]
            };
          }

          if (sortBy == 'HIGH-RATING') {
            sortQuery.rating = -1;
          } else if (sortBy == 'HIGH-PRICE') {
            sortQuery['pricing.price'] = -1;
          } else if (sortBy == 'LOW-PRICE') {
            sortQuery['pricing.price'] = 1;
          }

          _context.next = 13;
          return regeneratorRuntime.awrap(UserModel.aggregate([{
            $match: matchQuery
          }, {
            $sort: {
              rating: -1,
              createdAt: -1
            }
          }, {
            $skip: skip
          }, {
            $limit: Number.parseInt(limit)
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'speciality',
              foreignField: '_id',
              as: 'speciality'
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'subSpeciality',
              foreignField: '_id',
              as: 'subSpeciality'
            }
          }, {
            $project: {
              password: 0
            }
          }]));

        case 13:
          experts = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(UserModel.countDocuments(matchQuery));

        case 16:
          totalExperts = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            totalExperts: totalExperts,
            experts: experts
          }));

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

var searchExpertsByNameAndSpeciality = function searchExpertsByNameAndSpeciality(request, response) {
  var _request$params, specialityId, name, matchQuery, experts, totalExperts;

  return regeneratorRuntime.async(function searchExpertsByNameAndSpeciality$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _request$params = request.params, specialityId = _request$params.specialityId, name = _request$params.name;
          matchQuery = {
            speciality: {
              $in: [mongoose.Types.ObjectId(specialityId)]
            },
            isVerified: true,
            isShow: true,
            isDeactivated: false,
            isBlocked: false,
            type: 'EXPERT',
            firstName: {
              $regex: name,
              $options: 'i'
            }
          };
          _context2.next = 5;
          return regeneratorRuntime.awrap(UserModel.aggregate([{
            $match: matchQuery
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'speciality',
              foreignField: '_id',
              as: 'speciality'
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'subSpeciality',
              foreignField: '_id',
              as: 'subSpeciality'
            }
          }, {
            $project: {
              password: 0
            }
          }]));

        case 5:
          experts = _context2.sent;
          _context2.next = 8;
          return regeneratorRuntime.awrap(UserModel.countDocuments(matchQuery));

        case 8:
          totalExperts = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            totalExperts: totalExperts,
            experts: experts
          }));

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var addExpert = function addExpert(request, response) {
  var dataValidation, _request$body, email, password, emailList, expertData, hashedPassword, counter, userObj, newUser;

  return regeneratorRuntime.async(function addExpert$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = expertValidation.addExpert(request.body);

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
          _request$body = request.body, email = _request$body.email, password = _request$body.password;
          _context3.next = 7;
          return regeneratorRuntime.awrap(UserModel.find({
            email: email,
            isVerified: true
          }));

        case 7:
          emailList = _context3.sent;

          if (!(emailList.length != 0)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Email is already registered',
            field: 'email'
          }));

        case 10:
          expertData = _objectSpread({}, request.body, {
            type: 'EXPERT',
            isVerified: true
          });
          hashedPassword = bcrypt.hashSync(password, config.SALT_ROUNDS);
          expertData.password = hashedPassword;
          _context3.next = 15;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'user'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 15:
          counter = _context3.sent;
          expertData.userId = counter.value;
          userObj = new UserModel(expertData);
          _context3.next = 20;
          return regeneratorRuntime.awrap(userObj.save());

        case 20:
          newUser = _context3.sent;
          newUser.password = undefined;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added expert successfully!',
            user: newUser
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

var getExperts = function getExperts(request, response) {
  var _utils$statsQueryGene, searchQuery, matchQuery, experts, totalExperts;

  return regeneratorRuntime.async(function getExperts$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          matchQuery = _objectSpread({}, searchQuery, {
            type: 'EXPERT',
            isVerified: true
          });
          _context4.next = 5;
          return regeneratorRuntime.awrap(UserModel.aggregate([{
            $match: matchQuery
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $limit: 25
          }, {
            $project: {
              password: 0
            }
          }]));

        case 5:
          experts = _context4.sent;
          _context4.next = 8;
          return regeneratorRuntime.awrap(UserModel.countDocuments(matchQuery));

        case 8:
          totalExperts = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            totalExperts: totalExperts,
            experts: experts
          }));

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var searchExpertsByName = function searchExpertsByName(request, response) {
  var name, matchQuery, experts;
  return regeneratorRuntime.async(function searchExpertsByName$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          name = request.query.name;
          name = name ? name : '';
          matchQuery = {
            isVerified: true,
            type: 'EXPERT',
            firstName: {
              $regex: name,
              $options: 'i'
            }
          };
          _context5.next = 6;
          return regeneratorRuntime.awrap(UserModel.aggregate([{
            $match: matchQuery
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $limit: 25
          }, {
            $project: {
              password: 0
            }
          }]));

        case 6:
          experts = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            experts: experts
          }));

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var deleteExpert = function deleteExpert(request, response) {
  var userId, appointmentsPromise, paymentsPromise, reviewsPromise, _ref, _ref2, appointments, payments, reviews, deletedUser;

  return regeneratorRuntime.async(function deleteExpert$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          userId = request.params.userId;
          appointmentsPromise = AppointmentModel.find({
            expertId: userId
          });
          paymentsPromise = PaymentModel.find({
            expertId: userId
          });
          reviewsPromise = ReviewModel.find({
            expertId: userId
          });
          _context6.next = 7;
          return regeneratorRuntime.awrap(Promise.all([appointmentsPromise, paymentsPromise, reviewsPromise]));

        case 7:
          _ref = _context6.sent;
          _ref2 = _slicedToArray(_ref, 3);
          appointments = _ref2[0];
          payments = _ref2[1];
          reviews = _ref2[2];

          if (!(appointments.length != 0)) {
            _context6.next = 14;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Expert is registered with appointments',
            field: 'appointments'
          }));

        case 14:
          if (!(payments.length != 0)) {
            _context6.next = 16;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Expert is registered with payments',
            field: 'payments'
          }));

        case 16:
          if (!(reviews.length != 0)) {
            _context6.next = 18;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Expert is registered with reviews',
            field: 'reviews'
          }));

        case 18:
          _context6.next = 20;
          return regeneratorRuntime.awrap(UserModel.findByIdAndDelete(userId));

        case 20:
          deletedUser = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted expert successfully!',
            user: deletedUser
          }));

        case 24:
          _context6.prev = 24;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 28:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

var addExpertBankInfo = function addExpertBankInfo(request, response) {
  var userId, dataValidation, _request$body2, accountNumber, accountHolderName, bankName, bankInfoData, updatedExpert;

  return regeneratorRuntime.async(function addExpertBankInfo$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          userId = request.params.userId;
          dataValidation = expertValidation.addBankInfo(request.body);

          if (dataValidation.isAccepted) {
            _context7.next = 5;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          _request$body2 = request.body, accountNumber = _request$body2.accountNumber, accountHolderName = _request$body2.accountHolderName, bankName = _request$body2.bankName;
          bankInfoData = {
            accountNumber: accountNumber,
            accountHolderName: accountHolderName,
            bankName: bankName
          };
          _context7.next = 9;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            'paymentInfo.bankAccount': bankInfoData
          }, {
            "new": true
          }));

        case 9:
          updatedExpert = _context7.sent;
          updatedExpert.password = undefined;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added expert bank information successfully!',
            user: updatedExpert
          }));

        case 14:
          _context7.prev = 14;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 18:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var addExpertMobileWalletInfo = function addExpertMobileWalletInfo(request, response) {
  var userId, dataValidation, walletNumber, updatedExpert;
  return regeneratorRuntime.async(function addExpertMobileWalletInfo$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          userId = request.params.userId;
          dataValidation = expertValidation.addMobileWalletInfo(request.body);

          if (dataValidation.isAccepted) {
            _context8.next = 5;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          walletNumber = request.body.walletNumber;
          _context8.next = 8;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            'paymentInfo.mobileWallet.walletNumber': walletNumber
          }, {
            "new": true
          }));

        case 8:
          updatedExpert = _context8.sent;
          updatedExpert.password = undefined;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added expert mobile wallet information successfully!',
            user: updatedExpert
          }));

        case 13:
          _context8.prev = 13;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 17:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

module.exports = {
  searchExperts: searchExperts,
  searchExpertsByNameAndSpeciality: searchExpertsByNameAndSpeciality,
  searchExpertsByName: searchExpertsByName,
  addExpert: addExpert,
  getExperts: getExperts,
  deleteExpert: deleteExpert,
  addExpertBankInfo: addExpertBankInfo,
  addExpertMobileWalletInfo: addExpertMobileWalletInfo
};