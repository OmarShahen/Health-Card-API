const { isNameValid } = require('./validateUsername')
const { isEmailValid } = require('./validateEmail')
const { cleanObject } = require('./cleanObject')
const { isObjectId } = require('./validateObjectId')
const { isPhoneValid } = require('./validatePhone')
const { isAdminRole } = require('./validateRoles')
const { isCountryCodeValid } = require('./validateCountryCodes')
const { isDatePeriodValid } = require('./validateDatePeriod')
const { calculateExpirationDate } = require('./calculateExpirationDate')
const { isWhatsappLanguageValid } = require('./validateWhatsappLanguage')
const { isDateValid, isBirthYearValid, isDateTimeValid } = require('./validateDate')
const { generateVerificationCode } = require('./random-number')
const { isUUIDValid } = require('./validateUUID')
const { statsQueryGenerator, growthDatePicker } = require('./queryGenerator')
const { distinctValues, getUniqueIds, getUniqueSuppliersFromPayments } = require('./distincts')
const { isListUnique } = require('./unique')
const { calculateServicesTotalCost } = require('./calculateServicesTotalCost')
const { isRolesValid } = require('./roles')
const { capitalizeFirstLetter, concatenateHmacString } = require('./formatString')

module.exports = {
    isRolesValid,
    isNameValid,
    isEmailValid,
    cleanObject,
    isObjectId,
    isPhoneValid,
    isUUIDValid,
    isAdminRole,
    isCountryCodeValid,
    isDatePeriodValid,
    generateVerificationCode,
    calculateExpirationDate,
    isWhatsappLanguageValid,
    isDateValid,
    isBirthYearValid,
    isDateTimeValid,
    statsQueryGenerator,
    growthDatePicker,
    distinctValues,
    getUniqueIds,
    getUniqueSuppliersFromPayments,
    isListUnique,
    calculateServicesTotalCost,
    capitalizeFirstLetter,
    concatenateHmacString
}