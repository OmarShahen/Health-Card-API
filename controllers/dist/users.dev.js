"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var config = require('../config/config');

var UserModel = require('../models/UserModel');

var CounterModel = require('../models/CounterModel');

var userValidation = require('../validations/users');

var bcrypt = require('bcrypt');

var mongoose = require('mongoose');

var SpecialityModel = require('../models/SpecialityModel');

var translations = require('../i18n/index');

var getUser = function getUser(request, response) {
  var userId, userList;
  return regeneratorRuntime.async(function getUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = request.params.userId;
          _context.next = 4;
          return regeneratorRuntime.awrap(UserModel.aggregate([{
            $match: {
              _id: mongoose.Types.ObjectId(userId)
            }
          }, {
            $limit: 1
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

        case 4:
          userList = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            user: userList[0]
          }));

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getExpertUser = function getExpertUser(request, response) {
  var userId, userList;
  return regeneratorRuntime.async(function getExpertUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = request.params.userId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(UserModel.aggregate([{
            $match: {
              _id: mongoose.Types.ObjectId(userId),
              type: 'EXPERT'
            }
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
          }]));

        case 4:
          userList = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            user: userList[0]
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

var getAppUsers = function getAppUsers(request, response) {
  var users;
  return regeneratorRuntime.async(function getAppUsers$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
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
          users = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            users: users
          }));

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getUserSpeciality = function getUserSpeciality(request, response) {
  var userId, user, speciality, specialities;
  return regeneratorRuntime.async(function getUserSpeciality$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = request.params.userId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(UserModel.findById(userId).select({
            password: 0
          }));

        case 4:
          user = _context4.sent;
          speciality = user.speciality;
          _context4.next = 8;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: speciality
            }
          }));

        case 8:
          specialities = _context4.sent;
          user.speciality = specialities;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            user: user
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

var updateUserMainData = function updateUserMainData(request, response) {
  var userId, dataValidation, updatedUser;
  return regeneratorRuntime.async(function updateUserMainData$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.updateUserMainData(request.body);

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
          _context5.next = 7;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, request.body, {
            "new": true
          }));

        case 7:
          updatedUser = _context5.sent;
          updatedUser.password = undefined;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated user successfully!',
            user: updatedUser
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

var updateUserProfileImage = function updateUserProfileImage(request, response) {
  var userId, dataValidation, profileImageURL, updatedUser;
  return regeneratorRuntime.async(function updateUserProfileImage$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.updateUserProfileImage(request.body);

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
          profileImageURL = request.body.profileImageURL;
          _context6.next = 8;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            profileImageURL: profileImageURL
          }, {
            "new": true
          }));

        case 8:
          updatedUser = _context6.sent;
          updatedUser.password = undefined;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated user profile image successfully!',
            user: updatedUser
          }));

        case 13:
          _context6.prev = 13;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 17:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var updateUserSpeciality = function updateUserSpeciality(request, response) {
  var userId, dataValidation, speciality, specialities, newUserData, updatedUser;
  return regeneratorRuntime.async(function updateUserSpeciality$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.updateUserSpeciality(request.body);

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
          speciality = request.body.speciality;
          _context7.next = 8;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: speciality
            }
          }));

        case 8:
          specialities = _context7.sent;

          if (!(specialities.length != speciality.length)) {
            _context7.next = 11;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
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
          _context7.next = 14;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, newUserData, {
            "new": true
          }));

        case 14:
          updatedUser = _context7.sent;
          updatedUser.password = undefined;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated user successfully!'],
            user: updatedUser
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

