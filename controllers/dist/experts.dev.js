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

var SpecialityModel = require('../models/SpecialityModel');

var expertValidation = require('../validations/experts');

var mongoose = require('mongoose');

var CounterModel = require('../models/CounterModel');

var bcrypt = require('bcrypt');

var config = require('../config/config');

var utils = require('../utils/utils');

var updateExpert = function updateExpert(request, response) {
  var userId, dataValidation, _request$body, speciality, subSpeciality, specialitiesList, _specialitiesList, updatedUser;

  return regeneratorRuntime.async(function updateExpert$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = request.params.userId;
          dataValidation = expertValidation.updateExpert(request.body);

          if (dataValidation.isAccepted) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          _request$body = request.body, speciality = _request$body.speciality, subSpeciality = _request$body.subSpeciality;

          if (!speciality) {
            _context.next = 13;
            break;
          }

          _context.next = 9;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: speciality
            },
            type: 'MAIN'
          }));

        case 9:
          specialitiesList = _context.sent;

          if (!(specialitiesList.length != speciality.length)) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid specialities Ids',
            field: 'speciality'
          }));

        case 12:
          request.body.speciality = specialitiesList.map(function (special) {
            return special._id;
          });

        case 13:
          if (!subSpeciality) {
            _context.next = 20;
            break;
          }

          _context.next = 16;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: subSpeciality
            },
            type: 'SUB'
          }));

        case 16:
          _specialitiesList = _context.sent;

          if (!(_specialitiesList.length != subSpeciality.length)) {
            _context.next = 19;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid subspecialities Ids',
            field: 'subSpeciality'
          }));

        case 19:
          request.body.subSpeciality = _specialitiesList.map(function (special) {
            return special._id;
          });

        case 20:
          _context.next = 22;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, request.body, {
            "new": true
          }));

        case 22:
          updatedUser = _context.sent;
          updatedUser.password = undefined;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated expert successfully!',
            user: updatedUser
          }));

        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 31:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

var searchExperts = function searchExperts(request, response) {
  var specialityId, _request$query, gender, sortBy, subSpecialityId, page, limit, isAcceptPromoCodes, isOnline, skip, matchQuery, sortQuery, experts, totalExperts;

  return regeneratorRuntime.async(function searchExperts$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          specialityId = request.params.specialityId;
          _request$query = request.query, gender = _request$query.gender, sortBy = _request$query.sortBy, subSpecialityId = _request$query.subSpecialityId, page = _request$query.page, limit = _request$query.limit, isAcceptPromoCodes = _request$query.isAcceptPromoCodes, isOnline = _request$query.isOnline;
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

          if (isAcceptPromoCodes == 'TRUE') {
            matchQuery.isAcceptPromoCodes = true;
          } else if (isAcceptPromoCodes == 'FALSE') {
            matchQuery.isAcceptPromoCodes = false;
          }

          if (isOnline == 'TRUE') {
            matchQuery.isOnline = true;
          } else if (isOnline == 'FALSE') {
            matchQuery.isOnline = false;
          }

          _context2.next = 15;
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

        case 15:
          experts = _context2.sent;
          _context2.next = 18;
          return regeneratorRuntime.awrap(UserModel.countDocuments(matchQuery));

        case 18:
          totalExperts = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            totalExperts: totalExperts,
            experts: experts
          }));

        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

var searchExpertsByNameAndSpeciality = function searchExpertsByNameAndSpeciality(request, response) {
  var _request$params, specialityId, name, matchQuery, experts, totalExperts;

  return regeneratorRuntime.async(function searchExpertsByNameAndSpeciality$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
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
          _context3.next = 5;
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
          experts = _context3.sent;
          _context3.next = 8;
          return regeneratorRuntime.awrap(UserModel.countDocuments(matchQuery));

        case 8:
          totalExperts = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            totalExperts: totalExperts,
            experts: experts
          }));

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var addExpert = function addExpert(request, response) {
  var dataValidation, _request$body2, email, password, emailList, expertData, hashedPassword, counter, userObj, newUser;

  return regeneratorRuntime.async(function addExpert$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          dataValidation = expertValidation.addExpert(request.body);

          if (dataValidation.isAccepted) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body2 = request.body, email = _request$body2.email, password = _request$body2.password;
          _context4.next = 7;
          return regeneratorRuntime.awrap(UserModel.find({
            email: email,
            isVerified: true
          }));

        case 7:
          emailList = _context4.sent;

          if (!(emailList.length != 0)) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
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
          _context4.next = 15;
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
          counter = _context4.sent;
          expertData.userId = counter.value;
          userObj = new UserModel(expertData);
          _context4.next = 20;
          return regeneratorRuntime.awrap(userObj.save());

        case 20:
          newUser = _context4.sent;
          newUser.password = undefined;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added expert successfully!',
            user: newUser
          }));

        case 25:
          _context4.prev = 25;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 29:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 25]]);
};

