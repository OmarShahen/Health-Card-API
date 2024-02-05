"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ServiceModel = require('../models/ServiceModel');

var UserModel = require('../models/UserModel');

var AppointmentModel = require('../models/AppointmentModel');

var CounterModel = require('../models/CounterModel');

var serviceValidation = require('../validations/services');

var getServices = function getServices(request, response) {
  var services;
  return regeneratorRuntime.async(function getServices$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(ServiceModel.find().sort({
            createdAt: -1
          }));

        case 3:
          services = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            services: services
          }));

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getServicesByExpertId = function getServicesByExpertId(request, response) {
  var userId, services;
  return regeneratorRuntime.async(function getServicesByExpertId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = request.params.userId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(ServiceModel.find({
            expertId: userId
          }).sort({
            createdAt: -1
          }));

        case 4:
          services = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            services: services
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

var addService = function addService(request, response) {
  var dataValidation, _request$body, expertId, title, expert, expertServicesList, counter, serviceData, serviceObj, newService;

  return regeneratorRuntime.async(function addService$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = serviceValidation.addService(request.body);

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
          _request$body = request.body, expertId = _request$body.expertId, title = _request$body.title;
          _context3.next = 7;
          return regeneratorRuntime.awrap(UserModel.findById(expertId));

        case 7:
          expert = _context3.sent;

          if (expert) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Expert ID is not registered',
            field: 'expertId'
          }));

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(ServiceModel.find({
            expertId: expertId,
            title: title
          }));

        case 12:
          expertServicesList = _context3.sent;

          if (!(expertServicesList.length != 0)) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Title is already registered in a service',
            field: 'title'
          }));

        case 15:
          _context3.next = 17;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'service'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 17:
          counter = _context3.sent;
          serviceData = _objectSpread({
            serviceId: counter.value
          }, request.body);
          serviceObj = new ServiceModel(serviceData);
          _context3.next = 22;
          return regeneratorRuntime.awrap(serviceObj.save());

        case 22:
          newService = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added service successfully!',
            service: newService
          }));

        case 26:
          _context3.prev = 26;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 30:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 26]]);
};

var updateService = function updateService(request, response) {
  var serviceId, title, dataValidation, service, expertServicesList, updatedService;
  return regeneratorRuntime.async(function updateService$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          serviceId = request.params.serviceId;
          title = request.body.title;
          dataValidation = serviceValidation.updateService(request.body);

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
          return regeneratorRuntime.awrap(ServiceModel.findById(serviceId));

        case 8:
          service = _context4.sent;

          if (!(title != service.title)) {
            _context4.next = 15;
            break;
          }

          _context4.next = 12;
          return regeneratorRuntime.awrap(ServiceModel.find({
            expertId: service.expertId,
            title: title
          }));

        case 12:
          expertServicesList = _context4.sent;

          if (!(expertServicesList.length != 0)) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Title is already registered in a service',
            field: 'title'
          }));

        case 15:
          _context4.next = 17;
          return regeneratorRuntime.awrap(ServiceModel.findByIdAndUpdate(serviceId, request.body, {
            "new": true
          }));

        case 17:
          updatedService = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated service successfully!',
            service: updatedService
          }));

        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 25:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var updateServiceActivity = function updateServiceActivity(request, response) {
  var serviceId, isActive, dataValidation, updatedService;
  return regeneratorRuntime.async(function updateServiceActivity$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          serviceId = request.params.serviceId;
          isActive = request.body.isActive;
          dataValidation = serviceValidation.updateServiceActivity(request.body);

          if (dataValidation.isAccepted) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 6:
          _context5.next = 8;
          return regeneratorRuntime.awrap(ServiceModel.findByIdAndUpdate(serviceId, {
            isActive: isActive
          }, {
            "new": true
          }));

        case 8:
          updatedService = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated service activity successfully!',
            service: updatedService
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

var deleteService = function deleteService(request, response) {
  var serviceId, appointmentsList, deletedService;
  return regeneratorRuntime.async(function deleteService$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          serviceId = request.params.serviceId;
          _context6.next = 4;
          return regeneratorRuntime.awrap(AppointmentModel.find({
            serviceId: serviceId
          }));

        case 4:
          appointmentsList = _context6.sent;

          if (!(appointmentsList.length != 0)) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Service is registered with appointments',
            field: 'serviceId'
          }));

        case 7:
          _context6.next = 9;
          return regeneratorRuntime.awrap(ServiceModel.findByIdAndDelete(serviceId));

        case 9:
          deletedService = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted service successfully!',
            service: deletedService
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

module.exports = {
  getServices: getServices,
  getServicesByExpertId: getServicesByExpertId,
  addService: addService,
  updateService: updateService,
  updateServiceActivity: updateServiceActivity,
  deleteService: deleteService
};