"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var config = require('../config/config');

var authValidation = require('../validations/auth');

var jwt = require('jsonwebtoken');

var bcrypt = require('bcrypt');

var UserModel = require('../models/UserModel');

var ClinicModel = require('../models/ClinicModel');

var CounterModel = require('../models/CounterModel');

var ClinicRequestModel = require('../models/ClinicRequestModel');

var SpecialityModel = require('../models/SpecialityModel');

var InvoiceModel = require('../models/InvoiceModel');

var EmailVerificationModel = require('../models/EmailVerificationModel');

var _require = require('../utils/random-number'),
    generateVerificationCode = _require.generateVerificationCode;

var utils = require('../utils/utils');

var _require2 = require('../mails/verification-code'),
    sendVerificationCode = _require2.sendVerificationCode;

var _require3 = require('../mails/forgot-password'),
    sendForgotPasswordVerificationCode = _require3.sendForgotPasswordVerificationCode;

var _require4 = require('../mails/delete-account'),
    sendDeleteAccountCode = _require4.sendDeleteAccountCode;

var translations = require('../i18n/index');

var userSignup = function userSignup(request, response) {
  var _response$status$json, dataValidation, _request$body, email, password, speciality, roles, emailList, specialitiesList, counter, userPassword, userData, userObj, newUser, verificationCode, mailData, emailVerificationData, emailVerificationObj, newEmailVerification;

  return regeneratorRuntime.async(function userSignup$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          dataValidation = authValidation.signup(request.body);

          if (dataValidation.isAccepted) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body = request.body, email = _request$body.email, password = _request$body.password, speciality = _request$body.speciality, roles = _request$body.roles;
          _context.next = 7;
          return regeneratorRuntime.awrap(UserModel.find({
            email: email,
            isVerified: true
          }));

        case 7:
          emailList = _context.sent;

          if (!(emailList.length != 0)) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Email is already registered'],
            field: 'email'
          }));

        case 10:
          specialitiesList = [];

          if (!roles.includes('DOCTOR')) {
            _context.next = 17;
            break;
          }

          _context.next = 14;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: speciality
            }
          }));

        case 14:
          specialitiesList = _context.sent;

          if (!(specialitiesList.length != speciality.length)) {
            _context.next = 17;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid specialities Ids',
            field: 'speciality'
          }));

        case 17:
          _context.next = 19;
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

        case 19:
          counter = _context.sent;
          request.body.speciality = specialitiesList.map(function (special) {
            return special._id;
          });
          userPassword = bcrypt.hashSync(password, config.SALT_ROUNDS);
          userData = _objectSpread({}, request.body, {
            userId: counter.value,
            password: userPassword
          });
          userData._id = undefined;
          userObj = new UserModel(userData);
          _context.next = 27;
          return regeneratorRuntime.awrap(userObj.save());

        case 27:
          newUser = _context.sent;
          verificationCode = generateVerificationCode();
          _context.next = 31;
          return regeneratorRuntime.awrap(sendVerificationCode({
            receiverEmail: email,
            verificationCode: verificationCode
          }));

        case 31:
          mailData = _context.sent;
          emailVerificationData = {
            userId: newUser._id,
            code: verificationCode
          };
          emailVerificationObj = new EmailVerificationModel(emailVerificationData);
          _context.next = 36;
          return regeneratorRuntime.awrap(emailVerificationObj.save());

        case 36:
          newEmailVerification = _context.sent;
          newUser.password = undefined;
          return _context.abrupt("return", response.status(200).json((_response$status$json = {
            accepted: true,
            message: 'Account created successfully!',
            mailSuccess: mailData.isSent
          }, _defineProperty(_response$status$json, "message", mailData.isSent ? 'email is sent successfully!' : translations[request.query.lang]['There was a problem sending your email']), _defineProperty(_response$status$json, "user", newUser), _defineProperty(_response$status$json, "emailVerification", newEmailVerification), _response$status$json)));

        case 41:
          _context.prev = 41;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 45:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 41]]);
};