var getExperts = function getExperts(request, response) {
  var speciality, _utils$statsQueryGene, searchQuery, matchQuery, experts, totalExperts;

  return regeneratorRuntime.async(function getExperts$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          speciality = request.query.speciality;
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          matchQuery = _objectSpread({}, searchQuery, {
            type: 'EXPERT',
            isVerified: true
          });

          if (speciality) {
            matchQuery.speciality = {
              $in: [mongoose.Types.ObjectId(speciality)]
            };
          }

          _context5.next = 7;
          return regeneratorRuntime.awrap(UserModel.aggregate([{
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
              localField: 'speciality',
              foreignField: '_id',
              as: 'speciality'
            }
          }, {
            $project: {
              password: 0
            }
          }]));

        case 7:
          experts = _context5.sent;
          _context5.next = 10;
          return regeneratorRuntime.awrap(UserModel.countDocuments(matchQuery));

        case 10:
          totalExperts = _context5.sent;
          experts.forEach(function (expert) {
            try {
              expert.profileCompletion = utils.calculateExpertProfileCompletePercentage(expert).completionPercentage;
            } catch (error) {
              error.message;
            }
          });
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            totalExperts: totalExperts,
            experts: experts
          }));

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 19:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var searchExpertsByName = function searchExpertsByName(request, response) {
  var name, matchQuery, experts;
  return regeneratorRuntime.async(function searchExpertsByName$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
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
          _context6.next = 6;
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
          experts = _context6.sent;
          experts.forEach(function (expert) {
            try {
              expert.profileCompletion = utils.calculateExpertProfileCompletePercentage(expert).completionPercentage;
            } catch (error) {
              error.message;
            }
          });
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            experts: experts
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

var deleteExpert = function deleteExpert(request, response) {
  var userId, appointmentsPromise, paymentsPromise, reviewsPromise, _ref, _ref2, appointments, payments, reviews, deletedUser;

  return regeneratorRuntime.async(function deleteExpert$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
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
          _context7.next = 7;
          return regeneratorRuntime.awrap(Promise.all([appointmentsPromise, paymentsPromise, reviewsPromise]));

        case 7:
          _ref = _context7.sent;
          _ref2 = _slicedToArray(_ref, 3);
          appointments = _ref2[0];
          payments = _ref2[1];
          reviews = _ref2[2];

          if (!(appointments.length != 0)) {
            _context7.next = 14;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Expert is registered with appointments',
            field: 'appointments'
          }));

        case 14:
          if (!(payments.length != 0)) {
            _context7.next = 16;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Expert is registered with payments',
            field: 'payments'
          }));

        case 16:
          if (!(reviews.length != 0)) {
            _context7.next = 18;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Expert is registered with reviews',
            field: 'reviews'
          }));

        case 18:
          _context7.next = 20;
          return regeneratorRuntime.awrap(UserModel.findByIdAndDelete(userId));

        case 20:
          deletedUser = _context7.sent;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted expert successfully!',
            user: deletedUser
          }));

        case 24:
          _context7.prev = 24;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 28:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

