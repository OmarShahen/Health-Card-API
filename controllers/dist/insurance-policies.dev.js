"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var InsurancePolicyModel = require('../models/InsurancePolicyModel');

var InsuranceModel = require('../models/InsuranceModel');

var InvoiceModel = require('../models/InvoiceModel');

var ClinicModel = require('../models/ClinicModel');

var ClinicOwnerModel = require('../models/ClinicOwnerModel');

var ClinicPatientModel = require('../models/ClinicPatientModel');

var PatientModel = require('../models/PatientModel');

var insurancePolicyValidator = require('../validations/insurance-policies');

var mongoose = require('mongoose');

var getInsurancePolicies = function getInsurancePolicies(request, response) {
  var insurancePolicies;
  return regeneratorRuntime.async(function getInsurancePolicies$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(InsurancePolicyModel.find().sort({
            createdAt: -1
          }));

        case 3:
          insurancePolicies = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            insurancePolicies: insurancePolicies
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

var getInsurancePoliciesByClinicId = function getInsurancePoliciesByClinicId(request, response) {
  var clinicId, insurancePolicies;
  return regeneratorRuntime.async(function getInsurancePoliciesByClinicId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          clinicId = request.params.clinicId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(InsurancePolicyModel.aggregate([{
            $match: {
              clinicId: mongoose.Types.ObjectId(clinicId)
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
            $sort: {
              createdAt: -1
            }
          }]));

        case 4:
          insurancePolicies = _context2.sent;
          insurancePolicies.forEach(function (insurancePolicy) {
            insurancePolicy.insuranceCompany = insurancePolicy.insuranceCompany[0];
            insurancePolicy.clinic = insurancePolicy.clinic[0];
            insurancePolicy.patient = insurancePolicy.patient[0];
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            insurancePolicies: insurancePolicies
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

var getInsurancePoliciesByInsuranceCompanyId = function getInsurancePoliciesByInsuranceCompanyId(request, response) {
  var insuranceId, insurancePolicies;
  return regeneratorRuntime.async(function getInsurancePoliciesByInsuranceCompanyId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          insuranceId = request.params.insuranceId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(InsurancePolicyModel.aggregate([{
            $match: {
              insuranceCompanyId: mongoose.Types.ObjectId(insuranceId)
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
            $sort: {
              createdAt: -1
            }
          }]));

        case 4:
          insurancePolicies = _context3.sent;
          insurancePolicies.forEach(function (insurancePolicy) {
            insurancePolicy.insuranceCompany = insurancePolicy.insuranceCompany[0];
            insurancePolicy.clinic = insurancePolicy.clinic[0];
            insurancePolicy.patient = insurancePolicy.patient[0];
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            insurancePolicies: insurancePolicies
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

var getInsurancePoliciesByOwnerId = function getInsurancePoliciesByOwnerId(request, response) {
  var userId, ownerClinics, clinics, insurancePolicies;
  return regeneratorRuntime.async(function getInsurancePoliciesByOwnerId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = request.params.userId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(ClinicOwnerModel.find({
            ownerId: userId
          }));

        case 4:
          ownerClinics = _context4.sent;
          clinics = ownerClinics.map(function (clinic) {
            return clinic.clinicId;
          });
          _context4.next = 8;
          return regeneratorRuntime.awrap(InsurancePolicyModel.aggregate([{
            $match: {
              clinicId: {
                $in: clinics
              }
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
            $sort: {
              createdAt: -1
            }
          }]));

        case 8:
          insurancePolicies = _context4.sent;
          insurancePolicies.forEach(function (insurancePolicy) {
            insurancePolicy.insuranceCompany = insurancePolicy.insuranceCompany[0];
            insurancePolicy.clinic = insurancePolicy.clinic[0];
            insurancePolicy.patient = insurancePolicy.patient[0];
          });
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            insurancePolicies: insurancePolicies
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

var addInsurancePolicy = function addInsurancePolicy(request, response) {
  var dataValidation, _request$body, insuranceCompanyId, clinicId, cardId, type, status, coveragePercentage, startDate, endDate, insuranceCompanyPromise, clinicPromise, patientListPromise, _ref, _ref2, insuranceCompany, clinic, patientList, patientId, clinicPatientList, patientInsurancePolicy, insurancePolicyData, insurancePolicyObj, newInsurancePolicy;

  return regeneratorRuntime.async(function addInsurancePolicy$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          dataValidation = insurancePolicyValidator.addInsurancePolicy(request.body);

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
          _request$body = request.body, insuranceCompanyId = _request$body.insuranceCompanyId, clinicId = _request$body.clinicId, cardId = _request$body.cardId, type = _request$body.type, status = _request$body.status, coveragePercentage = _request$body.coveragePercentage, startDate = _request$body.startDate, endDate = _request$body.endDate;
          insuranceCompanyPromise = InsuranceModel.findById(insuranceCompanyId);
          clinicPromise = ClinicModel.findById(clinicId);
          patientListPromise = PatientModel.find({
            cardId: cardId
          });
          _context5.next = 10;
          return regeneratorRuntime.awrap(Promise.all([insuranceCompanyPromise, clinicPromise, patientListPromise]));

        case 10:
          _ref = _context5.sent;
          _ref2 = _slicedToArray(_ref, 3);
          insuranceCompany = _ref2[0];
          clinic = _ref2[1];
          patientList = _ref2[2];

          if (insuranceCompany) {
            _context5.next = 17;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Insurance company ID is not registered',
            field: 'insuranceCompanyId'
          }));

        case 17:
          if (clinic) {
            _context5.next = 19;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic ID is not registered',
            field: 'clinic'
          }));

        case 19:
          if (!(patientList.length == 0)) {
            _context5.next = 21;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Patient card ID is not registered',
            field: 'cardId'
          }));

        case 21:
          patientId = patientList[0]._id;
          _context5.next = 24;
          return regeneratorRuntime.awrap(ClinicPatientModel.find({
            patientId: patientId
          }));

        case 24:
          clinicPatientList = _context5.sent;

          if (!(clinicPatientList.length == 0)) {
            _context5.next = 27;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Patient is not registered in clinic',
            field: 'cardId'
          }));

        case 27:
          _context5.next = 29;
          return regeneratorRuntime.awrap(InsurancePolicyModel.find({
            patientId: patientId,
            clinicId: clinicId,
            status: 'ACTIVE',
            endDate: {
              $gt: Date.now()
            }
          }));

        case 29:
          patientInsurancePolicy = _context5.sent;

          if (!(patientInsurancePolicy.length != 0)) {
            _context5.next = 32;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Patient is already registered with active insurance policy in clinic',
            field: 'patientId'
          }));

        case 32:
          insurancePolicyData = {
            insuranceCompanyId: insuranceCompanyId,
            clinicId: clinicId,
            patientId: patientId,
            type: type,
            status: status,
            coveragePercentage: coveragePercentage,
            startDate: startDate,
            endDate: endDate
          };
          insurancePolicyObj = new InsurancePolicyModel(insurancePolicyData);
          _context5.next = 36;
          return regeneratorRuntime.awrap(insurancePolicyObj.save());

        case 36:
          newInsurancePolicy = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added new insurance policy successfully!',
            insurancePolicy: newInsurancePolicy
          }));

        case 40:
          _context5.prev = 40;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 44:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 40]]);
};

