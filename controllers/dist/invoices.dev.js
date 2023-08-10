"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

var ServiceModel = require('../models/ServiceModel');

var ClinicOwnerModel = require('../models/ClinicOwnerModel');

var ClinicPatientModel = require('../models/ClinicPatientModel');

var InsurancePolicyModel = require('../models/InsurancePolicyModel');

var InsuranceCompanyModel = require('../models/InsuranceModel');

var mongoose = require('mongoose');

var utils = require('../utils/utils');

var translations = require('../i18n/index');

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
            $lookup: {
              from: 'insurances',
              localField: 'insuranceCompanyId',
              foreignField: '_id',
              as: 'insuranceCompany'
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
            invoice.insuranceCompany = invoice.insuranceCompany[0];
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
            $lookup: {
              from: 'insurances',
              localField: 'insuranceCompanyId',
              foreignField: '_id',
              as: 'insuranceCompany'
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
            invoice.patient = invoice.patient[0];
            invoice.insuranceCompany = invoice.insuranceCompany.length != 0 ? invoice.insuranceCompany[0] : null;
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

var getInvoicesByInsuranceCompanyId = function getInvoicesByInsuranceCompanyId(request, response) {
  var insuranceId, _utils$statsQueryGene, searchQuery, invoices;

  return regeneratorRuntime.async(function getInvoicesByInsuranceCompanyId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          insuranceId = request.params.insuranceId;
          _utils$statsQueryGene = utils.statsQueryGenerator('insuranceCompanyId', insuranceId, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context4.next = 5;
          return regeneratorRuntime.awrap(InvoiceModel.aggregate([{
            $match: searchQuery
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $lookup: {
              from: 'insurances',
              localField: 'insuranceCompanyId',
              foreignField: '_id',
              as: 'insuranceCompany'
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

        case 5:
          invoices = _context4.sent;
          invoices.forEach(function (invoice) {
            invoice.patient = invoice.patient[0];
            invoice.insuranceCompany = invoice.insuranceCompany.length != 0 ? invoice.insuranceCompany[0] : null;
          });
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            invoices: invoices
          }));

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var getInvoicesByOwnerId = function getInvoicesByOwnerId(request, response) {
  var userId, ownerClinics, clinics, invoices;
  return regeneratorRuntime.async(function getInvoicesByOwnerId$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = request.params.userId;
          _context5.next = 4;
          return regeneratorRuntime.awrap(ClinicOwnerModel.find({
            ownerId: userId
          }));

        case 4:
          ownerClinics = _context5.sent;
          clinics = ownerClinics.map(function (clinic) {
            return clinic.clinicId;
          });
          _context5.next = 8;
          return regeneratorRuntime.awrap(InvoiceModel.aggregate([{
            $match: {
              clinicId: {
                $in: clinics
              }
            }
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
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
          }, {
            $project: {
              'patient.healthHistory': 0,
              'patient.emergencyContacts': 0
            }
          }]));

        case 8:
          invoices = _context5.sent;
          invoices.forEach(function (invoice) {
            invoice.patient = invoice.patient[0];
            invoice.clinic = invoice.clinic[0];
          });
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            invoices: invoices
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

var getInvoicesByPatientId = function getInvoicesByPatientId(request, response) {
  var patientId, invoices;
  return regeneratorRuntime.async(function getInvoicesByPatientId$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          patientId = request.params.patientId;
          _context6.next = 4;
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
          invoices = _context6.sent;
          invoices.forEach(function (invoice) {
            return invoice.patient = invoice.patient[0];
          });
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            invoices: invoices
          }));

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var addInvoice = function addInvoice(request, response) {
  var dataValidation, _request$body, clinicId, cardId, clinicPromise, patientListPromise, _ref3, _ref4, clinic, patientList, patient, patientId, clinicPatientsList, insurancePolicyList, counter, newInvoiceData, insurancePolicy, invoiceObj, newInvoice, formattedInvoice, _insurancePolicy, insuranceCompany;

  return regeneratorRuntime.async(function addInvoice$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          dataValidation = invoiceValidator.addInvoice(request.body);

          if (dataValidation.isAccepted) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
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
          _context7.next = 9;
          return regeneratorRuntime.awrap(Promise.all([clinicPromise, patientListPromise]));

        case 9:
          _ref3 = _context7.sent;
          _ref4 = _slicedToArray(_ref3, 2);
          clinic = _ref4[0];
          patientList = _ref4[1];

          if (clinic) {
            _context7.next = 15;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 15:
          if (!(patientList.length == 0)) {
            _context7.next = 17;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Card Id does not exist',
            field: 'cardId'
          }));

        case 17:
          patient = patientList[0];
          patientId = patient._id;
          _context7.next = 21;
          return regeneratorRuntime.awrap(ClinicPatientModel.find({
            clinicId: clinic._id,
            patientId: patientId
          }));

        case 21:
          clinicPatientsList = _context7.sent;

          if (!(clinicPatientsList.length == 0)) {
            _context7.next = 24;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Patient is not registered with the clinic'],
            field: 'cardId'
          }));

        case 24:
          _context7.next = 26;
          return regeneratorRuntime.awrap(InsurancePolicyModel.find({
            patientId: patientId,
            clinicId: clinic._id,
            status: 'ACTIVE',
            endDate: {
              $gt: Date.now()
            }
          }));

        case 26:
          insurancePolicyList = _context7.sent;
          _context7.next = 29;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: "".concat(clinic._id, "-invoice")
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 29:
          counter = _context7.sent;
          newInvoiceData = _objectSpread({
            invoiceId: counter.value,
            patientId: patientId
          }, request.body);

          if (insurancePolicyList.length != 0) {
            insurancePolicy = insurancePolicyList[0];
            newInvoiceData.insuranceCompanyId = insurancePolicy.insuranceCompanyId;
            newInvoiceData.insurancePolicyId = insurancePolicy._id;
            newInvoiceData.insuranceCoveragePercentage = insurancePolicy.coveragePercentage;
          }

          invoiceObj = new InvoiceModel(newInvoiceData);
          _context7.next = 35;
          return regeneratorRuntime.awrap(invoiceObj.save());

        case 35:
          newInvoice = _context7.sent;
          formattedInvoice = _objectSpread({}, newInvoice._doc, {
            clinic: clinic
          });

          if (!(insurancePolicyList.length != 0)) {
            _context7.next = 44;
            break;
          }

          _insurancePolicy = insurancePolicyList[0];
          _context7.next = 41;
          return regeneratorRuntime.awrap(InsuranceCompanyModel.findById(_insurancePolicy.insuranceCompanyId));

        case 41:
          insuranceCompany = _context7.sent;
          formattedInvoice.insurancePolicy = _insurancePolicy;
          formattedInvoice.insuranceCompany = _objectSpread({}, insuranceCompany._doc);

        case 44:
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added invoice successfully!'],
            invoice: formattedInvoice
          }));

        case 47:
          _context7.prev = 47;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 51:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 47]]);
};

