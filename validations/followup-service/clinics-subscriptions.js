const utils = require('../../utils/utils')

const addClinicSubscription = (clinicSubscriptionData) => {

    const { clinicId, paid, isActive, startDate, endDate } = clinicSubscriptionData

    if(!clinicId) return { isAccepted: false, message: 'Clinic ID is required', field: 'clinicId' }

    if(!utils.isObjectId(clinicId)) return { isAccepted: false, message: 'Invalid clinic ID format', field: 'clinicId' }

    if(typeof paid != 'number') return { isAccepted: false, message: 'Paid is required', field: 'paid' }
    
    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive is required', field: 'isActive' }

    if(!startDate) return { isAccepted: false, message: 'Start date is required', field: 'startDate' }

    if(!utils.isDateValid(startDate)) return { isAccepted: false, message: 'Start date format is invalid', field: 'startDate' }

    if(!endDate) return { isAccepted: false, message: 'End date is required', field: 'endDate' }

    if(!utils.isDateValid(endDate)) return { isAccepted: false, message: 'End date format is invalid', field: 'endDate' }

    if(new Date(startDate) >= new Date(endDate)) return { isAccepted: false, message: 'Start date cannot pass end date', field: 'endDate' }

    if(new Date(endDate) < new Date()) return { isAccepted: false, message: 'End date has already passed', field: 'enddate' }


    return { isAccepted: true, message: 'data is valid', data: clinicSubscriptionData }
}


module.exports = { addClinicSubscription }