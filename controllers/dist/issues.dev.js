"use strict";

var IssueModel = require('../models/IssueModel');

var SpecialityModel = require('../models/SpecialityModel');

var CounterModel = require('../models/CounterModel');

var issueValidation = require('../validations/issues');

var mongoose = require('mongoose');

var addIssue = function addIssue(request, response) {
  var dataValidation, _request$body, name, specialityId, speciality, namesList, counter, issueData, issueObj, newIssue;

  return regeneratorRuntime.async(function addIssue$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          dataValidation = issueValidation.addIssue(request.body);

          if (dataValidation.isAccepted) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body = request.body, name = _request$body.name, specialityId = _request$body.specialityId;
          _context.next = 7;
          return regeneratorRuntime.awrap(SpecialityModel.findById(specialityId));

        case 7:
          speciality = _context.sent;

          if (speciality) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Speciality ID does not exist',
            field: 'specialityId'
          }));

        case 10:
          name = name.toLowerCase();
          _context.next = 13;
          return regeneratorRuntime.awrap(IssueModel.find({
            name: name
          }));

        case 13:
          namesList = _context.sent;

          if (!(namesList.length != 0)) {
            _context.next = 16;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Name is already registered',
            field: 'name'
          }));

        case 16:
          _context.next = 18;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'Issue'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 18:
          counter = _context.sent;
          issueData = {
            issueId: counter.value,
            name: name,
            specialityId: specialityId
          };
          issueObj = new IssueModel(issueData);
          _context.next = 23;
          return regeneratorRuntime.awrap(issueObj.save());

        case 23:
          newIssue = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added issue successfully!',
            issue: newIssue
          }));

        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 31:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

var getIssues = function getIssues(request, response) {
  var name, issues;
  return regeneratorRuntime.async(function getIssues$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          name = request.query.name;
          name = name ? name : '';
          _context2.next = 5;
          return regeneratorRuntime.awrap(IssueModel.aggregate([{
            $match: {
              name: {
                $regex: name,
                $options: 'i'
              }
            }
          }, {
            $limit: 25
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'specialityId',
              foreignField: '_id',
              as: 'speciality'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 5:
          issues = _context2.sent;
          issues.forEach(function (issue) {
            return issue.speciality = issue.speciality[0];
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            issues: issues
          }));

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var getIssuesBySpecialityId = function getIssuesBySpecialityId(request, response) {
  var specialityId, issues;
  return regeneratorRuntime.async(function getIssuesBySpecialityId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          specialityId = request.params.specialityId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(IssueModel.aggregate([{
            $match: {
              specialityId: mongoose.Types.ObjectId(specialityId)
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'specialityId',
              foreignField: '_id',
              as: 'speciality'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 4:
          issues = _context3.sent;
          issues.forEach(function (issue) {
            return issue.speciality = issue.speciality[0];
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            issues: issues
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

var updateIssue = function updateIssue(request, response) {
  var dataValidation, issueId, name, issue, namesList, updatedIssue;
  return regeneratorRuntime.async(function updateIssue$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          dataValidation = issueValidation.updateIssue(request.body);

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
          issueId = request.params.issueId;
          name = request.body.name;
          name = name.toLowerCase();
          _context4.next = 9;
          return regeneratorRuntime.awrap(IssueModel.findById(issueId));

        case 9:
          issue = _context4.sent;

          if (!(issue.name != name)) {
            _context4.next = 16;
            break;
          }

          _context4.next = 13;
          return regeneratorRuntime.awrap(IssueModel.find({
            name: name
          }));

        case 13:
          namesList = _context4.sent;

          if (!(namesList.length != 0)) {
            _context4.next = 16;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Name is already registered',
            field: 'name'
          }));

        case 16:
          _context4.next = 18;
          return regeneratorRuntime.awrap(IssueModel.findByIdAndUpdate(issueId, {
            name: name
          }, {
            "new": true
          }));

        case 18:
          updatedIssue = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated issue successfully!',
            issue: updatedIssue
          }));

        case 22:
          _context4.prev = 22;
          _context4.t0 = _context4["catch"](0);
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
  }, null, null, [[0, 22]]);
};

var deleteIssue = function deleteIssue(request, response) {
  var issueId, deletedIssue;
  return regeneratorRuntime.async(function deleteIssue$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          issueId = request.params.issueId;
          _context5.next = 4;
          return regeneratorRuntime.awrap(IssueModel.findByIdAndDelete(issueId));

        case 4:
          deletedIssue = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted issue successfully',
            issue: deletedIssue
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

module.exports = {
  addIssue: addIssue,
  getIssues: getIssues,
  getIssuesBySpecialityId: getIssuesBySpecialityId,
  updateIssue: updateIssue,
  deleteIssue: deleteIssue
};