var addInvoiceCheckout = function addInvoiceCheckout(request, response) {
  var dataValidation, invoiceId, _request$body2, services, paymentMethod, invoiceDate, paidAmount, dueDate, invoice, uniqueServicesSet, uniqueServicesList, servicesList, servicesIds, invoiceServicesTotalCost, invoiceFinalTotalCost, insurancePolicy, insuranceCoverageAmount, invoiceStatus, invoiceServices, invoiceNewData, updatedInvoicePromise, newInvoiceServicesPromise, _ref5, _ref6, updatedInvoice, newInvoiceServices;

  return regeneratorRuntime.async(function addInvoiceCheckout$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          dataValidation = invoiceValidator.addInvoiceCheckout(request.body);

          if (dataValidation.isAccepted) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          invoiceId = request.params.invoiceId;
          _request$body2 = request.body, services = _request$body2.services, paymentMethod = _request$body2.paymentMethod, invoiceDate = _request$body2.invoiceDate, paidAmount = _request$body2.paidAmount, dueDate = _request$body2.dueDate;
          _context8.next = 8;
          return regeneratorRuntime.awrap(InvoiceModel.findById(invoiceId));

        case 8:
          invoice = _context8.sent;

          if (!(invoice.status != 'DRAFT')) {
            _context8.next = 11;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: "Invoice is already checkedout",
            field: 'invoiceId'
          }));

        case 11:
          uniqueServicesSet = new Set(services);
          uniqueServicesList = _toConsumableArray(uniqueServicesSet);
          _context8.next = 15;
          return regeneratorRuntime.awrap(ServiceModel.find({
            _id: {
              $in: uniqueServicesList
            },
            clinicId: invoice.clinicId
          }));

        case 15:
          servicesList = _context8.sent;

          if (!(servicesList.length == 0 || servicesList.length != uniqueServicesList.length)) {
            _context8.next = 18;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'service Id is not registered',
            field: 'services'
          }));

        case 18:
          servicesIds = services;
          invoiceServicesTotalCost = utils.calculateServicesTotalCost(servicesList, servicesIds);
          invoiceFinalTotalCost = invoiceServicesTotalCost;

          if (!invoice.insurancePolicyId) {
            _context8.next = 27;
            break;
          }

          _context8.next = 24;
          return regeneratorRuntime.awrap(InsurancePolicyModel.findById(invoice.insurancePolicyId));

        case 24:
          insurancePolicy = _context8.sent;
          insuranceCoverageAmount = invoiceServicesTotalCost * (insurancePolicy.coveragePercentage / 100);
          invoiceFinalTotalCost = invoiceServicesTotalCost - insuranceCoverageAmount;

        case 27:
          if (!(invoiceFinalTotalCost < paidAmount)) {
            _context8.next = 29;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Amount paid is more than the required',
            field: 'paidAmount'
          }));

        case 29:
          if (invoiceFinalTotalCost == paidAmount) {
            invoiceStatus = 'PAID';
          } else if (paidAmount == 0) {
            invoiceStatus = 'PENDING';
          } else if (invoiceFinalTotalCost > paidAmount) {
            invoiceStatus = 'PARTIALLY_PAID';
          }

          invoiceServices = services.map(function (service) {
            return {
              invoiceId: invoiceId,
              clinicId: invoice.clinicId,
              patientId: invoice.patientId,
              serviceId: service,
              amount: servicesList.filter(function (targetService) {
                return targetService._id.equals(service);
              })[0].cost
            };
          });
          invoiceNewData = {
            status: invoiceStatus,
            totalCost: invoiceServicesTotalCost,
            paymentMethod: paymentMethod,
            paid: paidAmount,
            invoiceDate: new Date(invoiceDate),
            dueDate: dueDate
          };
          updatedInvoicePromise = InvoiceModel.findByIdAndUpdate(invoiceId, invoiceNewData, {
            "new": true
          });
          newInvoiceServicesPromise = InvoiceServiceModel.insertMany(invoiceServices);
          _context8.next = 36;
          return regeneratorRuntime.awrap(Promise.all([updatedInvoicePromise, newInvoiceServicesPromise]));

        case 36:
          _ref5 = _context8.sent;
          _ref6 = _slicedToArray(_ref5, 2);
          updatedInvoice = _ref6[0];
          newInvoiceServices = _ref6[1];
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added invoice successfully!'],
            invoice: updatedInvoice,
            invoiceServices: newInvoiceServices
          }));

        case 43:
          _context8.prev = 43;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 47:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 43]]);
};