var updateUserEmail = function updateUserEmail(request, response) {
  var userId, dataValidation, email, emailList, updatedUser;
  return regeneratorRuntime.async(function updateUserEmail$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.updateUserEmail(request.body);

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
          email = request.body.email;
          _context8.next = 8;
          return regeneratorRuntime.awrap(UserModel.find({
            email: email
          }));

        case 8:
          emailList = _context8.sent;

          if (!(emailList.length != 0 && !emailList[0]._id.equals(userId))) {
            _context8.next = 11;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'email is already registered',
            field: 'email'
          }));

        case 11:
          _context8.next = 13;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            email: email
          }, {
            "new": true
          }));

        case 13:
          updatedUser = _context8.sent;
          updatedUser.password = undefined;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'updated user email successfully!',
            user: updatedUser
          }));

        case 18:
          _context8.prev = 18;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 22:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var updateUserLanguage = function updateUserLanguage(request, response) {
  var userId, lang, dataValidation, updatedUser;
  return regeneratorRuntime.async(function updateUserLanguage$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          userId = request.params.userId;
          lang = request.body.lang;
          dataValidation = userValidation.updateUserLanguage(request.body);

          if (dataValidation.isAccepted) {
            _context9.next = 6;
            break;
          }

          return _context9.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 6:
          _context9.next = 8;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            lang: lang
          }, {
            "new": true
          }));

        case 8:
          updatedUser = _context9.sent;
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated language successfully!'],
            user: updatedUser
          }));

        case 12:
          _context9.prev = 12;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 16:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var updateUserPassword = function updateUserPassword(request, response) {
  var userId, dataValidation, password, user, newPassword, updatedUser;
  return regeneratorRuntime.async(function updateUserPassword$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.updateUserPassword(request.body);

          if (dataValidation.isAccepted) {
            _context10.next = 5;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          password = request.body.password;
          _context10.next = 8;
          return regeneratorRuntime.awrap(UserModel.findById(userId));

        case 8:
          user = _context10.sent;

          if (!bcrypt.compareSync(password, user.password)) {
            _context10.next = 11;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['New password must be diffrent from old password'],
            field: 'password'
          }));

        case 11:
          newPassword = bcrypt.hashSync(password, config.SALT_ROUNDS);
          _context10.next = 14;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            password: newPassword
          }, {
            "new": true
          }));

        case 14:
          updatedUser = _context10.sent;
          updatedUser.password = undefined;
          return _context10.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated user password successfully!'],
            user: updatedUser
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

var verifyAndUpdateUserPassword = function verifyAndUpdateUserPassword(request, response) {
  var userId, dataValidation, _request$body, newPassword, currentPassword, user, newUserPassword, updatedUser;

  return regeneratorRuntime.async(function verifyAndUpdateUserPassword$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.verifyAndUpdateUserPassword(request.body);

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
          _request$body = request.body, newPassword = _request$body.newPassword, currentPassword = _request$body.currentPassword;

          if (!(newPassword == currentPassword)) {
            _context11.next = 8;
            break;
          }

          return _context11.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['New password must be diffrent from old password'],
            field: 'newPassword'
          }));

        case 8:
          _context11.next = 10;
          return regeneratorRuntime.awrap(UserModel.findById(userId));

        case 10:
          user = _context11.sent;

          if (bcrypt.compareSync(currentPassword, user.password)) {
            _context11.next = 13;
            break;
          }

          return _context11.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Current password is invalid'],
            field: 'currentPassword'
          }));

        case 13:
          if (!bcrypt.compareSync(newPassword, user.password)) {
            _context11.next = 15;
            break;
          }

          return _context11.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Current password entered is already used'],
            field: 'newPassword'
          }));

        case 15:
          newUserPassword = bcrypt.hashSync(newPassword, config.SALT_ROUNDS);
          _context11.next = 18;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            password: newUserPassword
          }, {
            "new": true
          }));

        case 18:
          updatedUser = _context11.sent;
          updatedUser.password = undefined;
          return _context11.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated user password successfully!'],
            user: updatedUser
          }));

        case 23:
          _context11.prev = 23;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          return _context11.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context11.t0.message
          }));

        case 27:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 23]]);
};

