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

module.exports = {
    isNameValid,
    isEmailValid,
    cleanObject,
    isObjectId,
    isPhoneValid,
    isAdminRole,
    isCountryCodeValid,
    isExpirationPeriodValid,
    calculateExpirationDate,
    joinRegistrationPackages,
    isWhatsappLanguageValid,
    isDateValid,
    calculateRegistrationsTotalEarnings,
    calculateTotalAttendanceByDate
}