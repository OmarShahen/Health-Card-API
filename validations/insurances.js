const utils = require('../utils/utils')

const addInsurance = (insuranceData) => {

    const { name, clinicId, startDate, endDate } = insuranceData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name format', field: 'name' }

    if(!clinicId) return { isAccepted: false, message: 'Clinic ID is required', field: 'clinicId' }

    if(!utils.isObjectId(clinicId)) return { isAccepted: false, message: 'Invalid clinic ID format', field: 'clinicId' }

    if(!startDate) return { isAccepted: false, message: 'Start date is required', field: 'startDate' }

    if(!utils.isDateValid(startDate)) return { isAccepted: false, message: 'Start date format is invalid', field: 'startDate' }

    if(!endDate) return { isAccepted: false, message: 'End date is required', field: 'endDate' }

    if(!utils.isDateValid(endDate)) return { isAccepted: false, message: 'End date format is invalid', field: 'endDate' }

    if(new Date(startDate) >= new Date(endDate)) return { isAccepted: false, message: 'Start date cannot pass end date', field: 'endDate' }

    if(new Date(endDate) < new Date()) return { isAccepted: false, message: 'End date has already passed', field: 'enddate' }


    return { isAccepted: true, message: 'data is valid', data: insuranceData }
}

const updateInsurance = (insuranceData) => {

    const { name, startDate, endDate } = insuranceData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name format', field: 'name' }

    if(!startDate) return { isAccepted: false, message: 'Start date is required', field: 'startDate' }

    if(!utils.isDateValid(startDate)) return { isAccepted: false, message: 'Start date format is invalid', field: 'startDate' }

    if(!endDate) return { isAccepted: false, message: 'End date is required', field: 'endDate' }

    if(!utils.isDateValid(endDate)) return { isAccepted: false, message: 'End date format is invalid', field: 'endDate' }

    if(new Date(startDate) >= new Date(endDate)) return { isAccepted: false, message: 'Start date cannot pass end date', field: 'endDate' }

    if(new Date(endDate) < new Date()) return { isAccepted: false, message: 'End date has already passed', field: 'enddate' }


    return { isAccepted: true, message: 'data is valid', data: insuranceData }

}

const updateInsuranceStatus = (insuranceData) => {

    const { isActive } = insuranceData
    
    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'invalid status format', field: 'isActive' }

    return { isAccepted: true, message: 'data is valid', data: insuranceData }

}

module.exports = { addInsurance, updateInsurance, updateInsuranceStatus }