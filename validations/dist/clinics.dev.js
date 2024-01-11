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
      subSpeciality = clinicData.subSpeciality,
      phone = clinicData.phone,
      countryCode = clinicData.countryCode,
      notificationCountryCode = clinicData.notificationCountryCode,
      notificationPhone = clinicData.notificationPhone,
      city = clinicData.city,
      country = clinicData.country,
      county = clinicData.county,
      address = clinicData.address;
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
  if (speciality.length == 0) return {
    isAccepted: false,
    message: 'Speciality must be atleast one',
    field: 'speciality'
  };
  if (!checkSpecialities(speciality)) return {
    isAccepted: false,
    message: 'Speciality Ids is invalid',
    field: 'speciality'
  };
  if (!subSpeciality) return {
    isAccepted: false,
    message: 'subSpeciality is required',
    field: 'subSpeciality'
  };
  if (!Array.isArray(subSpeciality)) return {
    isAccepted: false,
    message: 'subSpeciality must be a list',
    field: 'subSpeciality'
  };
  if (subSpeciality.length == 0) return {
    isAccepted: false,
    message: 'subSpeciality must be atleast one',
    field: 'subSpeciality'
  };
  if (!checkSpecialities(subSpeciality)) return {
    isAccepted: false,
    message: 'subSpeciality Ids is invalid',
    field: 'subSpeciality'
  };
  if (!phone) return {
    isAccepted: false,
    message: 'Phone is required',
    field: 'phone'
  };
  if (typeof phone != 'number') return {
    isAccepted: false,
    message: 'Phone number format is invalid',
    field: 'phone'
  };
  if (!countryCode) return {
    isAccepted: false,
    message: 'Country code is required',
    field: 'countryCode'
  };
  if (typeof countryCode != 'number') return {
    isAccepted: false,
    message: 'Country code format is invalid',
    field: 'countryCode'
  };
  if (!notificationCountryCode) return {
    isAccepted: false,
    message: 'Notification country code is required',
    field: 'notificationCountryCode'
  };
  if (typeof notificationCountryCode != 'number') return {
    isAccepted: false,
    message: 'Notification country code format is invalid',
    field: 'notificationCountryCode'
  };
  if (!notificationPhone) return {
    isAccepted: false,
    message: 'Notification phone is required',
    field: 'notificationPhone'
  };
  if (typeof notificationPhone != 'number') return {
    isAccepted: false,
    message: 'Notification phone format is invalid',
    field: 'notificationPhone'
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
  if (!county) return {
    isAccepted: false,
    message: 'County is required',
    field: 'county'
  };
  if (typeof county != 'string') return {
    isAccepted: false,
    message: 'County formate is invalid',
    field: 'county'
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
  return {
    isAccepted: true,
    message: 'data is valid',
    data: clinicData
  };
};

var updateClinic = function updateClinic(clinicData) {
  var name = clinicData.name,
      speciality = clinicData.speciality,
      subSpeciality = clinicData.subSpeciality,
      phone = clinicData.phone,
      countryCode = clinicData.countryCode,
      notificationCountryCode = clinicData.notificationCountryCode,
      notificationPhone = clinicData.notificationPhone,
      city = clinicData.city,
      country = clinicData.country,
      county = clinicData.county,
      address = clinicData.address;
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
  if (speciality.length == 0) return {
    isAccepted: false,
    message: 'Speciality must be atleast one',
    field: 'speciality'
  };
  if (!checkSpecialities(speciality)) return {
    isAccepted: false,
    message: 'Speciality Ids is invalid',
    field: 'speciality'
  };
  if (!subSpeciality) return {
    isAccepted: false,
    message: 'subSpeciality is required',
    field: 'subSpeciality'
  };
  if (!Array.isArray(subSpeciality)) return {
    isAccepted: false,
    message: 'subSpeciality must be a list',
    field: 'subSpeciality'
  };
  if (subSpeciality.length == 0) return {
    isAccepted: false,
    message: 'subSpeciality must be atleast one',
    field: 'subSpeciality'
  };
  if (!checkSpecialities(subSpeciality)) return {
    isAccepted: false,
    message: 'subSpeciality Ids is invalid',
    field: 'subSpeciality'
  };
  if (!phone) return {
    isAccepted: false,
    message: 'Phone is required',
    field: 'phone'
  };
  if (typeof phone != 'number') return {
    isAccepted: false,
    message: 'Phone number format is invalid',
    field: 'phone'
  };
  if (!countryCode) return {
    isAccepted: false,
    message: 'Country code is required',
    field: 'countryCode'
  };
  if (typeof countryCode != 'number') return {
    isAccepted: false,
    message: 'Country code format is invalid',
    field: 'countryCode'
  };
  if (!notificationCountryCode) return {
    isAccepted: false,
    message: 'Notification country code is required',
    field: 'notificationCountryCode'
  };
  if (typeof notificationCountryCode != 'number') return {
    isAccepted: false,
    message: 'Notification country code format is invalid',
    field: 'notificationCountryCode'
  };
  if (!notificationPhone) return {
    isAccepted: false,
    message: 'Notification phone is required',
    field: 'notificationPhone'
  };
  if (typeof notificationPhone != 'number') return {
    isAccepted: false,
    message: 'Notification phone format is invalid',
    field: 'notificationPhone'
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
  if (!county) return {
    isAccepted: false,
    message: 'County is required',
    field: 'county'
  };
  if (typeof county != 'string') return {
    isAccepted: false,
    message: 'County formate is invalid',
    field: 'county'
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