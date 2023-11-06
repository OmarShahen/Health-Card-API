"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var config = require('../config/config');

var UserModel = require('../models/UserModel');

var ClinicModel = require('../models/ClinicModel');

var ClinicOwnerModel = require('../models/ClinicOwnerModel');

var CounterModel = require('../models/CounterModel');

var userValidation = require('../validations/users');

var bcrypt = require('bcrypt');

var mongoose = require('mongoose');

var SpecialityModel = require('../models/SpecialityModel');

var jwt = require('jsonwebtoken');

var translations = require('../i18n/index');

var getUser = function getUser(request, response) {
  var userId, user, token;
  return regeneratorRuntime.async(function getUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = request.params.userId;
          _context.next = 4;
          return regeneratorRuntime.awrap(UserModel.findById(userId).select({
            password: 0
          }));

        case 4:
          user = _context.sent;
          token = jwt.sign(user._doc, config.SECRET_KEY, {
            expiresIn: '30d'
          });
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            user: user,
            token: token
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

var getAppUsers = function getAppUsers(request, response) {
  var users;
  return regeneratorRuntime.async(function getAppUsers$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(UserModel.find({
            roles: {
              $nin: ['EMPLOYEE']
            },
            isVerified: true
          }).select({
            password: 0
          }).sort({
            lastLoginDate: -1,
            createdAt: -1
          }));

        case 3:
          users = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            users: users
          }));

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getUserSpeciality = function getUserSpeciality(request, response) {
  var userId, user, speciality, specialities;
  return regeneratorRuntime.async(function getUserSpeciality$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = request.params.userId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(UserModel.findById(userId).select({
            password: 0
          }));

        case 4:
          user = _context3.sent;
          speciality = user.speciality;
          _context3.next = 8;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: speciality
            }
          }));

        case 8:
          specialities = _context3.sent;
          user.speciality = specialities;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            user: user
          }));

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var updateUser = function updateUser(request, response) {
  var userId, dataValidation, _request$body, firstName, lastName, gender, dateOfBirth, newUserData, updatedUser;

  return regeneratorRuntime.async(function updateUser$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.updateUser(request.body);

          if (dataValidation.isAccepted) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          _request$body = request.body, firstName = _request$body.firstName, lastName = _request$body.lastName, gender = _request$body.gender, dateOfBirth = _request$body.dateOfBirth;
          newUserData = {
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            dateOfBirth: dateOfBirth
          };
          _context4.next = 9;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, newUserData, {
            "new": true
          }));

        case 9:
          updatedUser = _context4.sent;
          updatedUser.password = undefined;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated user successfully!'],
            user: updatedUser
          }));

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var updateUserSpeciality = function updateUserSpeciality(request, response) {
  var userId, dataValidation, speciality, specialities, newUserData, updatedUser;
  return regeneratorRuntime.async(function updateUserSpeciality$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.updateUserSpeciality(request.body);

          if (dataValidation.isAccepted) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          speciality = request.body.speciality;
          _context5.next = 8;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: speciality
            }
          }));

        case 8:
          specialities = _context5.sent;

          if (!(specialities.length != speciality.length)) {
            _context5.next = 11;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'speciality Id is not registered',
            field: 'speciality'
          }));

        case 11:
          newUserData = {
            speciality: specialities.map(function (special) {
              return special._id;
            })
          };
          _context5.next = 14;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, newUserData, {
            "new": true
          }));

        case 14:
          updatedUser = _context5.sent;
          updatedUser.password = undefined;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated user successfully!'],
            user: updatedUser
          }));

        case 19:
          _context5.prev = 19;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 23:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var updateUserEmail = function updateUserEmail(request, response) {
  var userId, dataValidation, email, emailList, updatedUser;
  return regeneratorRuntime.async(function updateUserEmail$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.updateUserEmail(request.body);

          if (dataValidation.isAccepted) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          email = request.body.email;
          _context6.next = 8;
          return regeneratorRuntime.awrap(UserModel.find({
            email: email
          }));

        case 8:
          emailList = _context6.sent;

          if (!(emailList.length != 0 && !emailList[0]._id.equals(userId))) {
            _context6.next = 11;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'email is already registered',
            field: 'email'
          }));

        case 11:
          _context6.next = 13;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            email: email
          }, {
            "new": true
          }));

        case 13:
          updatedUser = _context6.sent;
          updatedUser.password = undefined;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'updated user email successfully!',
            user: updatedUser
          }));

        case 18:
          _context6.prev = 18;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 22:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var updateUserLanguage = function updateUserLanguage(request, response) {
  var userId, lang, dataValidation, updatedUser;
  return regeneratorRuntime.async(function updateUserLanguage$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          userId = request.params.userId;
          lang = request.body.lang;
          dataValidation = userValidation.updateUserLanguage(request.body);

          if (dataValidation.isAccepted) {
            _context7.next = 6;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 6:
          _context7.next = 8;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            lang: lang
          }, {
            "new": true
          }));

        case 8:
          updatedUser = _context7.sent;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated language successfully!'],
            user: updatedUser
          }));

        case 12:
          _context7.prev = 12;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var updateUserPassword = function updateUserPassword(request, response) {
  var userId, dataValidation, password, user, newPassword, updatedUser;
  return regeneratorRuntime.async(function updateUserPassword$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.updateUserPassword(request.body);

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
          password = request.body.password;
          _context8.next = 8;
          return regeneratorRuntime.awrap(UserModel.findById(userId));

        case 8:
          user = _context8.sent;

          if (!bcrypt.compareSync(password, user.password)) {
            _context8.next = 11;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['New password must be diffrent from old password'],
            field: 'password'
          }));

        case 11:
          newPassword = bcrypt.hashSync(password, config.SALT_ROUNDS);
          _context8.next = 14;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            password: newPassword
          }, {
            "new": true
          }));

        case 14:
          updatedUser = _context8.sent;
          updatedUser.password = undefined;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated user password successfully!'],
            user: updatedUser
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