var deleteInsurancePolicy = function deleteInsurancePolicy(request, response) {
  var insurancePolicyId, invoices, deletedInsurancePolicy;
  return regeneratorRuntime.async(function deleteInsurancePolicy$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          insurancePolicyId = request.params.insurancePolicyId;
          _context6.next = 4;
          return regeneratorRuntime.awrap(InvoiceModel.find({
            insurancePolicyId: insurancePolicyId
          }));

        case 4:
          invoices = _context6.sent;

          if (!(invoices.length != 0)) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Insurance policy is registered with invoices',
            field: 'insurancePolicyId'
          }));

        case 7:
          _context6.next = 9;
          return regeneratorRuntime.awrap(InsurancePolicyModel.findByIdAndDelete(insurancePolicyId));

        case 9:
          deletedInsurancePolicy = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted insurance policy successfully!',
            insurancePolicy: deletedInsurancePolicy
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

var updateInsurancePolicyStatus = function updateInsurancePolicyStatus(request, response) {
  var insurancePolicyId, dataValidation, status, insurancePolicy, todayDate, insurancePolicyEndDate, patientId, clinicId, patientInsurancePolicy, updatedInsurancePolicy;
  return regeneratorRuntime.async(function updateInsurancePolicyStatus$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          insurancePolicyId = request.params.insurancePolicyId;
          dataValidation = insurancePolicyValidator.updateInsurancePolicyStatus(request.body);

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
          status = request.body.status;
          _context7.next = 8;
          return regeneratorRuntime.awrap(InsurancePolicyModel.findById(insurancePolicyId));

        case 8:
          insurancePolicy = _context7.sent;
          todayDate = new Date();
          insurancePolicyEndDate = new Date(insurancePolicy.endDate);

          if (!(todayDate > insurancePolicyEndDate)) {
            _context7.next = 13;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Insurance end date has passed',
            field: 'endDate'
          }));

        case 13:
          if (!(status == insurancePolicy.status)) {
            _context7.next = 15;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Insurance policy is already in this status',
            field: 'status'
          }));

        case 15:
          if (!(status == 'ACTIVE')) {
            _context7.next = 22;
            break;
          }

          patientId = insurancePolicy.patientId, clinicId = insurancePolicy.clinicId;
          _context7.next = 19;
          return regeneratorRuntime.awrap(InsurancePolicyModel.find({
            patientId: patientId,
            clinicId: clinicId,
            status: 'ACTIVE',
            endDate: {
              $gt: Date.now()
            }
          }));

        case 19:
          patientInsurancePolicy = _context7.sent;

          if (!(patientInsurancePolicy.length != 0)) {
            _context7.next = 22;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Patient is already registered with active insurance policy in clinic',
            field: 'patientId'
          }));

        case 22:
          _context7.next = 24;
          return regeneratorRuntime.awrap(InsurancePolicyModel.findByIdAndUpdate(insurancePolicyId, {
            status: status
          }, {
            "new": true
          }));

        case 24:
          updatedInsurancePolicy = _context7.sent;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated insurance policy status successfully!',
            insurancePolicy: updatedInsurancePolicy
          }));

        case 28:
          _context7.prev = 28;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 32:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 28]]);
};

