"use strict";

var config = require('../config/config');

var UserModel = require('../models/UserModel');

var userValidation = require('../validations/users');

var bcrypt = require('bcrypt');

var SpecialityModel = require('../models/SpecialityModel');

var getUser = function getUser(request, response) {
  var userId, user;
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
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            user: user
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

var getUserSpeciality = function getUserSpeciality(request, response) {
  var userId, user, speciality, specialities;
  return regeneratorRuntime.async(function getUserSpeciality$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = request.params.userId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(UserModel.findById(userId).select({
            password: 0
          }));

        case 4:
          user = _context2.sent;
          speciality = user.speciality;
          _context2.next = 8;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: speciality
            }
          }));

        case 8:
          specialities = _context2.sent;
          user.speciality = specialities;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            user: user
          }));

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var updateUser = function updateUser(request, response) {
  var userId, dataValidation, _request$body, firstName, lastName, gender, dateOfBirth, newUserData, updatedUser;

  return regeneratorRuntime.async(function updateUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.updateUser(request.body);

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
          _request$body = request.body, firstName = _request$body.firstName, lastName = _request$body.lastName, gender = _request$body.gender, dateOfBirth = _request$body.dateOfBirth;
          newUserData = {
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            dateOfBirth: dateOfBirth
          };
          _context3.next = 9;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, newUserData, {
            "new": true
          }));

        case 9:
          updatedUser = _context3.sent;
          updatedUser.password = undefined;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated user successfully!',
            user: updatedUser
          }));

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var updateUserSpeciality = function updateUserSpeciality(request, response) {
  var userId, dataValidation, _request$body2, title, description, speciality, specialities, newUserData, updatedUser;

  return regeneratorRuntime.async(function updateUserSpeciality$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.updateUserSpeciality(request.body);

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
          _request$body2 = request.body, title = _request$body2.title, description = _request$body2.description, speciality = _request$body2.speciality;
          _context4.next = 8;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: speciality
            }
          }));

        case 8:
          specialities = _context4.sent;

          if (!(specialities.length != speciality.length)) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'speciality Id is not registered',
            field: 'speciality'
          }));

        case 11:
          newUserData = {
            title: title,
            description: description,
            speciality: speciality
          };
          _context4.next = 14;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, newUserData, {
            "new": true
          }));

        case 14:
          updatedUser = _context4.sent;
          updatedUser.password = undefined;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated user successfully!',
            user: updatedUser
          }));

        case 19:
          _context4.prev = 19;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 23:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var updateUserEmail = function updateUserEmail(request, response) {
  var userId, dataValidation, email, emailList, updatedUser;
  return regeneratorRuntime.async(function updateUserEmail$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.updateUserEmail(request.body);

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
          email = request.body.email;
          _context5.next = 8;
          return regeneratorRuntime.awrap(UserModel.find({
            email: email
          }));

        case 8:
          emailList = _context5.sent;

          if (!(emailList.length != 0 && !emailList[0]._id.equals(userId))) {
            _context5.next = 11;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'email is already registered',
            field: 'email'
          }));

        case 11:
          _context5.next = 13;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            email: email
          }, {
            "new": true
          }));

        case 13:
          updatedUser = _context5.sent;
          updatedUser.password = undefined;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'updated user email successfully!',
            user: updatedUser
          }));

        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 22:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var updateUserPassword = function updateUserPassword(request, response) {
  var userId, dataValidation, password, user, newPassword, updatedUser;
  return regeneratorRuntime.async(function updateUserPassword$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.updateUserPassword(request.body);

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
          password = request.body.password;
          _context6.next = 8;
          return regeneratorRuntime.awrap(UserModel.findById(userId));

        case 8:
          user = _context6.sent;

          if (!bcrypt.compareSync(password, user.password)) {
            _context6.next = 11;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'new password must be diffrent from old password',
            field: 'password'
          }));

        case 11:
          newPassword = bcrypt.hashSync(password, config.SALT_ROUNDS);
          _context6.next = 14;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            password: newPassword
          }, {
            "new": true
          }));

        case 14:
          updatedUser = _context6.sent;
          updatedUser.password = undefined;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'updated user password successfully!',
            user: updatedUser
          }));

        case 19:
          _context6.prev = 19;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 23:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var verifyAndUpdateUserPassword = function verifyAndUpdateUserPassword(request, response) {
  var userId, dataValidation, _request$body3, newPassword, currentPassword, user, newUserPassword, updatedUser;

  return regeneratorRuntime.async(function verifyAndUpdateUserPassword$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          userId = request.params.userId;
          dataValidation = userValidation.verifyAndUpdateUserPassword(request.body);

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
          _request$body3 = request.body, newPassword = _request$body3.newPassword, currentPassword = _request$body3.currentPassword;

          if (!(newPassword == currentPassword)) {
            _context7.next = 8;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'new password must be diffrent from current password',
            field: 'newPassword'
          }));

        case 8:
          _context7.next = 10;
          return regeneratorRuntime.awrap(UserModel.findById(userId));

        case 10:
          user = _context7.sent;

          if (bcrypt.compareSync(currentPassword, user.password)) {
            _context7.next = 13;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'current password entered is invalid',
            field: 'currentPassword'
          }));

        case 13:
          newUserPassword = bcrypt.hashSync(newPassword, config.SALT_ROUNDS);
          _context7.next = 16;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            password: newUserPassword
          }, {
            "new": true
          }));

        case 16:
          updatedUser = _context7.sent;
          updatedUser.password = undefined;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'updated user password successfully!',
            user: updatedUser
          }));

        case 21:
          _context7.prev = 21;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 25:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var deleteUser = function deleteUser(request, response) {
  var userId, user;
  return regeneratorRuntime.async(function deleteUser$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          userId = request.params.userId;
          _context8.next = 4;
          return regeneratorRuntime.awrap(UserModel.findByIdAndDelete(userId));

        case 4:
          user = _context8.sent;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'user deleted successfully!',
            user: user
          }));

        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 12:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = {
  getUser: getUser,
  getUserSpeciality: getUserSpeciality,
  updateUser: updateUser,
  updateUserSpeciality: updateUserSpeciality,
  updateUserEmail: updateUserEmail,
  updateUserPassword: updateUserPassword,
  verifyAndUpdateUserPassword: verifyAndUpdateUserPassword,
  deleteUser: deleteUser
};