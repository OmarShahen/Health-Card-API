const { isNameValid } = require('./validateUsername')
const { isEmailValid } = require('./validateEmail')
const { cleanObject } = require('./cleanObject')
const { isObjectId } = require('./validateObjectId')
const { isPhoneValid } = require('./validatePhone')
const { isAdminRole } = require('./validateRoles')
const { isPhoneCountryCodeValid } = require('./validatePhoneCodes')
const { isExpirationPeriodValid } = require('./validateExpiresIn')
const { calculateExpirationDate } = require('./calculateExpirationDate')
const { joinRegistrationPackages } = require('./joinRegistrationPackages')

module.exports = {
    isNameValid,
    isEmailValid,
    cleanObject,
    isObjectId,
    isPhoneValid,
    isAdminRole,
    isPhoneCountryCodeValid,
    isExpirationPeriodValid,
    calculateExpirationDate,
    joinRegistrationPackages
}