var addExpertBankInfo = function addExpertBankInfo(request, response) {
  var userId, dataValidation, _request$body3, accountNumber, accountHolderName, bankName, bankInfoData, updatedExpert;

  return regeneratorRuntime.async(function addExpertBankInfo$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          userId = request.params.userId;
          dataValidation = expertValidation.addBankInfo(request.body);

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
          _request$body3 = request.body, accountNumber = _request$body3.accountNumber, accountHolderName = _request$body3.accountHolderName, bankName = _request$body3.bankName;
          bankInfoData = {
            accountNumber: accountNumber,
            accountHolderName: accountHolderName,
            bankName: bankName
          };
          _context8.next = 9;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            'paymentInfo.bankAccount': bankInfoData
          }, {
            "new": true
          }));

        case 9:
          updatedExpert = _context8.sent;
          updatedExpert.password = undefined;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added expert bank information successfully!',
            user: updatedExpert
          }));

        case 14:
          _context8.prev = 14;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 18:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var addExpertMobileWalletInfo = function addExpertMobileWalletInfo(request, response) {
  var userId, dataValidation, walletNumber, updatedExpert;
  return regeneratorRuntime.async(function addExpertMobileWalletInfo$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          userId = request.params.userId;
          dataValidation = expertValidation.addMobileWalletInfo(request.body);

          if (dataValidation.isAccepted) {
            _context9.next = 5;
            break;
          }

          return _context9.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          walletNumber = request.body.walletNumber;
          _context9.next = 8;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            'paymentInfo.mobileWallet.walletNumber': walletNumber
          }, {
            "new": true
          }));

        case 8:
          updatedExpert = _context9.sent;
          updatedExpert.password = undefined;
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added expert mobile wallet information successfully!',
            user: updatedExpert
          }));

        case 13:
          _context9.prev = 13;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 17:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var updateExpertOnBoarding = function updateExpertOnBoarding(request, response) {
  var userId, isOnBoarded, dataValidation, updatedUser;
  return regeneratorRuntime.async(function updateExpertOnBoarding$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          userId = request.params.userId;
          isOnBoarded = request.body.isOnBoarded;
          dataValidation = expertValidation.updateExpertOnBoarding(request.body);

          if (dataValidation.isAccepted) {
            _context10.next = 6;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 6:
          _context10.next = 8;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            isOnBoarded: isOnBoarded
          }, {
            "new": true
          }));

        case 8:
          updatedUser = _context10.sent;
          updatedUser.password = undefined;
          return _context10.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated expert onboarding successfully!',
            user: updatedUser
          }));

        case 13:
          _context10.prev = 13;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          return _context10.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context10.t0.message
          }));

        case 17:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var updateExpertPromoCodeAcceptance = function updateExpertPromoCodeAcceptance(request, response) {
  var userId, isAcceptPromoCodes, dataValidation, updatedUser;
  return regeneratorRuntime.async(function updateExpertPromoCodeAcceptance$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          userId = request.params.userId;
          isAcceptPromoCodes = request.body.isAcceptPromoCodes;
          dataValidation = expertValidation.updateExpertPromoCodesAcceptance(request.body);

          if (dataValidation.isAccepted) {
            _context11.next = 6;
            break;
          }

          return _context11.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 6:
          _context11.next = 8;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            isAcceptPromoCodes: isAcceptPromoCodes
          }, {
            "new": true
          }));

        case 8:
          updatedUser = _context11.sent;
          updatedUser.password = undefined;
          return _context11.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated expert promo code acceptance successfully!',
            user: updatedUser
          }));

        case 13:
          _context11.prev = 13;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          return _context11.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context11.t0.message
          }));

        case 17:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var updateExpertOnlineStatus = function updateExpertOnlineStatus(request, response) {
  var userId, isOnline, dataValidation, updatedUser;
  return regeneratorRuntime.async(function updateExpertOnlineStatus$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          userId = request.params.userId;
          isOnline = request.body.isOnline;
          dataValidation = expertValidation.updateExpertOnline(request.body);

          if (dataValidation.isAccepted) {
            _context12.next = 6;
            break;
          }

          return _context12.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 6:
          _context12.next = 8;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            isOnline: isOnline
          }, {
            "new": true
          }));

        case 8:
          updatedUser = _context12.sent;
          updatedUser.password = undefined;
          return _context12.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated expert online status successfully!',
            user: updatedUser
          }));

        case 13:
          _context12.prev = 13;
          _context12.t0 = _context12["catch"](0);
          console.error(_context12.t0);
          return _context12.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context12.t0.message
          }));

        case 17:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var getExpertProfileCompletionPercentage = function getExpertProfileCompletionPercentage(request, response) {
  var userId, user, profileCompletionPercentage;
  return regeneratorRuntime.async(function getExpertProfileCompletionPercentage$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          userId = request.params.userId;
          _context13.next = 4;
          return regeneratorRuntime.awrap(UserModel.findById(userId));

        case 4:
          user = _context13.sent;
          user.password = undefined;
          profileCompletionPercentage = utils.calculateExpertProfileCompletePercentage(user);
          return _context13.abrupt("return", response.status(200).json({
            accepted: true,
            profileCompletionPercentage: profileCompletionPercentage,
            user: user
          }));

        case 10:
          _context13.prev = 10;
          _context13.t0 = _context13["catch"](0);
          console.error(_context13.t0);
          return _context13.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context13.t0.message
          }));

        case 14:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

module.exports = {
  updateExpert: updateExpert,
  searchExperts: searchExperts,
  searchExpertsByNameAndSpeciality: searchExpertsByNameAndSpeciality,
  searchExpertsByName: searchExpertsByName,
  addExpert: addExpert,
  getExperts: getExperts,
  deleteExpert: deleteExpert,
  addExpertBankInfo: addExpertBankInfo,
  addExpertMobileWalletInfo: addExpertMobileWalletInfo,
  updateExpertOnBoarding: updateExpertOnBoarding,
  updateExpertOnlineStatus: updateExpertOnlineStatus,
  getExpertProfileCompletionPercentage: getExpertProfileCompletionPercentage,
  updateExpertPromoCodeAcceptance: updateExpertPromoCodeAcceptance
};