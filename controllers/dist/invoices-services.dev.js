"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ClinicModel = require('../models/ClinicModel');

var InvoiceModel = require('../models/InvoiceModel');

var ServiceModel = require('../models/ServiceModel');

var InvoiceServiceModel = require('../models/InvoiceServiceModel');

var invoiceServiceValidator = require('../validations/invoices-services');

var mongoose = require('mongoose');

var getInvoicesServices = function getInvoicesServices(request, response) {
  var invoicesServices;
  return regeneratorRuntime.async(function getInvoicesServices$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(InvoiceServiceModel.find().sort({
            createdAt: -1
          }));

        case 3:
          invoicesServices = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            invoicesServices: invoicesServices
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

var getInvoiceServices = function getInvoiceServices(request, response) {
  var invoiceId, invoiceServices;
  return regeneratorRuntime.async(function getInvoiceServices$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          invoiceId = request.params.invoiceId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(InvoiceServiceModel.aggregate([{
            $match: {
              invoiceId: mongoose.Types.ObjectId(invoiceId)
            }
          }, {
            $lookup: {
              from: 'services',
              localField: 'serviceId',
              foreignField: '_id',
              as: 'service'
            }
          }]));

        case 4:
          invoiceServices = _context2.sent;
          invoiceServices.forEach(function (invoiceService) {
            return invoiceService.service = invoiceService.service[0];
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            invoiceServices: invoiceServices
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

var addInvoiceService = function addInvoiceService(request, response) {
  var dataValidation, _request$body, invoiceId, serviceId, amount, invoicePromise, servicePromise, _ref, _ref2, invoice, service, invoiceServiceData, INVOICE_TOTAL_AMOUNT, invoiceServiceObj, newinvoiceServicePromise, updatedInvoicePromise, _ref3, _ref4, newinvoiceService, updatedInvoice;

  return regeneratorRuntime.async(function addInvoiceService$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = invoiceServiceValidator.addInvoiceService(request.body);

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
          _request$body = request.body, invoiceId = _request$body.invoiceId, serviceId = _request$body.serviceId, amount = _request$body.amount;
          invoicePromise = InvoiceModel.findById(invoiceId);
          servicePromise = ServiceModel.findById(serviceId);
          _context3.next = 9;
          return regeneratorRuntime.awrap(Promise.all([invoicePromise, servicePromise]));

        case 9:
          _ref = _context3.sent;
          _ref2 = _slicedToArray(_ref, 2);
          invoice = _ref2[0];
          service = _ref2[1];

          if (invoice) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invoice Id is does not exist',
            field: 'invoiceId'
          }));

        case 15:
          if (service) {
            _context3.next = 17;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'service Id is does not exist',
            field: 'serviceId'
          }));

        case 17:
          if (invoice.clinicId.equals(service.clinicId)) {
            _context3.next = 19;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'service is not registered in clinic',
            field: 'serviceId'
          }));

        case 19:
          invoiceServiceData = {
            invoiceId: invoiceId,
            clinicId: invoice.clinicId,
            serviceId: serviceId,
            patientId: invoice.patientId,
            amount: service.cost
          };
          INVOICE_TOTAL_AMOUNT = invoice.totalCost + service.cost;
          invoiceServiceObj = new InvoiceServiceModel(invoiceServiceData);
          newinvoiceServicePromise = invoiceServiceObj.save();
          updatedInvoicePromise = InvoiceModel.findByIdAndUpdate(invoiceId, {
            totalCost: INVOICE_TOTAL_AMOUNT
          }, {
            "new": true
          });
          _context3.next = 26;
          return regeneratorRuntime.awrap(Promise.all([newinvoiceServicePromise, updatedInvoicePromise]));

        case 26:
          _ref3 = _context3.sent;
          _ref4 = _slicedToArray(_ref3, 2);
          newinvoiceService = _ref4[0];
          updatedInvoice = _ref4[1];
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added service to the invoice successfully!',
            invoiceService: newinvoiceService,
            invoice: updatedInvoice
          }));

        case 33:
          _context3.prev = 33;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 37:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 33]]);
};

var deleteInvoiceService = function deleteInvoiceService(request, response) {
  var invoiceServiceId, invoiceService, invoiceId, invoice, INVOICE_TOTAL_AMOUNT, deletedInvoiceServicePromise, updatedInvoicePromise, _ref5, _ref6, deletedInvoiceService, updatedInvoice;

  return regeneratorRuntime.async(function deleteInvoiceService$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          invoiceServiceId = request.params.invoiceServiceId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(InvoiceServiceModel.findById(invoiceServiceId));

        case 4:
          invoiceService = _context4.sent;
          invoiceId = invoiceService.invoiceId;
          _context4.next = 8;
          return regeneratorRuntime.awrap(InvoiceModel.findById(invoiceId));

        case 8:
          invoice = _context4.sent;
          INVOICE_TOTAL_AMOUNT = invoice.totalCost - invoiceService.amount;
          deletedInvoiceServicePromise = InvoiceServiceModel.findByIdAndDelete(invoiceServiceId);
          updatedInvoicePromise = InvoiceModel.findByIdAndUpdate(invoiceId, {
            totalCost: INVOICE_TOTAL_AMOUNT
          }, {
            "new": true
          });
          _context4.next = 14;
          return regeneratorRuntime.awrap(Promise.all([deletedInvoiceServicePromise, updatedInvoicePromise]));

        case 14:
          _ref5 = _context4.sent;
          _ref6 = _slicedToArray(_ref5, 2);
          deletedInvoiceService = _ref6[0];
          updatedInvoice = _ref6[1];
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added service to the invoice successfully!',
            invoiceService: deletedInvoiceService,
            invoice: updatedInvoice
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

module.exports = {
  getInvoicesServices: getInvoicesServices,
  addInvoiceService: addInvoiceService,
  deleteInvoiceService: deleteInvoiceService,
  getInvoiceServices: getInvoiceServices
};