var updateInvoiceStatus = function updateInvoiceStatus(request, response) {
  var invoiceId, status, dataValidation, invoice, updatedInvoice;
  return regeneratorRuntime.async(function updateInvoiceStatus$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          invoiceId = request.params.invoiceId;
          status = request.body.status;
          dataValidation = invoiceValidator.updateInvoiceStatus(request.body);

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
          return regeneratorRuntime.awrap(InvoiceModel.findById(invoiceId));

        case 8:
          invoice = _context9.sent;

          if (!(status == 'REFUNDED' && ['REFUNDED', 'DRAFT', 'PENDING'].includes(invoice.status))) {
            _context9.next = 11;
            break;
          }

          return _context9.abrupt("return", response.status(400).json({
            accepted: false,
            message: "invoice is already ".concat(invoice.status.toLowerCase()),
            field: 'status'
          }));

        case 11:
          _context9.next = 13;
          return regeneratorRuntime.awrap(InvoiceModel.findByIdAndUpdate(invoiceId, {
            status: status
          }, {
            "new": true
          }));

        case 13:
          updatedInvoice = _context9.sent;
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated invoice successfully!'],
            invoice: updatedInvoice
          }));

        case 17:
          _context9.prev = 17;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 21:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

var updateInvoicePaid = function updateInvoicePaid(request, response) {
  var dataValidation, invoiceId, paid, invoice, invoiceStatus, NEW_PAID, invoiceUpdateData, updatedInvoice;
  return regeneratorRuntime.async(function updateInvoicePaid$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          dataValidation = invoiceValidator.updateInvoicePaid(request.body);

          if (dataValidation.isAccepted) {
            _context10.next = 4;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          invoiceId = request.params.invoiceId;
          paid = request.body.paid;
          _context10.next = 8;
          return regeneratorRuntime.awrap(InvoiceModel.findById(invoiceId));

        case 8:
          invoice = _context10.sent;

          if (!(!['PARTIALLY_PAID', 'PENDING'].includes(invoice.status) || invoice.totalCost == invoice.paid)) {
            _context10.next = 11;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Invoice is not partially paid'],
            field: 'status'
          }));

        case 11:
          invoiceStatus = invoice.status;
          NEW_PAID = invoice.paid + paid;

          if (!(NEW_PAID > invoice.totalCost)) {
            _context10.next = 15;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Paid amount is more than the required'],
            field: 'paid'
          }));

        case 15:
          invoiceStatus = invoice.totalCost == NEW_PAID ? 'PAID' : 'PARTIALLY_PAID';
          invoiceUpdateData = {
            paid: NEW_PAID,
            status: invoiceStatus
          };
          _context10.next = 19;
          return regeneratorRuntime.awrap(InvoiceModel.findByIdAndUpdate(invoice._id, invoiceUpdateData, {
            "new": true
          }));

        case 19:
          updatedInvoice = _context10.sent;
          return _context10.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added payment successfully!'],
            invoice: updatedInvoice
          }));

        case 23:
          _context10.prev = 23;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          return _context10.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context10.t0.message
          }));

        case 27:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 23]]);
};