var userLogin = function userLogin(request, response) {
  var dataValidation, _request$body2, email, password, userList, user, formattedUser, updatedUser, userClinic, token;

  return regeneratorRuntime.async(function userLogin$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = authValidation.login(request.body);

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
          _request$body2 = request.body, email = _request$body2.email, password = _request$body2.password;
          _context2.next = 7;
          return regeneratorRuntime.awrap(UserModel.find({
            email: email,
            isverified: true
          }));

        case 7:
          userList = _context2.sent;

          if (!(userList.length == 0)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Email is not registered'],
            field: 'email'
          }));

        case 10:
          user = userList[0];

          if (bcrypt.compareSync(password, user.password)) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Incorrect password'],
            field: 'password'
          }));

        case 13:
          formattedUser = _objectSpread({}, user._doc);
          _context2.next = 16;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(user._id, {
            lastLoginDate: new Date()
          }, {
            "new": true
          }));

        case 16:
          updatedUser = _context2.sent;

          if (!user.roles.includes('STAFF')) {
            _context2.next = 22;
            break;
          }

          _context2.next = 20;
          return regeneratorRuntime.awrap(ClinicModel.findById(user.clinicId));

        case 20:
          userClinic = _context2.sent;
          formattedUser.clinic = userClinic;

        case 22:
          updatedUser.password = undefined;
          token = jwt.sign(user._doc, config.SECRET_KEY, {
            expiresIn: '30d'
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            token: token,
            user: updatedUser
          }));

        case 27:
          _context2.prev = 27;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 31:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

var userEmployeeLogin = function userEmployeeLogin(request, response) {
  var dataValidation, _request$body3, email, password, userList, user, formattedUser, updatedUser, userClinic, token;

  return regeneratorRuntime.async(function userEmployeeLogin$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = authValidation.login(request.body);

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
          _request$body3 = request.body, email = _request$body3.email, password = _request$body3.password;
          _context3.next = 7;
          return regeneratorRuntime.awrap(UserModel.find({
            email: email,
            isverified: true,
            isEmployee: true,
            roles: {
              $in: ['EMPLOYEE']
            }
          }));

        case 7:
          userList = _context3.sent;

          if (!(userList.length == 0)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Email is not registered'],
            field: 'email'
          }));

        case 10:
          user = userList[0];

          if (bcrypt.compareSync(password, user.password)) {
            _context3.next = 13;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Incorrect password'],
            field: 'password'
          }));

        case 13:
          formattedUser = _objectSpread({}, user._doc);
          _context3.next = 16;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(user._id, {
            lastLoginDate: new Date()
          }, {
            "new": true
          }));

        case 16:
          updatedUser = _context3.sent;

          if (!user.roles.includes('STAFF')) {
            _context3.next = 22;
            break;
          }

          _context3.next = 20;
          return regeneratorRuntime.awrap(ClinicModel.findById(user.clinicId));

        case 20:
          userClinic = _context3.sent;
          formattedUser.clinic = userClinic;

        case 22:
          updatedUser.password = undefined;
          token = jwt.sign(user._doc, config.SECRET_KEY, {
            expiresIn: '30d'
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            token: token,
            user: updatedUser
          }));

        case 27:
          _context3.prev = 27;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 31:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

