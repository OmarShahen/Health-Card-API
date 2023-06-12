"use strict";

var ServiceModel = require('../models/ServiceModel');

var serviceValidation = require('../validations/services');

var ClinicModel = require('../models/ClinicModel');

var UserModel = require('../models/UserModel');

var ClinicOwnerModel = require('../models/ClinicOwnerModel');

var mongoose = require('mongoose');

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

var getServicesByClinicId = function getServicesByClinicId(request, response) {
  var clinicId, services;
  return regeneratorRuntime.async(function getServicesByClinicId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          clinicId = request.params.clinicId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(ServiceModel.aggregate([{
            $match: {
              clinicId: mongoose.Types.ObjectId(clinicId)
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }]));

        case 4:
          services = _context2.sent;
          services.forEach(function (service) {
            return service.clinic = service.clinic[0];
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            services: services
          }));

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getServicesByUserId = function getServicesByUserId(request, response) {
  var userId, ownerClinics, clinics, services;
  return regeneratorRuntime.async(function getServicesByUserId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = request.params.userId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(ClinicOwnerModel.find({
            ownerId: userId
          }));

        case 4:
          ownerClinics = _context3.sent;
          clinics = ownerClinics.map(function (clinic) {
            return clinic.clinicId;
          });
          _context3.next = 8;
          return regeneratorRuntime.awrap(ServiceModel.aggregate([{
            $match: {
              clinicId: {
                $in: clinics
              }
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 8:
          services = _context3.sent;
          services.forEach(function (service) {
            return service.clinic = service.clinic[0];
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            services: services
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

var addService = function addService(request, response) {
  var dataValidation, _request$body, clinicId, name, clinic, serviceList, serviceObj, newService;

  return regeneratorRuntime.async(function addService$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          dataValidation = serviceValidation.addService(request.body);

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
          _request$body = request.body, clinicId = _request$body.clinicId, name = _request$body.name;
          _context4.next = 7;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 7:
          clinic = _context4.sent;

          if (clinic) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id is not registered',
            field: 'clinicId'
          }));

        case 10:
          _context4.next = 12;
          return regeneratorRuntime.awrap(ServiceModel.find({
            clinicId: clinicId,
            name: name
          }));

        case 12:
          serviceList = _context4.sent;

          if (!(serviceList.length != 0)) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'service name is already registered',
            field: 'name'
          }));

        case 15:
          serviceObj = new ServiceModel(request.body);
          _context4.next = 18;
          return regeneratorRuntime.awrap(serviceObj.save());

        case 18:
          newService = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added service successfully!',
            service: newService
          }));

        case 22:
          _context4.prev = 22;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 26:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

var deleteService = function deleteService(request, response) {
  var serviceId, deletedService;
  return regeneratorRuntime.async(function deleteService$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          serviceId = request.params.serviceId;
          _context5.next = 4;
          return regeneratorRuntime.awrap(ServiceModel.findByIdAndDelete(serviceId));

        case 4:
          deletedService = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted service successfully!',
            service: deletedService
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

var updateService = function updateService(request, response) {
  var dataValidation, serviceId, _request$body2, name, cost, service, nameList, serviceData, updatedService;

  return regeneratorRuntime.async(function updateService$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          dataValidation = serviceValidation.updateService(request.body);

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
          serviceId = request.params.serviceId;
          _request$body2 = request.body, name = _request$body2.name, cost = _request$body2.cost;
          _context6.next = 8;
          return regeneratorRuntime.awrap(ServiceModel.findById(serviceId));

        case 8:
          service = _context6.sent;

          if (!(name != service.name)) {
            _context6.next = 15;
            break;
          }

          _context6.next = 12;
          return regeneratorRuntime.awrap(ServiceModel.find({
            clinicId: service.clinicId,
            name: name
          }));

        case 12:
          nameList = _context6.sent;

          if (!(nameList.length != 0)) {
            _context6.next = 15;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'service name is already registered',
            field: 'name'
          }));

        case 15:
          serviceData = {
            name: name,
            cost: cost
          };
          _context6.next = 18;
          return regeneratorRuntime.awrap(ServiceModel.findByIdAndUpdate(serviceId, serviceData, {
            "new": true
          }));

        case 18:
          updatedService = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'updated service successfully!',
            service: updatedService
          }));

        case 22:
          _context6.prev = 22;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 26:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

module.exports = {
  getServices: getServices,
  getServicesByClinicId: getServicesByClinicId,
  getServicesByUserId: getServicesByUserId,
  addService: addService,
  deleteService: deleteService,
  updateService: updateService
};