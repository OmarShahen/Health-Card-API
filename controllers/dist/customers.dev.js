"use strict";

var CustomerModel = require('../models/CustomerModel');

var UserModel = require('../models/UserModel');

var CounterModel = require('../models/CounterModel');

var customerValidation = require('../validations/customers');

var mongoose = require('mongoose');

var getCustomers = function getCustomers(request, response) {
  var customers;
  return regeneratorRuntime.async(function getCustomers$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(CustomerModel.find().sort({
            createdAt: -1
          }));

        case 3:
          customers = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            customers: customers
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

var addCustomer = function addCustomer(request, response) {
  var dataValidation, _request$body, seekerId, expertId, seeker, expert, customerCount, counter, customerData, customerObj, newCustomer;

  return regeneratorRuntime.async(function addCustomer$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = customerValidation.addCustomer(request.body);

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
          _request$body = request.body, seekerId = _request$body.seekerId, expertId = _request$body.expertId;
          _context2.next = 7;
          return regeneratorRuntime.awrap(UserModel.findById(seekerId));

        case 7:
          seeker = _context2.sent;
          _context2.next = 10;
          return regeneratorRuntime.awrap(UserModel.findById(expertId));

        case 10:
          expert = _context2.sent;

          if (seeker) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Seeker Id is not registered',
            field: 'seekerId'
          }));

        case 13:
          if (expert) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Expert Id is not registered',
            field: 'expertId'
          }));

        case 15:
          _context2.next = 17;
          return regeneratorRuntime.awrap(CustomerModel.countDocuments({
            expertId: expertId,
            seekerId: seekerId
          }));

        case 17:
          customerCount = _context2.sent;

          if (!(customerCount != 0)) {
            _context2.next = 20;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Expert is already registered with seeker',
            field: 'expertId'
          }));

        case 20:
          _context2.next = 22;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'Customer'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 22:
          counter = _context2.sent;
          customerData = {
            customerId: counter.value,
            expertId: expertId,
            seekerId: seekerId
          };
          customerObj = new CustomerModel(customerData);
          _context2.next = 27;
          return regeneratorRuntime.awrap(customerObj.save());

        case 27:
          newCustomer = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added customer successfully!',
            customer: newCustomer
          }));

        case 31:
          _context2.prev = 31;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 35:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 31]]);
};

var deleteCustomer = function deleteCustomer(request, response) {
  var customerId, deletedCustomer;
  return regeneratorRuntime.async(function deleteCustomer$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          customerId = request.params.customerId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(CustomerModel.findByIdAndDelete(customerId));

        case 4:
          deletedCustomer = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted customer successfully!',
            customer: deletedCustomer
          }));

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getCustomersByExpertId = function getCustomersByExpertId(request, response) {
  var userId, matchQuery, customers, totalCustomers;
  return regeneratorRuntime.async(function getCustomersByExpertId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = request.params.userId;
          matchQuery = {
            expertId: mongoose.Types.ObjectId(userId)
          };
          _context4.next = 5;
          return regeneratorRuntime.awrap(CustomerModel.aggregate([{
            $match: matchQuery
          }, {
            $limit: 25
          }, {
            $lookup: {
              from: 'users',
              localField: 'seekerId',
              foreignField: '_id',
              as: 'seeker'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'seeker.password': 0
            }
          }]));

        case 5:
          customers = _context4.sent;
          customers.forEach(function (customer) {
            return customer.seeker = customer.seeker[0];
          });
          _context4.next = 9;
          return regeneratorRuntime.awrap(CustomerModel.countDocuments(matchQuery));

        case 9:
          totalCustomers = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            totalCustomers: totalCustomers,
            customers: customers
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

var searchCustomersByExpertIdAndSeekerName = function searchCustomersByExpertIdAndSeekerName(request, response) {
  var userId, name, matchQuery, customers;
  return regeneratorRuntime.async(function searchCustomersByExpertIdAndSeekerName$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = request.params.userId;
          name = request.query.name;
          matchQuery = {
            expertId: mongoose.Types.ObjectId(userId)
          };
          _context5.next = 6;
          return regeneratorRuntime.awrap(CustomerModel.aggregate([{
            $match: matchQuery
          }, {
            $lookup: {
              from: 'users',
              localField: 'seekerId',
              foreignField: '_id',
              as: 'seeker'
            }
          }, {
            $match: {
              'seeker.firstName': {
                $regex: new RegExp(name, 'i')
              }
            }
          }, {
            $limit: 20
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'seeker.password': 0
            }
          }]));

        case 6:
          customers = _context5.sent;
          customers.forEach(function (customer) {
            return customer.seeker = customer.seeker[0];
          });
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            customers: customers
          }));

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

module.exports = {
  getCustomers: getCustomers,
  addCustomer: addCustomer,
  deleteCustomer: deleteCustomer,
  getCustomersByExpertId: getCustomersByExpertId,
  searchCustomersByExpertIdAndSeekerName: searchCustomersByExpertIdAndSeekerName
};