var verifyEmailVerificationCode = function verifyEmailVerificationCode(request, response) {
  var _request$params, userId, verificationCode, emailVerificationList, updatedUserPromise, deleteCodesPromise, _ref, _ref2, updatedUser, deleteCodes, token;

  return regeneratorRuntime.async(function verifyEmailVerificationCode$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _request$params = request.params, userId = _request$params.userId, verificationCode = _request$params.verificationCode;
          _context4.next = 4;
          return regeneratorRuntime.awrap(EmailVerificationModel.find({
            userId: userId,
            code: verificationCode
          }));

        case 4:
          emailVerificationList = _context4.sent;

          if (!(emailVerificationList.length == 0)) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['There is no verification code registered'],
            field: 'code'
          }));

        case 7:
          updatedUserPromise = UserModel.findByIdAndUpdate(userId, {
            isVerified: true
          }, {
            "new": true
          });
          deleteCodesPromise = EmailVerificationModel.deleteMany({
            userId: userId
          });
          _context4.next = 11;
          return regeneratorRuntime.awrap(Promise.all([updatedUserPromise, deleteCodesPromise]));

        case 11:
          _ref = _context4.sent;
          _ref2 = _slicedToArray(_ref, 2);
          updatedUser = _ref2[0];
          deleteCodes = _ref2[1];
          updatedUser.password = undefined;
          token = jwt.sign(updatedUser._doc, config.SECRET_KEY, {
            expiresIn: '30d'
          });
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'account has been verified successfully!',
            user: updatedUser,
            deletedCodes: deleteCodes.deletedCount,
            token: token
          }));

        case 20:
          _context4.prev = 20;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 24:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

var verifyPersonalInfo = function verifyPersonalInfo(request, response) {
  var dataValidation;
  return regeneratorRuntime.async(function verifyPersonalInfo$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          dataValidation = authValidation.verifyPersonalInfo(request.body);

          if (dataValidation.isAccepted) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            data: request.body
          }));

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var verifyDemographicInfo = function verifyDemographicInfo(request, response) {
  var dataValidation;
  return regeneratorRuntime.async(function verifyDemographicInfo$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          dataValidation = authValidation.verifyDemographicInfo(request.body);

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
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            data: request.body
          }));

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var verifySpecialityInfo = function verifySpecialityInfo(request, response) {
  var dataValidation, speciality, specialitiesList;
  return regeneratorRuntime.async(function verifySpecialityInfo$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          dataValidation = authValidation.verifySpecialityInfo(request.body);

          if (dataValidation.isAccepted) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          speciality = request.body.speciality;
          _context7.next = 7;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: speciality
            }
          }));

        case 7:
          specialitiesList = _context7.sent;

          if (!(specialitiesList.length != speciality.length)) {
            _context7.next = 10;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid specialities Ids',
            field: 'speciality'
          }));

        case 10:
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            data: request.body
          }));

        case 13:
          _context7.prev = 13;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 17:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var verifyEmail = function verifyEmail(request, response) {
  var email, emailList;
  return regeneratorRuntime.async(function verifyEmail$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          email = request.params.email;

          if (utils.isEmailValid(email)) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'email format is invalid',
            field: 'email'
          }));

        case 4:
          _context8.next = 6;
          return regeneratorRuntime.awrap(UserModel.find({
            email: email,
            isVerified: true
          }));

        case 6:
          emailList = _context8.sent;

          if (!(emailList.length != 0)) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'email is already registered',
            field: 'email'
          }));

        case 9:
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            email: email
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

