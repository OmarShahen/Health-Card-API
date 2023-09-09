"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var InvoiceModel = require('../models/InvoiceModel');

var InvoiceServiceModel = require('../models/InvoiceServiceModel');

var invoiceValidator = require('../validations/invoices');

var ClinicModel = require('../models/ClinicModel');

var InsuranceModel = require('../models/InsuranceModel');

var PatientModel = require('../models/PatientModel');

var CounterModel = require('../models/CounterModel');

var ServiceModel = require('../models/ServiceModel');

var ClinicOwnerModel = require('../models/ClinicOwnerModel');

var ClinicPatientModel = require('../models/ClinicPatientModel');

var InsurancePolicyModel = require('../models/InsurancePolicyModel');

var InsuranceCompanyModel = require('../models/InsuranceModel');

var UserModel = require('../models/UserModel');

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
            $lookup: {
              from: 'users',
              localField: 'creatorId',
              foreignField: '_id',
              as: 'creator'
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
            invoice.creator = invoice.creator[0];
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
  var clinicId, _utils$statsQueryGene, searchQuery, invoices;

  return regeneratorRuntime.async(function getInvoicesByClinicId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          clinicId = request.params.clinicId;
          _utils$statsQueryGene = utils.statsQueryGenerator('clinicId', clinicId, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context3.next = 5;
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
          invoices = _context3.sent;
          invoices.forEach(function (invoice) {
            invoice.patient = invoice.patient[0];
            invoice.insuranceCompany = invoice.insuranceCompany.length != 0 ? invoice.insuranceCompany[0] : null;
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            invoices: invoices
          }));

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var getInvoicesByInsuranceCompanyId = function getInvoicesByInsuranceCompanyId(request, response) {
  var insuranceId, _utils$statsQueryGene2, searchQuery, invoices;

  return regeneratorRuntime.async(function getInvoicesByInsuranceCompanyId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          insuranceId = request.params.insuranceId;
          _utils$statsQueryGene2 = utils.statsQueryGenerator('insuranceCompanyId', insuranceId, request.query), searchQuery = _utils$statsQueryGene2.searchQuery;
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
  var userId, ownerClinics, clinics, _utils$statsQueryGene3, searchQuery, invoices;

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
          _utils$statsQueryGene3 = utils.statsQueryGenerator('temp', userId, request.query), searchQuery = _utils$statsQueryGene3.searchQuery;
          delete searchQuery.temp;
          searchQuery.clinicId = {
            $in: clinics
          };
          _context5.next = 11;
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
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
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

        case 11:
          invoices = _context5.sent;
          invoices.forEach(function (invoice) {
            invoice.patient = invoice.patient[0];
            invoice.clinic = invoice.clinic[0];
            invoice.insuranceCompany = invoice.insuranceCompany.length != 0 ? invoice.insuranceCompany[0] : null;
          });
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            invoices: invoices
          }));

        case 16:
          _context5.prev = 16;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 20:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

var getInvoicesByPatientId = function getInvoicesByPatientId(request, response) {
  var patientId, _utils$statsQueryGene4, searchQuery, invoices;

  return regeneratorRuntime.async(function getInvoicesByPatientId$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          patientId = request.params.patientId;
          _utils$statsQueryGene4 = utils.statsQueryGenerator('patientId', patientId, request.query), searchQuery = _utils$statsQueryGene4.searchQuery;
          _context6.next = 5;
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
          invoices = _context6.sent;
          invoices.forEach(function (invoice) {
            invoice.patient = invoice.patient[0];
            invoice.insuranceCompany = invoice.insuranceCompany.length != 0 ? invoice.insuranceCompany[0] : null;
          });
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            invoices: invoices
          }));

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var getClinicInvoicesByPatientId = function getClinicInvoicesByPatientId(request, response) {
  var _request$params, clinicId, patientId, _utils$statsQueryGene5, searchQuery, invoices;

  return regeneratorRuntime.async(function getClinicInvoicesByPatientId$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _request$params = request.params, clinicId = _request$params.clinicId, patientId = _request$params.patientId;
          _utils$statsQueryGene5 = utils.statsQueryGenerator('patientId', patientId, request.query), searchQuery = _utils$statsQueryGene5.searchQuery;
          searchQuery.clinicId = mongoose.Types.ObjectId(clinicId);
          _context7.next = 6;
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

        case 6:
          invoices = _context7.sent;
          invoices.forEach(function (invoice) {
            invoice.patient = invoice.patient[0];
            invoice.insuranceCompany = invoice.insuranceCompany.length != 0 ? invoice.insuranceCompany[0] : null;
          });
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            invoices: invoices
          }));

        case 11:
          _context7.prev = 11;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 15:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var addInvoice = function addInvoice(request, response) {
  var dataValidation, _request$body, clinicId, patientId, creatorId, services, paymentMethod, invoiceDate, paidAmount, dueDate, clinicPromise, patientPromise, creatorPromise, _ref3, _ref4, clinic, patient, creator, clinicPatientsList, uniqueServicesSet, uniqueServicesList, servicesList, insurancePolicyList, servicesIds, invoiceServicesTotalCost, invoiceFinalTotalCost, isInsuranceCompanyActive, insurancePolicy, insuranceCompany, insuranceCoverageAmount, invoiceStatus, counter, newInvoiceData, _insurancePolicy, invoiceObj, newInvoice, formattedInvoice, _insurancePolicy2, _insuranceCompany, invoiceServices, newInvoiceServices;

  return regeneratorRuntime.async(function addInvoice$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          dataValidation = invoiceValidator.addInvoice(request.body);

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
          _request$body = request.body, clinicId = _request$body.clinicId, patientId = _request$body.patientId, creatorId = _request$body.creatorId, services = _request$body.services, paymentMethod = _request$body.paymentMethod, invoiceDate = _request$body.invoiceDate, paidAmount = _request$body.paidAmount, dueDate = _request$body.dueDate;
          clinicPromise = ClinicModel.findById(clinicId);
          patientPromise = PatientModel.findById(patientId);
          creatorPromise = UserModel.findById(creatorId);
          _context8.next = 10;
          return regeneratorRuntime.awrap(Promise.all([clinicPromise, patientPromise, creatorPromise]));

        case 10:
          _ref3 = _context8.sent;
          _ref4 = _slicedToArray(_ref3, 3);
          clinic = _ref4[0];
          patient = _ref4[1];
          creator = _ref4[2];

          if (clinic) {
            _context8.next = 17;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 17:
          if (patient) {
            _context8.next = 19;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Patient Id does not exist',
            field: 'patientId'
          }));

        case 19:
          if (creator) {
            _context8.next = 21;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Creator Id does not exist',
            field: 'creatorId'
          }));

        case 21:
          _context8.next = 23;
          return regeneratorRuntime.awrap(ClinicPatientModel.find({
            clinicId: clinicId,
            patientId: patientId
          }));

        case 23:
          clinicPatientsList = _context8.sent;

          if (!(clinicPatientsList.length == 0)) {
            _context8.next = 26;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Patient is not registered with the clinic'],
            field: 'patientId'
          }));

        case 26:
          uniqueServicesSet = new Set(services);
          uniqueServicesList = _toConsumableArray(uniqueServicesSet);
          _context8.next = 30;
          return regeneratorRuntime.awrap(ServiceModel.find({
            _id: {
              $in: uniqueServicesList
            },
            clinicId: clinicId
          }));

        case 30:
          servicesList = _context8.sent;

          if (!(servicesList.length == 0 || servicesList.length != uniqueServicesList.length)) {
            _context8.next = 33;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'service Id is not registered',
            field: 'services'
          }));

        case 33:
          _context8.next = 35;
          return regeneratorRuntime.awrap(InsurancePolicyModel.find({
            patientId: patientId,
            clinicId: clinicId,
            status: 'ACTIVE',
            endDate: {
              $gt: Date.now()
            }
          }));

        case 35:
          insurancePolicyList = _context8.sent;
          servicesIds = services;
          invoiceServicesTotalCost = utils.calculateServicesTotalCost(servicesList, servicesIds);
          invoiceFinalTotalCost = invoiceServicesTotalCost;

          if (!(insurancePolicyList.length != 0)) {
            _context8.next = 46;
            break;
          }

          insurancePolicy = insurancePolicyList[0];
          _context8.next = 43;
          return regeneratorRuntime.awrap(InsuranceModel.findById(insurancePolicy.insuranceCompanyId));

        case 43:
          insuranceCompany = _context8.sent;
          isInsuranceCompanyActive = insuranceCompany.isActive;

          if (insuranceCompany.isActive) {
            insuranceCoverageAmount = invoiceServicesTotalCost * (insurancePolicy.coveragePercentage / 100);
            invoiceFinalTotalCost = invoiceServicesTotalCost - insuranceCoverageAmount;
          }

        case 46:
          if (!(invoiceFinalTotalCost < paidAmount)) {
            _context8.next = 48;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Amount paid is more than the required'],
            field: 'paidAmount'
          }));

        case 48:
          if (invoiceFinalTotalCost == paidAmount) {
            invoiceStatus = 'PAID';
          } else if (paidAmount == 0) {
            invoiceStatus = 'PENDING';
          } else if (invoiceFinalTotalCost > paidAmount) {
            invoiceStatus = 'PARTIALLY_PAID';
          }

          _context8.next = 51;
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

        case 51:
          counter = _context8.sent;
          newInvoiceData = {
            invoiceId: counter.value,
            patientId: patientId,
            clinicId: clinicId,
            creatorId: creatorId,
            status: invoiceStatus,
            totalCost: invoiceServicesTotalCost,
            paymentMethod: paymentMethod,
            paid: paidAmount,
            invoiceDate: new Date(invoiceDate),
            dueDate: dueDate
          };

          if (insurancePolicyList.length != 0 && isInsuranceCompanyActive) {
            _insurancePolicy = insurancePolicyList[0];
            newInvoiceData.insuranceCompanyId = _insurancePolicy.insuranceCompanyId;
            newInvoiceData.insurancePolicyId = _insurancePolicy._id;
            newInvoiceData.insuranceCoveragePercentage = _insurancePolicy.coveragePercentage;
          }

          invoiceObj = new InvoiceModel(newInvoiceData);
          _context8.next = 57;
          return regeneratorRuntime.awrap(invoiceObj.save());

        case 57:
          newInvoice = _context8.sent;
          formattedInvoice = _objectSpread({}, newInvoice._doc, {
            clinic: clinic
          });

          if (!(insurancePolicyList.length != 0)) {
            _context8.next = 66;
            break;
          }

          _insurancePolicy2 = insurancePolicyList[0];
          _context8.next = 63;
          return regeneratorRuntime.awrap(InsuranceCompanyModel.findById(_insurancePolicy2.insuranceCompanyId));

        case 63:
          _insuranceCompany = _context8.sent;
          formattedInvoice.insurancePolicy = _insurancePolicy2;
          formattedInvoice.insuranceCompany = _objectSpread({}, _insuranceCompany._doc);

        case 66:
          invoiceServices = services.map(function (service) {
            return {
              invoiceId: newInvoice._id,
              clinicId: newInvoice.clinicId,
              patientId: newInvoice.patientId,
              serviceId: service,
              amount: servicesList.filter(function (targetService) {
                return targetService._id.equals(service);
              })[0].cost
            };
          });
          _context8.next = 69;
          return regeneratorRuntime.awrap(InvoiceServiceModel.insertMany(invoiceServices));

        case 69:
          newInvoiceServices = _context8.sent;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added invoice successfully!'],
            invoice: formattedInvoice,
            invoiceServices: newInvoiceServices
          }));

        case 73:
          _context8.prev = 73;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 77:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 73]]);
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
  var dataValidation, invoiceId, paid, invoice, invoiceStatus, NEW_PAID, amountRemaining, insuranceCoverageAmount, invoiceUpdateData, updatedInvoice;
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
          amountRemaining = invoice.totalCost - invoice.paid;

          if (invoice.insuranceCoveragePercentage) {
            insuranceCoverageAmount = invoice.totalCost * (invoice.insuranceCoveragePercentage / 100);
            amountRemaining = invoice.totalCost - insuranceCoverageAmount - invoice.paid;
          }

          if (!(paid > amountRemaining)) {
            _context10.next = 17;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Paid amount is more than the required'],
            field: 'paid'
          }));

        case 17:
          invoiceStatus = amountRemaining == paid ? 'PAID' : 'PARTIALLY_PAID';
          invoiceUpdateData = {
            paid: NEW_PAID,
            status: invoiceStatus
          };
          _context10.next = 21;
          return regeneratorRuntime.awrap(InvoiceModel.findByIdAndUpdate(invoice._id, invoiceUpdateData, {
            "new": true
          }));

        case 21:
          updatedInvoice = _context10.sent;
          return _context10.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added payment successfully!'],
            invoice: updatedInvoice
          }));

        case 25:
          _context10.prev = 25;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          return _context10.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context10.t0.message
          }));

        case 29:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 25]]);
};

var deleteInvoice = function deleteInvoice(request, response) {
  var invoiceId, deletedInvoicePromise, deletedInvoiceServicesPromise, _ref5, _ref6, deletedInvoice, deletedInvoiceServices;

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
          _ref5 = _context11.sent;
          _ref6 = _slicedToArray(_ref5, 2);
          deletedInvoice = _ref6[0];
          deletedInvoiceServices = _ref6[1];
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
  getClinicInvoicesByPatientId: getClinicInvoicesByPatientId,
  getInvoicesByInsuranceCompanyId: getInvoicesByInsuranceCompanyId,
  getInvoicesByOwnerId: getInvoicesByOwnerId,
  getInvoicesByPatientId: getInvoicesByPatientId
};