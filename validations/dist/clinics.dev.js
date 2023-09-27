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

var checkAddress = function checkAddress(addressData) {
  var buildingName = addressData.buildingName,
      apartmentNumber = addressData.apartmentNumber,
      floor = addressData.floor,
      street = addressData.street,
      additionalDirections = addressData.additionalDirections;
  if (!buildingName) return {
    isAccepted: false,
    message: 'Building name is required',
    field: 'address.buildingName'
  };
  if (typeof buildingName != 'string') return {
    isAccepted: false,
    message: 'Building name format is invalid',
    field: 'address.buildingName'
  };
  if (!apartmentNumber) return {
    isAccepted: false,
    message: 'Apartment number is required',
    field: 'address.apartmentNumber'
  };
  if (typeof apartmentNumber != 'string') return {
    isAccepted: false,
    message: 'Apartment number format is invalid',
    field: 'address.apartmentNumber'
  };
  if (!floor) return {
    isAccepted: false,
    message: 'Floor is required',
    field: 'address.floor'
  };
  if (typeof floor != 'string') return {
    isAccepted: false,
    message: 'Floor format is invalid',
    field: 'address.floor'
  };
  if (!street) return {
    isAccepted: false,
    message: 'Street is required',
    field: 'address.street'
  };
  if (typeof street != 'string') return {
    isAccepted: false,
    message: 'Street format is invalid',
    field: 'address.street'
  };
  if (additionalDirections && typeof additionalDirections != 'string') return {
    isAccepted: false,
    message: 'Additional directions format is invalid',
    field: 'address.additionalDirections'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: addressData
  };
};

var addClinic = function addClinic(clinicData) {
  var name = clinicData.name,
      ownerId = clinicData.ownerId,
      speciality = clinicData.speciality,
      phone = clinicData.phone,
      countryCode = clinicData.countryCode,
      city = clinicData.city,
      country = clinicData.country;
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
  if (typeof name != 'string') return {
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
  if (phone && typeof phone != 'number') return {
    isAccepted: false,
    message: 'Phone number format is invalid',
    field: 'phone'
  };
  if (countryCode && typeof countryCode != 'number') return {
    isAccepted: false,
    message: 'Country code format is invalid',
    field: 'countryCode'
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
  return {
    isAccepted: true,
    message: 'data is valid',
    data: clinicData
  };
};

var updateClinic = function updateClinic(clinicData) {
  var name = clinicData.name,
      speciality = clinicData.speciality,
      phone = clinicData.phone,
      countryCode = clinicData.countryCode,
      city = clinicData.city,
      country = clinicData.country;
  if (!name) return {
    isAccepted: false,
    message: 'Name is required',
    field: 'name'
  };
  if (typeof name != 'string') return {
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
  if (phone && typeof phone != 'number') return {
    isAccepted: false,
    message: 'Phone number format is invalid',
    field: 'phone'
  };
  if (countryCode && typeof countryCode != 'number') return {
    isAccepted: false,
    message: 'Country code format is invalid',
    field: 'countryCode'
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
  return {
    isAccepted: true,
    message: 'data is valid',
    data: clinicData
  };
};

module.exports = {
  addClinic: addClinic,
  updateClinic: updateClinic
};