var setUserVerified = function setUserVerified(request, response) {
  var userId, updatedUser;
  return regeneratorRuntime.async(function setUserVerified$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          userId = request.params.userId;
          _context9.next = 4;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            isVerified: true
          }, {
            "new": true
          }));

        case 4:
          updatedUser = _context9.sent;
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'account verified successfully!',
            user: updatedUser
          }));

        case 8:
          _context9.prev = 8;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 12:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var addUserEmailVerificationCode = function addUserEmailVerificationCode(request, response) {
  var userId, user, emailVerificationData, emailVerificationObj, newEmailverification;
  return regeneratorRuntime.async(function addUserEmailVerificationCode$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          userId = request.params.userId;

          if (utils.isObjectId(userId)) {
            _context10.next = 4;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'user Id format is invalid',
            field: 'userId'
          }));

        case 4:
          _context10.next = 6;
          return regeneratorRuntime.awrap(UserModel.findById(userId));

        case 6:
          user = _context10.sent;

          if (user) {
            _context10.next = 9;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'user Id does not exist',
            field: 'userId'
          }));

        case 9:
          if (!user.isVerified) {
            _context10.next = 11;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'user account is already verified',
            field: 'userId'
          }));

        case 11:
          emailVerificationData = {
            userId: userId,
            code: generateVerificationCode()
          };
          emailVerificationObj = new EmailVerificationModel(emailVerificationData);
          _context10.next = 15;
          return regeneratorRuntime.awrap(emailVerificationObj.save());

        case 15:
          newEmailverification = _context10.sent;
          return _context10.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'email verification code created successfully!',
            emailVerification: newEmailverification
          }));

        case 19:
          _context10.prev = 19;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          return _context10.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context10.t0.message
          }));

        case 23:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var sendEmail = function sendEmail(request, response) {
  var mailData;
  return regeneratorRuntime.async(function sendEmail$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap(sendVerificationCode({
            receiverEmail: 'omarredaelsayedmohamed@gmail.com',
            verificationCode: generateVerificationCode()
          }));

        case 3:
          mailData = _context11.sent;
          return _context11.abrupt("return", response.status(200).json({
            accepted: true,
            message: mailData.isSent ? 'email sent successfully!' : 'error sending email'
          }));

        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          return _context11.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context11.t0.message
          }));

        case 11:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var forgotPassword = function forgotPassword(request, response) {
  var dataValidation, email, emailList, user, verificationCode, verificationData, updatedUserPromise, forgotPasswordData, sendEmailPromise, _ref3, _ref4, updatedUser, _sendEmail;

  return regeneratorRuntime.async(function forgotPassword$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          dataValidation = authValidation.forgotPassword(request.body);

          if (dataValidation.isAccepted) {
            _context12.next = 4;
            break;
          }

          return _context12.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          email = request.body.email;
          _context12.next = 7;
          return regeneratorRuntime.awrap(UserModel.find({
            email: email,
            isVerified: true
          }));

        case 7:
          emailList = _context12.sent;

          if (!(emailList.length == 0)) {
            _context12.next = 10;
            break;
          }

          return _context12.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Email is not registered'],
            field: 'email'
          }));

        case 10:
          user = emailList[0];
          verificationCode = generateVerificationCode();
          verificationData = {
            resetPassword: {
              verificationCode: verificationCode,
              expirationDate: Date.now() + 3600000 // 1 hour

            }
          };
          updatedUserPromise = UserModel.findByIdAndUpdate(user._id, verificationData, {
            "new": true
          });
          forgotPasswordData = {
            receiverEmail: email,
            verificationCode: verificationCode
          };
          sendEmailPromise = sendForgotPasswordVerificationCode(forgotPasswordData);
          _context12.next = 18;
          return regeneratorRuntime.awrap(Promise.all([updatedUserPromise, sendEmailPromise]));

        case 18:
          _ref3 = _context12.sent;
          _ref4 = _slicedToArray(_ref3, 2);
          updatedUser = _ref4[0];
          _sendEmail = _ref4[1];

          if (_sendEmail.isSent) {
            _context12.next = 24;
            break;
          }

          return _context12.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['There was a problem sending your email'],
            field: 'isSent'
          }));

        case 24:
          return _context12.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Verification code is sent successfully!'
          }));

        case 27:
          _context12.prev = 27;
          _context12.t0 = _context12["catch"](0);
          console.error(_context12.t0);
          return _context12.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context12.t0.message
          }));

        case 31:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

