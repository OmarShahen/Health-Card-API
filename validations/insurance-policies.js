const utils = require('../utils/utils')
const config = require('../config/config')

const addInsurancePolicy = (insurancePolicyData) => {

    const { insuranceCompanyId, clinicId, cardId, type, coveragePercentage, status, startDate, endDate } = insurancePolicyData

    if(!insuranceCompanyId) return { isAccepted: false, message: 'Insurance company ID is required', field: 'insuranceCompanyId' }

    if(!utils.isObjectId(insuranceCompanyId)) return { isAccepted: false, message: 'Insurance company ID format is invalid', field: 'insuranceCompanyId' }

    if(!clinicId) return { isAccepted: false, message: 'Clinic ID is required', field: 'clinicId' }

    if(!utils.isObjectId(clinicId)) return { isAccepted: false, message: 'Clinic ID format is invalid', field: 'clinicId' }

    if(!cardId) return { isAccepted: false, message: 'Card ID is required', field: 'cardId' }

    if(typeof cardId != 'number') return { isAccepted: false, message: 'Card ID format is invalid', field: 'cardId' }

    if(!type) return { isAccepted: false, message: 'Type is required', field: 'type' }

    if(!config.INSURANCE_POLICY_TYPE.includes(type)) return { isAccepted: false, message: 'Invalid type value', field: 'type' }

    if(!status) return { isAccepted: false, message: 'Status is required', field: 'status' }

    if(!config.INSURANCE_POLICY_STATUS.includes(status)) return { isAccepted: false, message: 'Invalid status value', field: 'status' }

    if(!coveragePercentage) return { isAccepted: false, message: 'Coverage percentage is required', field: 'coveragePercentage' }

    if(typeof coveragePercentage != 'number') return { isAccepted: false, message: 'Coverage percentage format is invalid', field: 'coveragePercentage' }
    
    if(coveragePercentage > 100) return { isAccepted: false, message: 'Coverage percentage must be less than 100', field: 'coveragePercentage' }

    if(!startDate) return { isAccepted: false, message: 'Start date is required', field: 'startDate' }

    if(!utils.isDateValid(startDate)) return { isAccepted: false, message: 'Start date format is invalid', field: 'startDate' }

    if(!endDate) return { isAccepted: false, message: 'End date is required', field: 'endDate' }

    if(!utils.isDateValid(endDate)) return { isAccepted: false, message: 'End date format is invalid', field: 'endDate' }

    if(new Date(startDate) >= new Date(endDate)) return { isAccepted: false, message: 'Start date cannot pass end date', field: 'endDate' }

    if(new Date(endDate) < new Date()) return { isAccepted: false, message: 'End date has already passed', field: 'enddate' }

    return { isAccepted: true, message: 'data is valid', data: insurancePolicyData }
}

const updateInsurancePolicy = (insurancePolicyData) => {

    const { type, coveragePercentage, startDate, endDate } = insurancePolicyData

    
    if(!type) return { isAccepted: false, message: 'Type is required', field: 'type' }

    if(!config.INSURANCE_POLICY_TYPE.includes(type)) return { isAccepted: false, message: 'Invalid type value', field: 'type' }

    if(!coveragePercentage) return { isAccepted: false, message: 'Coverage percentage is required', field: 'coveragePercentage' }

    if(typeof coveragePercentage != 'number') return { isAccepted: false, message: 'Coverage percentage format is invalid', field: 'coveragePercentage' }
    
    if(coveragePercentage > 100) return { isAccepted: false, message: 'Coverage percentage must be less than 100', field: 'coveragePercentage' }

    if(!startDate) return { isAccepted: false, message: 'Start date is required', field: 'startDate' }

    if(!utils.isDateValid(startDate)) return { isAccepted: false, message: 'Start date format is invalid', field: 'startDate' }

    if(!endDate) return { isAccepted: false, message: 'End date is required', field: 'endDate' }

    if(!utils.isDateValid(endDate)) return { isAccepted: false, message: 'End date format is invalid', field: 'endDate' }

    if(new Date(startDate) >= new Date(endDate)) return { isAccepted: false, message: 'Start date cannot pass end date', field: 'endDate' }

    if(new Date(endDate) < new Date()) return { isAccepted: false, message: 'End date has already passed', field: 'enddate' }

    return { isAccepted: true, message: 'data is valid', data: insurancePolicyData }
}

const updateInsurancePolicyStatus = (insurancePolicyData) => {

    const { status } = insurancePolicyData

    if(!status) return { isAccepted: false, message: 'Status is required', field: 'status' }

    if(!config.INSURANCE_POLICY_STATUS.includes(status)) return { isAccepted: false, message: 'Invalid status value', field: 'status' }
    

    return { isAccepted: true, message: 'data is valid', data: insurancePolicyData }
}

module.exports = { addInsurancePolicy, updateInsurancePolicyStatus, updateInsurancePolicy }