var deleteInvoice = function deleteInvoice(request, response) {
  var invoiceId, deletedInvoicePromise, deletedInvoiceServicesPromise, _ref7, _ref8, deletedInvoice, deletedInvoiceServices;

  return regeneratorRuntime.async(function deleteInvoice$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          invoiceId = request.params.invoiceId;
          deletedInvoicePromise = InvoiceModel.findByIdAndDelete(invoiceId);
          deletedInvoiceServicesPromise = InvoiceServiceModel.deleteMany({
            invoiceId: invoiceId
          });
          _context11.next = 6;
          return regeneratorRuntime.awrap(Promise.all([deletedInvoicePromise, deletedInvoiceServicesPromise]));

        case 6:
          _ref7 = _context11.sent;
          _ref8 = _slicedToArray(_ref7, 2);
          deletedInvoice = _ref8[0];
          deletedInvoiceServices = _ref8[1];
          return _context11.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Deleted invoice successfully!'],
            invoice: deletedInvoice,
            invoiceServices: deletedInvoiceServices.deletedCount
          }));

        case 13:
          _context11.prev = 13;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          return _context11.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context11.t0.message
          }));

        case 17:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var updateInvoice = function updateInvoice(request, response) {
  var invoiceId, dataValidation;
  return regeneratorRuntime.async(function updateInvoice$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          invoiceId = request.params.invoiceId;
          dataValidation = invoiceValidator.updateInvoice(request.body);

          if (dataValidation.isAccepted) {
            _context12.next = 5;
            break;
          }

          return _context12.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          return _context12.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated invoice successfully!']
          }));

        case 8:
          _context12.prev = 8;
          _context12.t0 = _context12["catch"](0);
          console.error(_context12.t0);
          return _context12.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context12.t0.message
          }));

        case 12:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = {
  getInvoices: getInvoices,
  getInvoice: getInvoice,
  addInvoice: addInvoice,
  updateInvoiceStatus: updateInvoiceStatus,
  updateInvoicePaid: updateInvoicePaid,
  updateInvoice: updateInvoice,
  deleteInvoice: deleteInvoice,
  getInvoicesByClinicId: getInvoicesByClinicId,
  getInvoicesByInsuranceCompanyId: getInvoicesByInsuranceCompanyId,
  getInvoicesByOwnerId: getInvoicesByOwnerId,
  getInvoicesByPatientId: getInvoicesByPatientId,
  addInvoiceCheckout: addInvoiceCheckout
};