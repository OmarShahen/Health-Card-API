"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var InvoiceModel = require('../models/InvoiceModel');

var InvoiceServiceModel = require('../models/InvoiceServiceModel');

var invoiceValidator = require('../validations/invoices');

var ClinicModel = require('../models/ClinicModel');

var PatientModel = require('../models/PatientModel');

var CounterModel = require('../models/CounterModel');

var config = require('../config/config');

var mongoose = require('mongoose');

var getInvoices = function getInvoices(request, response) {
  var invoices;
  return regeneratorRuntime.async(function getInvoices$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(InvoiceModel.find().sort({
            createdAt: -1
          }));

        case 3:
          invoices = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            invoices: invoices
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

var getInvoice = function getInvoice(request, response) {
  var invoiceId, invoiceListPromise, invoiceServicesPromise, _ref, _ref2, invoiceList, invoiceServices, invoice;

  return regeneratorRuntime.async(function getInvoice$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          invoiceId = request.params.invoiceId;
          invoiceListPromise = InvoiceModel.aggregate([{
            $match: {
              _id: mongoose.Types.ObjectId(invoiceId)
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $project: {
              'patient.healthHistory': 0,
              'patient.emergencyContacts': 0
            }
          }]);
          invoiceServicesPromise = InvoiceServiceModel.aggregate([{
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
          }]);
          _context2.next = 6;
          return regeneratorRuntime.awrap(Promise.all([invoiceListPromise, invoiceServicesPromise]));

        case 6:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 2);
          invoiceList = _ref2[0];
          invoiceServices = _ref2[1];
          invoiceList.forEach(function (invoice) {
            invoice.clinic = invoice.clinic[0];
            invoice.patient = invoice.patient[0];
          });
          invoiceServices.forEach(function (invoiceService) {
            return invoiceService.service = invoiceService.service[0];
          });
          invoice = invoiceList[0];
          invoice.invoiceServices = invoiceServices;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            invoice: invoice
          }));

        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

var getInvoicesByClinicId = function getInvoicesByClinicId(request, response) {
  var clinicId, invoices;
  return regeneratorRuntime.async(function getInvoicesByClinicId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          clinicId = request.params.clinicId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(InvoiceModel.aggregate([{
            $match: {
              clinicId: mongoose.Types.ObjectId(clinicId)
            }
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'patient.healthHistory': 0,
              'patient.emergencyContacts': 0
            }
          }]));

        case 4:
          invoices = _context3.sent;
          invoices.forEach(function (invoice) {
            return invoice.patient = invoice.patient[0];
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            invoices: invoices
          }));

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getInvoicesByPatientId = function getInvoicesByPatientId(request, response) {
  var patientId, invoices;
  return regeneratorRuntime.async(function getInvoicesByPatientId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          patientId = request.params.patientId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(InvoiceModel.aggregate([{
            $match: {
              patientId: mongoose.Types.ObjectId(patientId)
            }
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'patient.healthHistory': 0,
              'patient.emergencyContacts': 0
            }
          }]));

        case 4:
          invoices = _context4.sent;
          invoices.forEach(function (invoice) {
            return invoice.patient = invoice.patient[0];
          });
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            invoices: invoices
          }));

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var addInvoice = function addInvoice(request, response) {
  var dataValidation, _request$body, clinicId, cardId, clinicPromise, patientListPromise, _ref3, _ref4, clinic, patientList, counter, patient, patientId, invoiceObj, newInvoice;

  return regeneratorRuntime.async(function addInvoice$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          dataValidation = invoiceValidator.addInvoice(request.body);

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
          _request$body = request.body, clinicId = _request$body.clinicId, cardId = _request$body.cardId;
          clinicPromise = ClinicModel.findById(clinicId);
          patientListPromise = PatientModel.find({
            cardId: cardId
          });
          _context5.next = 9;
          return regeneratorRuntime.awrap(Promise.all([clinicPromise, patientListPromise]));

        case 9:
          _ref3 = _context5.sent;
          _ref4 = _slicedToArray(_ref3, 2);
          clinic = _ref4[0];
          patientList = _ref4[1];

          if (clinic) {
            _context5.next = 15;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 15:
          if (!(patientList.length == 0)) {
            _context5.next = 17;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Card Id does not exist',
            field: 'cardId'
          }));

        case 17:
          _context5.next = 19;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'invoice'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 19:
          counter = _context5.sent;
          patient = patientList[0];
          patientId = patient._id;
          invoiceObj = new InvoiceModel(_objectSpread({
            invoiceId: counter.value,
            patientId: patientId
          }, request.body));
          _context5.next = 25;
          return regeneratorRuntime.awrap(invoiceObj.save());

        case 25:
          newInvoice = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added invoice successfully!',
            invoice: newInvoice
          }));

        case 29:
          _context5.prev = 29;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 33:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 29]]);
};

var updateInvoiceStatus = function updateInvoiceStatus(request, response) {
  var invoiceId, status, dataValidation, invoice;
  return regeneratorRuntime.async(function updateInvoiceStatus$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          invoiceId = request.params.invoiceId;
          status = request.body.status;
          dataValidation = invoiceValidator.updateInvoiceStatus(request.body);

          if (dataValidation.isAccepted) {
            _context6.next = 6;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 6:
          _context6.next = 8;
          return regeneratorRuntime.awrap(InvoiceModel.findByIdAndUpdate(invoiceId, {
            status: status
          }, {
            "new": true
          }));

        case 8:
          invoice = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'updated invoice successfully!',
            invoice: invoice
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

var deleteInvoice = function deleteInvoice(request, response) {
  var invoiceId, deletedInvoicePromise, deletedInvoiceServicesPromise, _ref5, _ref6, deletedInvoice, deletedInvoiceServices;

  return regeneratorRuntime.async(function deleteInvoice$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          invoiceId = request.params.invoiceId;
          deletedInvoicePromise = InvoiceModel.findByIdAndDelete(invoiceId);
          deletedInvoiceServicesPromise = InvoiceServiceModel.deleteMany({
            invoiceId: invoiceId
          });
          _context7.next = 6;
          return regeneratorRuntime.awrap(Promise.all([deletedInvoicePromise, deletedInvoiceServicesPromise]));

        case 6:
          _ref5 = _context7.sent;
          _ref6 = _slicedToArray(_ref5, 2);
          deletedInvoice = _ref6[0];
          deletedInvoiceServices = _ref6[1];
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'deleted invoice successfully!',
            invoice: deletedInvoice,
            invoiceServices: deletedInvoiceServices.deletedCount
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

module.exports = {
  getInvoices: getInvoices,
  getInvoice: getInvoice,
  addInvoice: addInvoice,
  updateInvoiceStatus: updateInvoiceStatus,
  deleteInvoice: deleteInvoice,
  getInvoicesByClinicId: getInvoicesByClinicId,
  getInvoicesByPatientId: getInvoicesByPatientId
};