var verifyAndUpdateUserPassword = function verifyAndUpdateUserPassword(request, response) {
  var userId, dataValidation, _request$body2, newPassword, currentPassword, user, newUserPassword, updatedUser;

  return regeneratorRuntime.async(function verifyAndUpdateUserPassword$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.verifyAndUpdateUserPassword(request.body);

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
          _request$body2 = request.body, newPassword = _request$body2.newPassword, currentPassword = _request$body2.currentPassword;

          if (!(newPassword == currentPassword)) {
            _context9.next = 8;
            break;
          }

          return _context9.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['New password must be diffrent from old password'],
            field: 'newPassword'
          }));

        case 8:
          _context9.next = 10;
          return regeneratorRuntime.awrap(UserModel.findById(userId));

        case 10:
          user = _context9.sent;

          if (bcrypt.compareSync(currentPassword, user.password)) {
            _context9.next = 13;
            break;
          }

          return _context9.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Current password is invalid'],
            field: 'currentPassword'
          }));

        case 13:
          if (!bcrypt.compareSync(newPassword, user.password)) {
            _context9.next = 15;
            break;
          }

          return _context9.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Current password entered is already used'],
            field: 'newPassword'
          }));

        case 15:
          newUserPassword = bcrypt.hashSync(newPassword, config.SALT_ROUNDS);
          _context9.next = 18;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            password: newUserPassword
          }, {
            "new": true
          }));

        case 18:
          updatedUser = _context9.sent;
          updatedUser.password = undefined;
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated user password successfully!'],
            user: updatedUser
          }));

        case 23:
          _context9.prev = 23;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 27:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 23]]);
};

var deleteUser = function deleteUser(request, response) {
  var userId, user, _deleteUser;

  return regeneratorRuntime.async(function deleteUser$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          userId = request.params.userId;
          _context10.next = 4;
          return regeneratorRuntime.awrap(UserModel.findById(userId));

        case 4:
          user = _context10.sent;

          if (!(user.roles.includes('DOCTOR') || user.roles.includes('OWNER'))) {
            _context10.next = 7;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: false,
            message: "This user type cannot be deleted",
            field: 'userId'
          }));

        case 7:
          _context10.next = 9;
          return regeneratorRuntime.awrap(UserModel.findByIdAndDelete(userId));

        case 9:
          _deleteUser = _context10.sent;
          return _context10.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'user deleted successfully!',
            user: _deleteUser
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