var sendUserDeleteAccountVerificationCode = function sendUserDeleteAccountVerificationCode(request, response) {
  var userId, user, invoices, verificationCode, verificationData, updatedUserPromise, deleteAccountData, sendEmailPromise, _ref5, _ref6, updatedUser, _sendEmail2;

  return regeneratorRuntime.async(function sendUserDeleteAccountVerificationCode$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          userId = request.params.userId;
          _context13.next = 4;
          return regeneratorRuntime.awrap(UserModel.findById(userId));

        case 4:
          user = _context13.sent;

          if (user.roles.includes('STAFF')) {
            _context13.next = 7;
            break;
          }

          return _context13.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Your account is with a role that cannot be deleted'],
            field: 'userId'
          }));

        case 7:
          _context13.next = 9;
          return regeneratorRuntime.awrap(InvoiceModel.find({
            creatorId: userId
          }));

        case 9:
          invoices = _context13.sent;

          if (!(invoices.length != 0)) {
            _context13.next = 12;
            break;
          }

          return _context13.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Data registered with the account',
            field: 'userId'
          }));

        case 12:
          verificationCode = generateVerificationCode();
          verificationData = {
            deleteAccount: {
              verificationCode: verificationCode,
              expirationDate: Date.now() + 3600000 // 1 hour

            }
          };
          updatedUserPromise = UserModel.findByIdAndUpdate(user._id, verificationData, {
            "new": true
          });
          deleteAccountData = {
            receiverEmail: user.email,
            verificationCode: verificationCode
          };
          sendEmailPromise = sendDeleteAccountCode(deleteAccountData);
          _context13.next = 19;
          return regeneratorRuntime.awrap(Promise.all([updatedUserPromise, sendEmailPromise]));

        case 19:
          _ref5 = _context13.sent;
          _ref6 = _slicedToArray(_ref5, 2);
          updatedUser = _ref6[0];
          _sendEmail2 = _ref6[1];

          if (_sendEmail2.isSent) {
            _context13.next = 25;
            break;
          }

          return _context13.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['There was a problem sending your email'],
            field: 'isSent'
          }));

        case 25:
          return _context13.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Verification code is sent successfully!'
          }));

        case 28:
          _context13.prev = 28;
          _context13.t0 = _context13["catch"](0);
          console.error(_context13.t0);
          return _context13.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context13.t0.message
          }));

        case 32:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 28]]);
};

