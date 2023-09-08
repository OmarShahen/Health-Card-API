"use strict";

var InsuranceModel = require('../models/InsuranceModel');

var InsurancePolicyModel = require('../models/InsurancePolicyModel');

var ClinicModel = require('../models/ClinicModel');

var InvoiceModel = require('../models/InvoiceModel');

var ClinicOwnerModel = require('../models/ClinicOwnerModel');

var insuranceValidator = require('../validations/insurances');

var translations = require('../i18n/index');

var mongoose = require('mongoose');

var getInsurances = function getInsurances(request, response) {
  var insurances;
  return regeneratorRuntime.async(function getInsurances$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(InsuranceModel.find().sort({
            createdAt: -1
          }));

        case 3:
          insurances = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            insurances: insurances
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

var getInsurance = function getInsurance(request, response) {
  var insuranceId, insurance;
  return regeneratorRuntime.async(function getInsurance$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          insuranceId = request.params.insuranceId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(InsuranceModel.findById(insuranceId));

        case 4:
          insurance = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            insurance: insurance
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

var getInsurancesByClinicId = function getInsurancesByClinicId(request, response) {
  var clinicId, insurances;
  return regeneratorRuntime.async(function getInsurancesByClinicId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          clinicId = request.params.clinicId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(InsuranceModel.aggregate([{
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
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 4:
          insurances = _context3.sent;
          insurances.forEach(function (insurance) {
            return insurance.clinic = insurance.clinic[0];
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            insurances: insurances
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

var getInsurancesByOwnerId = function getInsurancesByOwnerId(request, response) {
  var userId, ownerClinics, clinics, insurances;
  return regeneratorRuntime.async(function getInsurancesByOwnerId$(_context4) {
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
          return regeneratorRuntime.awrap(InsuranceModel.aggregate([{
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
          insurances = _context4.sent;
          insurances.forEach(function (insurance) {
            return insurance.clinic = insurance.clinic[0];
          });
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            insurances: insurances
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

var addInsurance = function addInsurance(request, response) {
  var dataValidation, _request$body, name, clinicId, startDate, endDate, clinic, insuranceList, insuranceData, insuranceObj, newInsurance;

  return regeneratorRuntime.async(function addInsurance$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          dataValidation = insuranceValidator.addInsurance(request.body);

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
          _request$body = request.body, name = _request$body.name, clinicId = _request$body.clinicId, startDate = _request$body.startDate, endDate = _request$body.endDate;
          _context5.next = 7;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 7:
          clinic = _context5.sent;

          if (clinic) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic ID does not exists',
            field: 'clinicId'
          }));

        case 10:
          _context5.next = 12;
          return regeneratorRuntime.awrap(InsuranceModel.find({
            name: name,
            clinicId: clinicId
          }));

        case 12:
          insuranceList = _context5.sent;

          if (!(insuranceList.length != 0)) {
            _context5.next = 15;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Name is already registered in the clinic'],
            field: 'name'
          }));

        case 15:
          insuranceData = {
            name: name,
            clinicId: clinicId,
            startDate: startDate,
            endDate: endDate
          };
          insuranceObj = new InsuranceModel(insuranceData);
          _context5.next = 19;
          return regeneratorRuntime.awrap(insuranceObj.save());

        case 19:
          newInsurance = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added new insurance successfully!'],
            insurance: newInsurance
          }));

        case 23:
          _context5.prev = 23;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 27:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 23]]);
};

var deleteInsurance = function deleteInsurance(request, response) {
  var insuranceId, invoicesList, insurancePoliciesList, insurance;
  return regeneratorRuntime.async(function deleteInsurance$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          insuranceId = request.params.insuranceId;
          _context6.next = 4;
          return regeneratorRuntime.awrap(InvoiceModel.find({
            insuranceCompanyId: insuranceId
          }));

        case 4:
          invoicesList = _context6.sent;

          if (!(invoicesList.length != 0)) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['This insurance is registered with invoices'],
            field: 'insuranceId'
          }));

        case 7:
          _context6.next = 9;
          return regeneratorRuntime.awrap(InsurancePolicyModel.find({
            insuranceCompanyId: insuranceId
          }));

        case 9:
          insurancePoliciesList = _context6.sent;

          if (!(insurancePoliciesList.length != 0)) {
            _context6.next = 12;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['This insurance is registered with insurance policies'],
            field: 'insuranceId'
          }));

        case 12:
          _context6.next = 14;
          return regeneratorRuntime.awrap(InsuranceModel.findByIdAndDelete(insuranceId));

        case 14:
          insurance = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Deleted insurance successfully!'],
            insurance: insurance
          }));

        case 18:
          _context6.prev = 18;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 22:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var updateInsurance = function updateInsurance(request, response) {
  var dataValidation, insuranceId, _request$body2, name, startDate, endDate, insurance, nameList, insuranceStartDate, insuranceEndDate, insurancePolicies, insuranceData, updatedInsurance;

  return regeneratorRuntime.async(function updateInsurance$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          dataValidation = insuranceValidator.updateInsurance(request.body);

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
          insuranceId = request.params.insuranceId;
          _request$body2 = request.body, name = _request$body2.name, startDate = _request$body2.startDate, endDate = _request$body2.endDate;
          _context7.next = 8;
          return regeneratorRuntime.awrap(InsuranceModel.findById(insuranceId));

        case 8:
          insurance = _context7.sent;

          if (!(name != insurance.name)) {
            _context7.next = 15;
            break;
          }

          _context7.next = 12;
          return regeneratorRuntime.awrap(InsuranceModel.find({
            clinicId: insurance.clinicId,
            name: name
          }));

        case 12:
          nameList = _context7.sent;

          if (!(nameList.length != 0)) {
            _context7.next = 15;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Name is already registered in the clinic'],
            field: 'name'
          }));

        case 15:
          insuranceStartDate = new Date(insurance.startDate).getTime();
          insuranceEndDate = new Date(insurance.endDate).getTime();

          if (!(new Date(startDate).getTime() != insuranceStartDate || new Date(endDate).getTime() != insuranceEndDate)) {
            _context7.next = 23;
            break;
          }

          _context7.next = 20;
          return regeneratorRuntime.awrap(InsurancePolicyModel.find({
            insuranceCompanyId: insuranceId
          }));

        case 20:
          insurancePolicies = _context7.sent;

          if (!(insurancePolicies.length != 0)) {
            _context7.next = 23;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Cannot update dates and there is insurance policies registered with it'],
            field: 'insuranceId'
          }));

        case 23:
          insuranceData = {
            name: name,
            startDate: startDate,
            endDate: endDate
          };
          _context7.next = 26;
          return regeneratorRuntime.awrap(InsuranceModel.findByIdAndUpdate(insuranceId, insuranceData, {
            "new": true
          }));

        case 26:
          updatedInsurance = _context7.sent;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated insurance successfully!'],
            insurance: updatedInsurance
          }));

        case 30:
          _context7.prev = 30;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 34:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 30]]);
};