var deleteUser = function deleteUser(request, response) {
  var userId, user, _deleteUser;

  return regeneratorRuntime.async(function deleteUser$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          userId = request.params.userId;
          _context12.next = 4;
          return regeneratorRuntime.awrap(UserModel.findById(userId));

        case 4:
          user = _context12.sent;

          if (!(user.roles.includes('DOCTOR') || user.roles.includes('OWNER'))) {
            _context12.next = 7;
            break;
          }

          return _context12.abrupt("return", response.status(400).json({
            accepted: false,
            message: "This user type cannot be deleted",
            field: 'userId'
          }));

        case 7:
          _context12.next = 9;
          return regeneratorRuntime.awrap(UserModel.findByIdAndDelete(userId));

        case 9:
          _deleteUser = _context12.sent;
          return _context12.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'user deleted successfully!',
            user: _deleteUser
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

var addEmployeeUser = function addEmployeeUser(request, response) {
  var dataValidation, _request$body2, email, password, emailList, userPassword, counter, userData, userObj, newUser;

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
          _request$body2 = request.body, email = _request$body2.email, password = _request$body2.password;
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

var updateUserVisibility = function updateUserVisibility(request, response) {
  var userId, dataValidation, isShow, updatedUser;
  return regeneratorRuntime.async(function updateUserVisibility$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.updateUserVisibility(request.body);

          if (dataValidation.isAccepted) {
            _context14.next = 5;
            break;
          }

          return _context14.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          isShow = request.body.isShow;
          _context14.next = 8;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            isShow: isShow
          }, {
            "new": true
          }));

        case 8:
          updatedUser = _context14.sent;
          updatedUser.password = undefined;
          return _context14.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated user visibility successfully!',
            user: updatedUser
          }));

        case 13:
          _context14.prev = 13;
          _context14.t0 = _context14["catch"](0);
          console.error(_context14.t0);
          return _context14.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context14.t0.message
          }));

        case 17:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var updateUserBlocked = function updateUserBlocked(request, response) {
  var userId, dataValidation, isBlocked, updatedUser;
  return regeneratorRuntime.async(function updateUserBlocked$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.updateUserBlocked(request.body);

          if (dataValidation.isAccepted) {
            _context15.next = 5;
            break;
          }

          return _context15.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          isBlocked = request.body.isBlocked;
          _context15.next = 8;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            isBlocked: isBlocked
          }, {
            "new": true
          }));

        case 8:
          updatedUser = _context15.sent;
          updatedUser.password = undefined;
          return _context15.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated user blocked successfully!',
            user: updatedUser
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

var updateUserActivation = function updateUserActivation(request, response) {
  var userId, dataValidation, isDeactivated, updatedUser;
  return regeneratorRuntime.async(function updateUserActivation$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.updateUserActivation(request.body);

          if (dataValidation.isAccepted) {
            _context16.next = 5;
            break;
          }

          return _context16.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          isDeactivated = request.body.isDeactivated;
          _context16.next = 8;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            isDeactivated: isDeactivated
          }, {
            "new": true
          }));

        case 8:
          updatedUser = _context16.sent;
          updatedUser.password = undefined;
          return _context16.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated user activation successfully!',
            user: updatedUser
          }));

        case 13:
          _context16.prev = 13;
          _context16.t0 = _context16["catch"](0);
          console.error(_context16.t0);
          return _context16.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context16.t0.message
          }));

        case 17:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

module.exports = {
  getUser: getUser,
  getExpertUser: getExpertUser,
  getAppUsers: getAppUsers,
  getUserSpeciality: getUserSpeciality,
  updateUserMainData: updateUserMainData,
  updateUserSpeciality: updateUserSpeciality,
  updateUserEmail: updateUserEmail,
  updateUserLanguage: updateUserLanguage,
  updateUserPassword: updateUserPassword,
  updateUserProfileImage: updateUserProfileImage,
  verifyAndUpdateUserPassword: verifyAndUpdateUserPassword,
  deleteUser: deleteUser,
  addEmployeeUser: addEmployeeUser,
  updateUserVisibility: updateUserVisibility,
  updateUserBlocked: updateUserBlocked,
  updateUserActivation: updateUserActivation
};