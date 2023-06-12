"use strict";

var utils = require('../utils/utils');

var checkSpecialities = function checkSpecialities(specialities) {
  for (var i = 0; i < specialities.length; i++) {
    if (!utils.isObjectId(specialities[i])) {
      return false;
    }
  }

  return true;
};

var addClinic = function addClinic(clinicData) {
  var name = clinicData.name,
      ownerId = clinicData.ownerId,
      speciality = clinicData.speciality,
      countryCode = clinicData.countryCode,
      phone = clinicData.phone,
      city = clinicData.city,
      country = clinicData.country,
      address = clinicData.address,
      longitude = clinicData.longitude,
      latitude = clinicData.latitude;
  if (!ownerId) return {
    isAccepted: false,
    message: 'owner Id is required',
    field: 'ownerId'
  };
  if (!utils.isObjectId(ownerId)) return {
    isAccepted: false,
    message: 'owner Id is invalid',
    field: 'ownerId'
  };
  if (!name) return {
    isAccepted: false,
    message: 'Name is required',
    field: 'name'
  };
  if (!utils.isNameValid(name)) return {
    isAccepted: false,
    message: 'Invalid name formate',
    field: 'name'
  };
  if (!speciality) return {
    isAccepted: false,
    message: 'Speciality is required',
    field: 'speciality'
  };
  if (!Array.isArray(speciality)) return {
    isAccepted: false,
    message: 'Speciality must be a list',
    field: 'speciality'
  };
  if (!checkSpecialities(speciality)) return {
    isAccepted: false,
    message: 'Speciality values is invalid',
    field: 'speciality'
  };
  if (!countryCode) return {
    isAccepted: false,
    message: 'Country code is required',
    field: 'countryCode'
  };
  if (typeof countryCode != 'number') return {
    isAccepted: false,
    message: 'Invalid country code',
    field: 'countryCode'
  };
  if (!phone) return {
    isAccepted: false,
    message: 'Phone is required',
    field: 'phone'
  };
  if (typeof phone != 'number') return {
    isAccepted: false,
    message: 'Phone formate is invalid',
    field: 'phone'
  };
  if (!city) return {
    isAccepted: false,
    message: 'City is required',
    field: 'city'
  };
  if (typeof city != 'string') return {
    isAccepted: false,
    message: 'City formate is invalid',
    field: 'city'
  };
  if (!country) return {
    isAccepted: false,
    message: 'Country is required',
    field: 'country'
  };
  if (typeof country != 'string') return {
    isAccepted: false,
    message: 'Country formate is invalid',
    field: 'country'
  };
  if (!address) return {
    isAccepted: false,
    message: 'Address is required',
    field: 'address'
  };
  if (typeof address != 'string') return {
    isAccepted: false,
    message: 'Address formate is invalid',
    field: 'address'
  };
  if (longitude && typeof longitude != 'number') return {
    isAccepted: false,
    message: 'Longitude formate is invalid',
    field: 'longitude'
  };
  if (latitude && typeof latitude != 'number') return {
    isAccepted: false,
    message: 'Latitude formate is invalid',
    field: 'latitude'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: clinicData
  };
};

module.exports = {
  addClinic: addClinic
};