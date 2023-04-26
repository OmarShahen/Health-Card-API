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
const { isDateValid, isBirthYearValid } = require('./validateDate')
const { 
    calculateRegistrationsTotalEarnings, 
    calculateTotalAttendanceByDate, 
    calculatePackagePercentage,
    calculateCompletedPackageAttendances,
    calculateGenderPercentages,
    calculateTotalByKey,
    calculateAndJoinStaffsPayments
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
    joinRegistrationsByPackages,
    formateRegistrationsToPayments,
    formateInstallmentsToPayments,
    joinStaffIdsWithStaffObjects
} = require('./joins')
const { isUUIDValid } = require('./validateUUID')
const { statsQueryGenerator, growthDatePicker } = require('./queryGenerator')
const { distinctValues, getUniqueIds, getUniqueSuppliersFromPayments } = require('./distincts')
const { calculateTotalPaymentsByType, calculateTotalPayments, calculateTotalAmountByType } = require('./payments')
const { isListUnique } = require('./unique')

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
    isBirthYearValid,
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
    calculateTotalPayments,
    formateRegistrationsToPayments,
    calculateTotalByKey,
    formateInstallmentsToPayments,
    calculateAndJoinStaffsPayments,
    getUniqueIds,
    joinStaffIdsWithStaffObjects,
    calculateTotalAmountByType,
    getUniqueSuppliersFromPayments,
    isListUnique
}