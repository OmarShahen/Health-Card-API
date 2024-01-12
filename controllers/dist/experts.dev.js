"use strict";

var UserModel = require('../models/UserModel');

var mongoose = require('mongoose');

var searchExperts = function searchExperts(request, response) {
  var specialityId, _request$query, gender, sortBy, subSpecialityId, page, limit, skip, matchQuery, sortQuery, experts, totalExperts;

  return regeneratorRuntime.async(function searchExperts$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          specialityId = request.params.specialityId;
          _request$query = request.query, gender = _request$query.gender, sortBy = _request$query.sortBy, subSpecialityId = _request$query.subSpecialityId, page = _request$query.page, limit = _request$query.limit;
          page = page ? page : 1;
          limit = limit ? limit : 10;
          skip = (page - 1) * limit;
          matchQuery = {
            speciality: {
              $in: [mongoose.Types.ObjectId(specialityId)]
            },
            isVerified: true,
            isShow: true,
            type: 'EXPERT'
          };
          sortQuery = {
            createdAt: -1
          };

          if (gender) {
            matchQuery.gender = gender;
          }

          if (subSpecialityId) {
            matchQuery.subSpeciality = {
              $in: [mongoose.Types.ObjectId(subSpecialityId)]
            };
          }

          if (sortBy == 'HIGH-RATING') {
            sortQuery.rating = -1;
          } else if (sortBy == 'HIGH-PRICE') {
            sortQuery['pricing.price'] = -1;
          } else if (sortBy == 'LOW-PRICE') {
            sortQuery['pricing.price'] = 1;
          }

          _context.next = 13;
          return regeneratorRuntime.awrap(UserModel.aggregate([{
            $match: matchQuery
          }, {
            $sort: {
              rating: -1,
              createdAt: -1
            }
          }, {
            $skip: skip
          }, {
            $limit: Number.parseInt(limit)
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'speciality',
              foreignField: '_id',
              as: 'speciality'
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'subSpeciality',
              foreignField: '_id',
              as: 'subSpeciality'
            }
          }, {
            $project: {
              password: 0
            }
          }]));

        case 13:
          experts = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(UserModel.countDocuments(matchQuery));

        case 16:
          totalExperts = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            totalExperts: totalExperts,
            experts: experts
          }));

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

var searchExpertsByNameAndSpeciality = function searchExpertsByNameAndSpeciality(request, response) {
  var _request$params, specialityId, name, matchQuery, experts, totalExperts;

  return regeneratorRuntime.async(function searchExpertsByNameAndSpeciality$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _request$params = request.params, specialityId = _request$params.specialityId, name = _request$params.name;
          matchQuery = {
            speciality: {
              $in: [mongoose.Types.ObjectId(specialityId)]
            },
            isVerified: true,
            isShow: true,
            type: 'EXPERT',
            firstName: {
              $regex: name,
              $options: 'i'
            }
          };
          _context2.next = 5;
          return regeneratorRuntime.awrap(UserModel.aggregate([{
            $match: matchQuery
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'speciality',
              foreignField: '_id',
              as: 'speciality'
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'subSpeciality',
              foreignField: '_id',
              as: 'subSpeciality'
            }
          }, {
            $project: {
              password: 0
            }
          }]));

        case 5:
          experts = _context2.sent;
          _context2.next = 8;
          return regeneratorRuntime.awrap(UserModel.countDocuments(matchQuery));

        case 8:
          totalExperts = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            totalExperts: totalExperts,
            experts: experts
          }));

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

module.exports = {
  searchExperts: searchExperts,
  searchExpertsByNameAndSpeciality: searchExpertsByNameAndSpeciality
};