const { isNameValid } = require('./validateUsername')
const { isEmailValid } = require('./validateEmail')
const { cleanObject } = require('./cleanObject')
const { isObjectId } = require('./validateObjectId')
const { isPhoneValid } = require('./validatePhone')
const { isAdminRole } = require('./validateRoles')
const { isCountryCodeValid } = require('./validateCountryCodes')
const { isDatePeriodValid } = require('./validateDatePeriod')
const { calculateExpirationDate } = require('./calculateExpirationDate')
const { joinRegistrationPackages } = require('./joinRegistrationPackages')
const { isWhatsappLanguageValid } = require('./validateWhatsappLanguage')
const { isDateValid } = require('./validateDate')
const { 
    calculateRegistrationsTotalEarnings, 
    calculateTotalAttendanceByDate, 
    calculatePackagePercentage,
    calculateCompletedPackageAttendances
} = require('./calculations')
const { extractAttendances, extractStaffs, extractMembers } = require('./extracts')
const { joinStaffsWithAttendances, joinMembersWithAttendances, joinPackages } = require('./joins')
const { isUUIDValid } = require('./validateUUID')
const { statsQueryGenerator } = require('./queryGenerator')
const { distinctValues } = require('./distincts')

module.exports = {
    isNameValid,
    isEmailValid,
    cleanObject,
    isObjectId,
    isPhoneValid,
    isUUIDValid,
    isAdminRole,
    isCountryCodeValid,
    isDatePeriodValid,
    calculateExpirationDate,
    joinRegistrationPackages,
    isWhatsappLanguageValid,
    isDateValid,
    calculateRegistrationsTotalEarnings,
    calculateTotalAttendanceByDate,
    calculatePackagePercentage,
    calculateCompletedPackageAttendances,
    extractAttendances,
    extractStaffs,
    extractMembers,
    statsQueryGenerator,
    joinPackages,
    distinctValues
}