var updateInsuranceStatus = function updateInsuranceStatus(request, response) {
  var insuranceId, isActive, dataValidation, insurance, todayDate, insuranceEndDate, updateData, updatedInsurance;
  return regeneratorRuntime.async(function updateInsuranceStatus$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          insuranceId = request.params.insuranceId;
          isActive = request.body.isActive;
          dataValidation = insuranceValidator.updateInsuranceStatus(request.body);

          if (dataValidation.isAccepted) {
            _context8.next = 6;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 6:
          _context8.next = 8;
          return regeneratorRuntime.awrap(InsuranceModel.findById(insuranceId));

        case 8:
          insurance = _context8.sent;
          todayDate = new Date();
          insuranceEndDate = new Date(insurance.endDate);

          if (!(todayDate > insuranceEndDate)) {
            _context8.next = 13;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Insurance passed expiry date'],
            field: 'insuranceId'
          }));

        case 13:
          updateData = {
            isActive: isActive
          };
          _context8.next = 16;
          return regeneratorRuntime.awrap(InsuranceModel.findByIdAndUpdate(insuranceId, updateData, {
            "new": true
          }));

        case 16:
          updatedInsurance = _context8.sent;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated insurance company status successfully!'],
            insurance: updatedInsurance
          }));

        case 20:
          _context8.prev = 20;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 24:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

module.exports = {
  getInsurances: getInsurances,
  getInsurance: getInsurance,
  getInsurancesByClinicId: getInsurancesByClinicId,
  getInsurancesByOwnerId: getInsurancesByOwnerId,
  addInsurance: addInsurance,
  deleteInsurance: deleteInsurance,
  updateInsurance: updateInsurance,
  updateInsuranceStatus: updateInsuranceStatus
};