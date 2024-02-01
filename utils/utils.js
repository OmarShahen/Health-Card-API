const { isNameValid } = require('./validateUsername')
const { isEmailValid } = require('./validateEmail')
const { cleanObject } = require('./cleanObject')
const { isObjectId } = require('./validateObjectId')
const { isPhoneValid } = require('./validatePhone')
const { isAdminRole } = require('./validateRoles')
const { isCountryCodeValid } = require('./validateCountryCodes')
const { isDatePeriodValid } = require('./validateDatePeriod')
const { getTreatmentExpirationDate } = require('./expirationDate')
const { isWhatsappLanguageValid } = require('./validateWhatsappLanguage')
const { isDateValid, isBirthYearValid, isDateTimeValid, isTimeValid } = require('./validateDate')
const { generateVerificationCode } = require('./random-number')
const { isUUIDValid } = require('./validateUUID')
const { statsQueryGenerator, growthDatePicker } = require('./queryGenerator')
const { distinctValues, getUniqueIds, getUniqueSuppliersFromPayments } = require('./distincts')
const { isListUnique } = require('./unique')
const { calculateServicesTotalCost } = require('./calculateServicesTotalCost')
const { isRolesValid } = require('./roles')
const { capitalizeFirstLetter, concatenateHmacString } = require('./formatString')
const { isValidURL } = require('./validateURL')
const { getTime, getAge, getHoursDifference } = require('./format-time')
const { isPasswordStrong } = require('./validatePassword')
const { calculateExpertProfileCompletePercentage } = require('./calculateProfileCompletePercentage')


module.exports = {
    isRolesValid,
    isNameValid,
    isEmailValid,
    cleanObject,
    isObjectId,
    isPhoneValid,
    isUUIDValid,
    isAdminRole,
    isValidURL,
    isCountryCodeValid,
    isDatePeriodValid,
    generateVerificationCode,
    getTreatmentExpirationDate,
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
    concatenateHmacString,
    getTime,
    getAge,
    isTimeValid,
    getHoursDifference,
    isPasswordStrong,
    calculateExpertProfileCompletePercentage
}