var verifyDeleteAccountVerificationCode = function verifyDeleteAccountVerificationCode(request, response) {
  var _request$params2, userId, verificationCode, userList, user, deleteClinicRequests, deletedUser;

  return regeneratorRuntime.async(function verifyDeleteAccountVerificationCode$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _request$params2 = request.params, userId = _request$params2.userId, verificationCode = _request$params2.verificationCode;
          _context14.next = 4;
          return regeneratorRuntime.awrap(UserModel.find({
            _id: userId,
            isVerified: true,
            'deleteAccount.verificationCode': verificationCode,
            'deleteAccount.expirationDate': {
              $gt: Date.now()
            }
          }));

        case 4:
          userList = _context14.sent;

          if (!(userList.length == 0)) {
            _context14.next = 7;
            break;
          }

          return _context14.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Verification code is not registered'],
            field: 'verificationCode'
          }));

        case 7:
          user = userList[0];

          if (!user.roles.includes('STAFF')) {
            _context14.next = 12;
            break;
          }

          _context14.next = 11;
          return regeneratorRuntime.awrap(ClinicRequestModel.deleteMany({
            userId: userId
          }));

        case 11:
          deleteClinicRequests = _context14.sent;

        case 12:
          _context14.next = 14;
          return regeneratorRuntime.awrap(UserModel.findByIdAndDelete(userId));

        case 14:
          deletedUser = _context14.sent;
          return _context14.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'User account is deleted successfully!',
            user: deletedUser
          }));

        case 18:
          _context14.prev = 18;
          _context14.t0 = _context14["catch"](0);
          console.error(_context14.t0);
          return _context14.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context14.t0.message
          }));

        case 22:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var verifyResetPasswordVerificationCode = function verifyResetPasswordVerificationCode(request, response) {
  var dataValidation, _request$body4, email, verificationCode, userList;

  return regeneratorRuntime.async(function verifyResetPasswordVerificationCode$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          dataValidation = authValidation.verifyResetPasswordVerificationCode(request.body);

          if (dataValidation.isAccepted) {
            _context15.next = 4;
            break;
          }

          return _context15.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body4 = request.body, email = _request$body4.email, verificationCode = _request$body4.verificationCode;
          _context15.next = 7;
          return regeneratorRuntime.awrap(UserModel.find({
            email: email,
            isVerified: true,
            'resetPassword.verificationCode': verificationCode,
            'resetPassword.expirationDate': {
              $gt: Date.now()
            }
          }));

        case 7:
          userList = _context15.sent;

          if (!(userList.length == 0)) {
            _context15.next = 10;
            break;
          }

          return _context15.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Verification code is not registered'],
            field: 'verificationCode'
          }));

        case 10:
          return _context15.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'verification code is verified!'
          }));

        case 13:
          _context15.prev = 13;
          _context15.t0 = _context15["catch"](0);
          console.error(_context15.t0);
          return _context15.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context15.t0.message
          }));

        case 17:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var resetPassword = function resetPassword(request, response) {
  var dataValidation, _request$body5, email, verificationCode, password, userList, user, userId, newUserPassword, updateUserData, updatedUser;

  return regeneratorRuntime.async(function resetPassword$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          dataValidation = authValidation.resetPassword(request.body);

          if (dataValidation.isAccepted) {
            _context16.next = 4;
            break;
          }

          return _context16.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body5 = request.body, email = _request$body5.email, verificationCode = _request$body5.verificationCode, password = _request$body5.password;
          _context16.next = 7;
          return regeneratorRuntime.awrap(UserModel.find({
            email: email,
            isVerified: true,
            'resetPassword.verificationCode': verificationCode,
            'resetPassword.expirationDate': {
              $gt: Date.now()
            }
          }));

        case 7:
          userList = _context16.sent;

          if (!(userList.length == 0)) {
            _context16.next = 10;
            break;
          }

          return _context16.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Verification code is not registered'],
            field: 'verificationCode'
          }));

        case 10:
          user = userList[0];
          userId = user._id;

          if (!bcrypt.compareSync(password, user.password)) {
            _context16.next = 14;
            break;
          }

          return _context16.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Enter a new password to the current one'],
            field: 'password'
          }));

        case 14:
          newUserPassword = bcrypt.hashSync(password, config.SALT_ROUNDS);
          updateUserData = {
            password: newUserPassword,
            resetPassword: {
              verificationCode: null,
              expirationDate: null
            }
          };
          _context16.next = 18;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, updateUserData, {
            "new": true
          }));

        case 18:
          updatedUser = _context16.sent;
          updatedUser.password = undefined;
          return _context16.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated user password successfully!'],
            user: updatedUser
          }));

        case 23:
          _context16.prev = 23;
          _context16.t0 = _context16["catch"](0);
          console.error(_context16.t0);
          return _context16.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context16.t0.message
          }));

        case 27:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[0, 23]]);
};

module.exports = {
  userSignup: userSignup,
  userLogin: userLogin,
  userEmployeeLogin: userEmployeeLogin,
  verifyEmailVerificationCode: verifyEmailVerificationCode,
  verifyPersonalInfo: verifyPersonalInfo,
  verifyDemographicInfo: verifyDemographicInfo,
  verifySpecialityInfo: verifySpecialityInfo,
  verifyEmail: verifyEmail,
  setUserVerified: setUserVerified,
  addUserEmailVerificationCode: addUserEmailVerificationCode,
  sendEmail: sendEmail,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
  verifyResetPasswordVerificationCode: verifyResetPasswordVerificationCode,
  sendUserDeleteAccountVerificationCode: sendUserDeleteAccountVerificationCode,
  verifyDeleteAccountVerificationCode: verifyDeleteAccountVerificationCode
};