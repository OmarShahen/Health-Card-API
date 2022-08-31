const { isNameValid } = require('./validateUsername')
const { isEmailValid } = require('./validateEmail')
const { cleanObject } = require('./cleanObject')
const { isObjectId } = require('./validateObjectId')
const { isPhoneValid } = require('./validatePhone')
const { isAdminRole } = require('./validateRoles')
const { isCountryCodeValid } = require('./validateCountryCodes')
const { isExpirationPeriodValid } = require('./validateExpiresIn')
const { calculateExpirationDate } = require('./calculateExpirationDate')
const { joinRegistrationPackages } = require('./joinRegistrationPackages')
const { isWhatsappLanguageValid } = require('./validateWhatsappLanguage')
const { isDateValid } = require('./validateDate')
const { calculateRegistrationsTotalEarnings, calculateTotalAttendanceByDate } = require('./calculations')
const { extractAttendances, extractStaffs, extractMembers } = require('./extracts')
const { joinStaffsWithAttendances, joinMembersWithAttendances } = require('./joins')
const { isUUIDValid } = require('./validateUUID')

module.exports = {
    isNameValid,
    isEmailValid,
    cleanObject,
    isObjectId,
    isPhoneValid,
    isUUIDValid,
    isAdminRole,
    isCountryCodeValid,
    isExpirationPeriodValid,
    calculateExpirationDate,
    joinRegistrationPackages,
    isWhatsappLanguageValid,
    isDateValid,
    calculateRegistrationsTotalEarnings,
    calculateTotalAttendanceByDate,
    extractAttendances,
    extractStaffs,
    extractMembers,
    joinStaffsWithAttendances,
    joinMembersWithAttendances
}