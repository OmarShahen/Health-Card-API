"use strict";

var LabelModel = require('../../models/labels/LabelModel');

var ClinicPatientModel = require('../../models/ClinicPatientModel');

var labelValidation = require('../../validations/labels/labels');

var mongoose = require('mongoose');

var getLabels = function getLabels(request, response) {
  var labels;
  return regeneratorRuntime.async(function getLabels$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(LabelModel.find().sort({
            createdAt: -1
          }));

        case 3:
          labels = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            labels: labels
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

var addLabel = function addLabel(request, response) {
  var dataValidation, name, labelsList, labelData, labelObj, newLabel;
  return regeneratorRuntime.async(function addLabel$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = labelValidation.addLabel(request.body);

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
          name = request.body.name;
          _context2.next = 7;
          return regeneratorRuntime.awrap(LabelModel.find({
            name: name
          }));

        case 7:
          labelsList = _context2.sent;

          if (!(labelsList.length != 0)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Label name is already registered',
            field: 'name'
          }));

        case 10:
          labelData = {
            name: name
          };
          labelObj = new LabelModel(labelData);
          _context2.next = 14;
          return regeneratorRuntime.awrap(labelObj.save());

        case 14:
          newLabel = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'New label is added successfully!',
            label: newLabel
          }));

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var updateLabel = function updateLabel(request, response) {
  var dataValidation, labelId, name, label, nameList, labelData, updatedLabel;
  return regeneratorRuntime.async(function updateLabel$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = labelValidation.updateLabel(request.body);

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
          labelId = request.params.labelId;
          name = request.body.name;
          _context3.next = 8;
          return regeneratorRuntime.awrap(LabelModel.findById(labelId));

        case 8:
          label = _context3.sent;

          if (!(name != label.name)) {
            _context3.next = 15;
            break;
          }

          _context3.next = 12;
          return regeneratorRuntime.awrap(LabelModel.find({
            name: name
          }));

        case 12:
          nameList = _context3.sent;

          if (!(nameList.length != 0)) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Label name is already registered',
            field: 'name'
          }));

        case 15:
          labelData = {
            name: name
          };
          _context3.next = 18;
          return regeneratorRuntime.awrap(LabelModel.findByIdAndUpdate(labelId, labelData, {
            "new": true
          }));

        case 18:
          updatedLabel = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated label successfully!',
            label: updatedLabel
          }));

        case 22:
          _context3.prev = 22;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

var deleteLabel = function deleteLabel(request, response) {
  var labelId, clinicsPatientsList, deletedLabel;
  return regeneratorRuntime.async(function deleteLabel$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          labelId = request.params.labelId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(ClinicPatientModel.find({
            labels: mongoose.Types.ObjectId(labelId)
          }));

        case 4:
          clinicsPatientsList = _context4.sent;

          if (!(clinicsPatientsList.length != 0)) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Label is registered with entities',
            field: 'labelId'
          }));

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap(LabelModel.findByIdAndDelete(labelId));

        case 9:
          deletedLabel = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted label successfully!',
            label: deletedLabel
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

module.exports = {
  getLabels: getLabels,
  addLabel: addLabel,
  updateLabel: updateLabel,
  deleteLabel: deleteLabel
};