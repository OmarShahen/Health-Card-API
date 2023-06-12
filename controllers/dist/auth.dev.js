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

var CounterModel = require('../models/CounterModel');

var SpecialityModel = require('../models/SpecialityModel');

var EmailVerificationModel = require('../models/EmailVerificationModel');

var _require = require('../utils/random-number'),
    generateVerificationCode = _require.generateVerificationCode;

var utils = require('../utils/utils');

var nodemailer = require('nodemailer');

var _require2 = require('../mails/verification-code'),
    sendVerificationCode = _require2.sendVerificationCode;

var userSignup = function userSignup(request, response) {
  var _response$status$json, dataValidation, _request$body, email, password, emailList, counter, userPassword, userData, userObj, newUser, verificationCode, mailData, emailVerificationData, emailVerificationObj, newEmailVerification, token;

  return regeneratorRuntime.async(function userSignup$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          dataValidation = authValidation.doctorSignup(request.body);

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
          _request$body = request.body, email = _request$body.email, password = _request$body.password;
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
            message: 'Email is already registered',
            field: 'email'
          }));

        case 10:
          _context.next = 12;
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

        case 12:
          counter = _context.sent;
          userPassword = bcrypt.hashSync(password, config.SALT_ROUNDS);
          userData = _objectSpread({}, request.body, {
            userId: counter.value,
            password: userPassword
          });
          userObj = new UserModel(userData);
          _context.next = 18;
          return regeneratorRuntime.awrap(userObj.save());

        case 18:
          newUser = _context.sent;
          verificationCode = generateVerificationCode();
          _context.next = 22;
          return regeneratorRuntime.awrap(sendVerificationCode({
            receiverEmail: email,
            verificationCode: verificationCode
          }));

        case 22:
          mailData = _context.sent;
          emailVerificationData = {
            userId: newUser._id,
            code: verificationCode
          };
          emailVerificationObj = new EmailVerificationModel(emailVerificationData);
          _context.next = 27;
          return regeneratorRuntime.awrap(emailVerificationObj.save());

        case 27:
          newEmailVerification = _context.sent;
          newUser.password = undefined;
          token = jwt.sign({
            user: newUser
          }, config.SECRET_KEY, {
            expiresIn: '30d'
          });
          return _context.abrupt("return", response.status(200).json((_response$status$json = {
            accepted: true,
            message: 'Account created successfully!',
            mailSuccess: mailData.isSent
          }, _defineProperty(_response$status$json, "message", mailData.isSent ? 'email is sent successfully!' : 'there was a problem sending your email'), _defineProperty(_response$status$json, "user", newUser), _defineProperty(_response$status$json, "emailVerification", newEmailVerification), _defineProperty(_response$status$json, "accessToken", token), _response$status$json)));

        case 33:
          _context.prev = 33;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 37:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 33]]);
};