var updateInsurancePolicy = function updateInsurancePolicy(request, response) {
  var insurancePolicyId, dataValidation, invoicesList, insurancePolicy, todayDate, insurancePolicyEndDate, _request$body2, type, coveragePercentage, startDate, endDate, updateInsurancePolicyData, updatedInsurancePolicy;

  return regeneratorRuntime.async(function updateInsurancePolicy$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          insurancePolicyId = request.params.insurancePolicyId;
          dataValidation = insurancePolicyValidator.updateInsurancePolicy(request.body);

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
          _context8.next = 7;
          return regeneratorRuntime.awrap(InvoiceModel.find({
            insurancePolicyId: insurancePolicyId
          }));

        case 7:
          invoicesList = _context8.sent;

          if (!(invoicesList.length != 0)) {
            _context8.next = 10;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Insurance policy is registered with invoices',
            field: 'insurancePolicyId'
          }));

        case 10:
          _context8.next = 12;
          return regeneratorRuntime.awrap(InsurancePolicyModel.findById(insurancePolicyId));

        case 12:
          insurancePolicy = _context8.sent;

          if (!(insurancePolicy.status == 'INACTIVE')) {
            _context8.next = 15;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Insurance Policy is inactive',
            field: 'insurancePolicyId'
          }));

        case 15:
          todayDate = new Date();
          insurancePolicyEndDate = new Date(insurancePolicy.endDate);

          if (!(todayDate > insurancePolicyEndDate)) {
            _context8.next = 19;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Insurance end date has passed',
            field: 'insurancePolicyId'
          }));

        case 19:
          _request$body2 = request.body, type = _request$body2.type, coveragePercentage = _request$body2.coveragePercentage, startDate = _request$body2.startDate, endDate = _request$body2.endDate;
          updateInsurancePolicyData = {
            type: type,
            coveragePercentage: coveragePercentage,
            startDate: startDate,
            endDate: endDate
          };
          _context8.next = 23;
          return regeneratorRuntime.awrap(InsurancePolicyModel.findByIdAndUpdate(insurancePolicyId, updateInsurancePolicyData, {
            "new": true
          }));

        case 23:
          updatedInsurancePolicy = _context8.sent;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated insurance policy successfully!',
            insurancePolicy: updatedInsurancePolicy
          }));

        case 27:
          _context8.prev = 27;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 31:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

module.exports = {
  getInsurancePolicies: getInsurancePolicies,
  addInsurancePolicy: addInsurancePolicy,
  getInsurancePoliciesByClinicId: getInsurancePoliciesByClinicId,
  getInsurancePoliciesByOwnerId: getInsurancePoliciesByOwnerId,
  getInsurancePoliciesByInsuranceCompanyId: getInsurancePoliciesByInsuranceCompanyId,
  deleteInsurancePolicy: deleteInsurancePolicy,
  updateInsurancePolicyStatus: updateInsurancePolicyStatus,
  updateInsurancePolicy: updateInsurancePolicy
};