var registerStaffToClinic = function registerStaffToClinic(request, response) {
  var userId, dataValidation, clinicId, clinicList, user, clinic, updatedUser;
  return regeneratorRuntime.async(function registerStaffToClinic$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.registerStaffToClinic(request.body);

          if (dataValidation.isAccepted) {
            _context11.next = 5;
            break;
          }

          return _context11.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          clinicId = request.body.clinicId;
          _context11.next = 8;
          return regeneratorRuntime.awrap(ClinicModel.find({
            clinicId: clinicId
          }));

        case 8:
          clinicList = _context11.sent;

          if (!(clinicList.length == 0)) {
            _context11.next = 11;
            break;
          }

          return _context11.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'No clinic is registered with that ID',
            field: 'clinicId'
          }));

        case 11:
          _context11.next = 13;
          return regeneratorRuntime.awrap(UserModel.findById(userId));

        case 13:
          user = _context11.sent;

          if (user.roles.includes('STAFF')) {
            _context11.next = 16;
            break;
          }

          return _context11.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid user role type to perform this operation',
            field: 'userId'
          }));

        case 16:
          if (!user.clinicId) {
            _context11.next = 18;
            break;
          }

          return _context11.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'user is already registered with a clinic',
            field: 'userId'
          }));

        case 18:
          clinic = clinicList[0];
          _context11.next = 21;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            clinicId: clinic._id
          }, {
            "new": true
          }));

        case 21:
          updatedUser = _context11.sent;
          updatedUser.password = undefined;
          return _context11.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Registered with a clinic successfully!',
            user: updatedUser
          }));

        case 26:
          _context11.prev = 26;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          return _context11.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context11.t0.message
          }));

        case 30:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 26]]);
};

var getUserMode = function getUserMode(request, response) {
  var userId, user, testClinicsOwned, mode;
  return regeneratorRuntime.async(function getUserMode$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          userId = request.params.userId;
          _context12.next = 4;
          return regeneratorRuntime.awrap(UserModel.findById(userId));

        case 4:
          user = _context12.sent;

          if (user.roles.includes('OWNER')) {
            _context12.next = 7;
            break;
          }

          return _context12.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'user must be owner',
            field: 'userId'
          }));

        case 7:
          _context12.next = 9;
          return regeneratorRuntime.awrap(ClinicOwnerModel.aggregate([{
            $match: {
              ownerId: mongoose.Types.ObjectId(userId)
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $match: {
              'clinic.mode': 'TEST'
            }
          }]));

        case 9:
          testClinicsOwned = _context12.sent;
          mode = 'PRODUCTION';

          if (testClinicsOwned.length > 0) {
            mode = 'TEST';
          }

          return _context12.abrupt("return", response.status(200).json({
            accepted: true,
            mode: mode
          }));

        case 15:
          _context12.prev = 15;
          _context12.t0 = _context12["catch"](0);
          console.error(_context12.t0);
          return _context12.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context12.t0.message
          }));

        case 19:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var addEmployeeUser = function addEmployeeUser(request, response) {
  var dataValidation, _request$body3, email, password, emailList, userPassword, counter, userData, userObj, newUser;

  return regeneratorRuntime.async(function addEmployeeUser$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          dataValidation = userValidation.addEmployeeUser(request.body);

          if (dataValidation.isAccepted) {
            _context13.next = 4;
            break;
          }

          return _context13.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body3 = request.body, email = _request$body3.email, password = _request$body3.password;
          _context13.next = 7;
          return regeneratorRuntime.awrap(UserModel.find({
            email: email,
            isVerified: true
          }));

        case 7:
          emailList = _context13.sent;

          if (!(emailList.length != 0)) {
            _context13.next = 10;
            break;
          }

          return _context13.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Email is already registered',
            field: 'email'
          }));

        case 10:
          userPassword = bcrypt.hashSync(password, config.SALT_ROUNDS);
          _context13.next = 13;
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

        case 13:
          counter = _context13.sent;
          userData = _objectSpread({
            userId: counter.value,
            isEmployee: true,
            isVerified: true
          }, request.body, {
            password: userPassword,
            roles: ['EMPLOYEE']
          });
          userObj = new UserModel(userData);
          _context13.next = 18;
          return regeneratorRuntime.awrap(userObj.save());

        case 18:
          newUser = _context13.sent;
          return _context13.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'User with employee roles is added successfully!',
            user: newUser
          }));

        case 22:
          _context13.prev = 22;
          _context13.t0 = _context13["catch"](0);
          console.error(_context13.t0);
          return _context13.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context13.t0.message
          }));

        case 26:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

module.exports = {
  getUser: getUser,
  getAppUsers: getAppUsers,
  getUserSpeciality: getUserSpeciality,
  updateUser: updateUser,
  updateUserSpeciality: updateUserSpeciality,
  updateUserEmail: updateUserEmail,
  updateUserLanguage: updateUserLanguage,
  updateUserPassword: updateUserPassword,
  verifyAndUpdateUserPassword: verifyAndUpdateUserPassword,
  deleteUser: deleteUser,
  registerStaffToClinic: registerStaffToClinic,
  getUserMode: getUserMode,
  addEmployeeUser: addEmployeeUser
};