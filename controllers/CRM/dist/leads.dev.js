"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LeadModel = require('../../models/CRM/leadModel');

var SpecialityModel = require('../../models/SpecialityModel');

var CounterModel = require('../../models/CounterModel');

var leadValidation = require('../../validations/CRM/leads');

var mongoose = require('mongoose');

var getLeads = function getLeads(request, response) {
  var leads;
  return regeneratorRuntime.async(function getLeads$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(LeadModel.find().sort({
            createdAt: -1
          }));

        case 3:
          leads = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            leads: leads
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

var addLead = function addLead(request, response) {
  var dataValidation, _request$body, name, countryCode, phone, clinicName, clinicCountryCode, clinicPhone, speciality, leadsNameList, leadPhoneList, leadsClinicNameList, leadClinicPhoneList, specialitiesList, counter, leadData, leadObj, newLead;

  return regeneratorRuntime.async(function addLead$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = leadValidation.addLead(request.body);

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
          _request$body = request.body, name = _request$body.name, countryCode = _request$body.countryCode, phone = _request$body.phone, clinicName = _request$body.clinicName, clinicCountryCode = _request$body.clinicCountryCode, clinicPhone = _request$body.clinicPhone, speciality = _request$body.speciality;
          _context2.next = 7;
          return regeneratorRuntime.awrap(LeadModel.find({
            name: name
          }));

        case 7:
          leadsNameList = _context2.sent;

          if (!(leadsNameList.length != 0)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Lead name is already registered',
            field: 'name'
          }));

        case 10:
          if (!(countryCode && phone)) {
            _context2.next = 16;
            break;
          }

          _context2.next = 13;
          return regeneratorRuntime.awrap(LeadModel.find({
            countryCode: countryCode,
            phone: phone
          }));

        case 13:
          leadPhoneList = _context2.sent;

          if (!(leadPhoneList.length != 0)) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Lead phone is already registered',
            field: 'phone'
          }));

        case 16:
          if (!clinicName) {
            _context2.next = 22;
            break;
          }

          _context2.next = 19;
          return regeneratorRuntime.awrap(LeadModel.find({
            'clinic.name': clinicName
          }));

        case 19:
          leadsClinicNameList = _context2.sent;

          if (!(leadsClinicNameList.length != 0)) {
            _context2.next = 22;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Lead clinic name is already registered',
            field: 'clinicName'
          }));

        case 22:
          if (!(clinicCountryCode && clinicPhone)) {
            _context2.next = 28;
            break;
          }

          _context2.next = 25;
          return regeneratorRuntime.awrap(LeadModel.find({
            'clinic.countryCode': clinicCountryCode,
            'clinic.phone': clinicPhone
          }));

        case 25:
          leadClinicPhoneList = _context2.sent;

          if (!(leadClinicPhoneList.length != 0)) {
            _context2.next = 28;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Lead clinic phone is already registered',
            field: 'clinicPhone'
          }));

        case 28:
          if (!speciality) {
            _context2.next = 35;
            break;
          }

          _context2.next = 31;
          return regeneratorRuntime.awrap(SpecialityModel.find({
            _id: {
              $in: speciality
            }
          }));

        case 31:
          specialitiesList = _context2.sent;

          if (!(specialitiesList.length != speciality.length)) {
            _context2.next = 34;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid specialities Ids',
            field: 'speciality'
          }));

        case 34:
          request.body.speciality.forEach(function (special) {
            return special = mongoose.Types.ObjectId(special);
          });

        case 35:
          _context2.next = 37;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'lead'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 37:
          counter = _context2.sent;
          leadData = _objectSpread({
            leadId: counter.value
          }, request.body, {
            clinic: {
              name: clinicName,
              countryCode: clinicCountryCode,
              phone: clinicPhone
            }
          });
          leadObj = new LeadModel(leadData);
          _context2.next = 42;
          return regeneratorRuntime.awrap(leadObj.save());

        case 42:
          newLead = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added new lead successfully!',
            lead: newLead
          }));

        case 46:
          _context2.prev = 46;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 50:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 46]]);
};

var deleteLead = function deleteLead(request, response) {
  var leadId, deletedLead;
  return regeneratorRuntime.async(function deleteLead$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          leadId = request.params.leadId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(LeadModel.findByIdAndDelete(leadId));

        case 4:
          deletedLead = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted lead successfully!',
            lead: deletedLead
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

module.exports = {
  getLeads: getLeads,
  addLead: addLead,
  deleteLead: deleteLead
};