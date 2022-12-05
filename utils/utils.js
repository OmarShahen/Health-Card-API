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
    calculateCompletedPackageAttendances,
    calculateGenderPercentages
} = require('./calculations')
const { extractAttendances, extractStaffs, extractMembers, extractMemberNotes } = require('./extracts')
const { 
    joinStaffsWithAttendances, 
    joinMembersWithAttendances, 
    joinPackages, 
    joinMonths, 
    joinRegistrationsByAttendance,
    joinStaffRegistrationsByRegistrations,
    joinOfflineMembersIdsByOnlineMembers,
    joinOfflineRegistrationsByOnlineMembers,
    joinOfflineRegistrationsIdsByOnlineRegistrations,
    joinOfflineAttendancesByOnlineMembers,
    joinOfflineAttendancesByOnlineRegistrations,
    joinOfflineCancelledRegistrationsByOnlineMembers,
    joinOfflineCancelledAttendancesByOnlineMembers,
    joinOfflineCancelledAttendancesByOnlineRegistrations,
    joinOfflineFreezedRegistrationsByOnlineMembers,
    joinOfflineFreezedRegistrationsByOnlineRegistrations,
    joinRegistrationsByPackages
} = require('./joins')
const { isUUIDValid } = require('./validateUUID')
const { statsQueryGenerator, growthDatePicker } = require('./queryGenerator')
const { distinctValues } = require('./distincts')
const { calculateTotalPaymentsByType, calculateTotalPayments } = require('./payments')

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
    joinMonths,
    joinRegistrationsByAttendance,
    joinStaffRegistrationsByRegistrations,
    joinOfflineMembersIdsByOnlineMembers,
    joinOfflineRegistrationsByOnlineMembers,
    joinOfflineRegistrationsIdsByOnlineRegistrations,
    joinOfflineAttendancesByOnlineMembers,
    joinOfflineAttendancesByOnlineRegistrations,
    joinOfflineCancelledRegistrationsByOnlineMembers,
    joinOfflineCancelledAttendancesByOnlineMembers,
    joinOfflineCancelledAttendancesByOnlineRegistrations,
    joinOfflineFreezedRegistrationsByOnlineMembers,
    joinOfflineFreezedRegistrationsByOnlineRegistrations,
    joinRegistrationsByPackages,
    isWhatsappLanguageValid,
    isDateValid,
    calculateRegistrationsTotalEarnings,
    calculateTotalAttendanceByDate,
    calculatePackagePercentage,
    calculateCompletedPackageAttendances,
    calculateGenderPercentages,
    extractAttendances,
    extractStaffs,
    extractMembers,
    extractMemberNotes,
    statsQueryGenerator,
    growthDatePicker,
    joinPackages,
    distinctValues,
    calculateTotalPaymentsByType,
    calculateTotalPayments
}