var userLogin = function userLogin(request, response) {
  var dataValidation, _request$body2, email, password, userList, user, token;

  return regeneratorRuntime.async(function userLogin$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = authValidation.doctorLogin(request.body);

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
            message: 'Email is not registered',
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
            message: 'Incorrect password',
            field: 'password'
          }));

        case 13:
          user.password = undefined;
          token = jwt.sign(user._doc, config.SECRET_KEY, {
            expiresIn: '30d'
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            token: token,
            user: user
          }));

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var verifyEmailVerificationCode = function verifyEmailVerificationCode(request, response) {
  var _request$params, userId, verificationCode, emailVerificationList, updatedUserPromise, deleteCodesPromise, _ref, _ref2, updatedUser, deleteCodes;

  return regeneratorRuntime.async(function verifyEmailVerificationCode$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _request$params = request.params, userId = _request$params.userId, verificationCode = _request$params.verificationCode;
          _context3.next = 4;
          return regeneratorRuntime.awrap(EmailVerificationModel.find({
            userId: userId,
            code: verificationCode
          }));

        case 4:
          emailVerificationList = _context3.sent;

          if (!(emailVerificationList.length == 0)) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'there is no verification code registered',
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
          _context3.next = 11;
          return regeneratorRuntime.awrap(Promise.all([updatedUserPromise, deleteCodesPromise]));

        case 11:
          _ref = _context3.sent;
          _ref2 = _slicedToArray(_ref, 2);
          updatedUser = _ref2[0];
          deleteCodes = _ref2[1];
          updatedUser.password = undefined;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'account has been verified successfully!',
            user: updatedUser,
            deletedCodes: deleteCodes.deletedCount
          }));

        case 19:
          _context3.prev = 19;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var verifyPersonalInfo = function verifyPersonalInfo(request, response) {
  var dataValidation;
  return regeneratorRuntime.async(function verifyPersonalInfo$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          dataValidation = authValidation.verifyPersonalInfo(request.body);

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
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            data: request.body
          }));

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var verifySpecialityInfo = function verifySpecialityInfo(request, response) {
  var dataValidation, speciality, specialitiesList;
  return regeneratorRuntime.async(function verifySpecialityInfo$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          dataValidation = authValidation.verifySpecialityInfo(request.body);

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
          speciality = request.body.speciality;
          _context5.next = 7;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: speciality
            }
          }));

        case 7:
          specialitiesList = _context5.sent;

          if (!(specialitiesList.length != speciality.length)) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid specialities Ids',
            field: 'speciality'
          }));

        case 10:
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            data: request.body
          }));

        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 17:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var verifyEmail = function verifyEmail(request, response) {
  var email, emailList;
  return regeneratorRuntime.async(function verifyEmail$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          email = request.params.email;

          if (utils.isEmailValid(email)) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'email format is invalid',
            field: 'email'
          }));

        case 4:
          _context6.next = 6;
          return regeneratorRuntime.awrap(UserModel.find({
            email: email,
            isVerified: true
          }));

        case 6:
          emailList = _context6.sent;

          if (!(emailList.length != 0)) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'email is already registered',
            field: 'email'
          }));

        case 9:
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            email: email
          }));

        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 16:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var setUserVerified = function setUserVerified(request, response) {
  var userId, updatedUser;
  return regeneratorRuntime.async(function setUserVerified$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          userId = request.params.userId;
          _context7.next = 4;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            isVerified: true
          }, {
            "new": true
          }));

        case 4:
          updatedUser = _context7.sent;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'account verified successfully!',
            user: updatedUser
          }));

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var addUserEmailVerificationCode = function addUserEmailVerificationCode(request, response) {
  var userId, user, emailVerificationData, emailVerificationObj, newEmailverification;
  return regeneratorRuntime.async(function addUserEmailVerificationCode$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          userId = request.params.userId;

          if (utils.isObjectId(userId)) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'user Id format is invalid',
            field: 'userId'
          }));

        case 4:
          _context8.next = 6;
          return regeneratorRuntime.awrap(UserModel.findById(userId));

        case 6:
          user = _context8.sent;

          if (user) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'user Id does not exist',
            field: 'userId'
          }));

        case 9:
          if (!user.isVerified) {
            _context8.next = 11;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
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
          _context8.next = 15;
          return regeneratorRuntime.awrap(emailVerificationObj.save());

        case 15:
          newEmailverification = _context8.sent;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'email verification code created successfully!',
            emailVerification: newEmailverification
          }));

        case 19:
          _context8.prev = 19;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 23:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var sendEmail = function sendEmail(request, response) {
  var mailData;
  return regeneratorRuntime.async(function sendEmail$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(sendVerificationCode({
            receiverEmail: 'moderna.alex.eg@gmail.com',
            verificationCode: generateVerificationCode()
          }));

        case 3:
          mailData = _context9.sent;
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            message: mailData.isSent ? 'email sent successfully!' : 'error sending email'
          }));

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 11:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = {
  userSignup: userSignup,
  userLogin: userLogin,
  verifyEmailVerificationCode: verifyEmailVerificationCode,
  verifyPersonalInfo: verifyPersonalInfo,
  verifySpecialityInfo: verifySpecialityInfo,
  verifyEmail: verifyEmail,
  setUserVerified: setUserVerified,
  addUserEmailVerificationCode: addUserEmailVerificationCode,
  sendEmail: sendEmail
};