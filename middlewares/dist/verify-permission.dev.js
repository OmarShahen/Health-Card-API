"use strict";

var config = require('../config/config');

var jwt = require('jsonwebtoken');

var utils = require('../utils/utils');

var verifyToken = function verifyToken(request, response, next) {
  try {
    if (!request.headers['x-access-token']) {
      return response.status(401).json({
        accepted: false,
        message: 'unauthorized to access resources',
        field: 'x-access-token'
      });
    }

    var token = request.headers['x-access-token'];
    jwt.verify(token, config.SECRET_KEY, function (error, data) {
      if (error) {
        return response.status(401).json({
          accepted: false,
          message: 'invalid token',
          field: 'token'
        });
      }

      request.user = data;
      next();
      return;
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: 'internal server error',
      error: error.message
    });
  }
};

var staffPermission = function staffPermission(request, response, next) {
  try {
    var authorizedRoles = ['STAFF'];
    verifyToken(request, response, function () {
      var roles = request.user.roles;

      if (utils.isRolesValid(roles, authorizedRoles)) {
        next();
      } else {
        return response.status(403).json({
          accepted: false,
          message: 'unauthorized user type to access this resources',
          field: 'token'
        });
      }
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: 'internal server error',
      error: error.message
    });
  }
};

var doctorPermission = function doctorPermission(request, response, next) {
  try {
    var authorizedRoles = ['DOCTOR'];
    verifyToken(request, response, function () {
      var roles = request.user.roles;

      if (utils.isRolesValid(roles, authorizedRoles)) {
        next();
      } else {
        return response.status(403).json({
          accepted: false,
          message: 'unauthorized user type to access this resources',
          field: 'token'
        });
      }
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: 'internal server error',
      error: error.message
    });
  }
};

var ownerPermission = function ownerPermission(request, response, next) {
  try {
    var authorizedRoles = ['OWNER'];
    verifyToken(request, response, function () {
      var roles = request.user.roles;

      if (utils.isRolesValid(roles, authorizedRoles)) {
        next();
      } else {
        return response.status(403).json({
          accepted: false,
          message: 'unauthorized user type to access this resources',
          field: 'token'
        });
      }
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: 'internal server error',
      error: error.message
    });
  }
};

var allPermission = function allPermission(request, response, next) {
  try {
    var authorizedRoles = ['EMPLOYEE'];
    var types = ['EXPERT', 'SEEKER'];
    verifyToken(request, response, function () {
      var _request$user = request.user,
          roles = _request$user.roles,
          type = _request$user.type;

      if (utils.isRolesValid(roles, authorizedRoles) || types.includes(type)) {
        next();
      } else {
        return response.status(403).json({
          accepted: false,
          message: 'unauthorized user type to access this resources',
          field: 'token'
        });
      }
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: 'internal server error',
      error: error.message
    });
  }
};

var adminAndExpertPermission = function adminAndExpertPermission(request, response, next) {
  try {
    var authorizedRoles = ['EMPLOYEE'];
    var types = ['EXPERT'];
    verifyToken(request, response, function () {
      var _request$user2 = request.user,
          roles = _request$user2.roles,
          type = _request$user2.type;

      if (utils.isRolesValid(roles, authorizedRoles) || types.includes(type)) {
        next();
      } else {
        return response.status(403).json({
          accepted: false,
          message: 'unauthorized user type to access this resources',
          field: 'token'
        });
      }
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: 'internal server error',
      error: error.message
    });
  }
};

module.exports = {
  verifyToken: verifyToken,
  staffPermission: staffPermission,
  doctorPermission: doctorPermission,
  ownerPermission: ownerPermission,
  allPermission: allPermission,
  adminAndExpertPermission: adminAndExpertPermission
};