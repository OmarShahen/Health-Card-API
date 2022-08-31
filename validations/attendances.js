const validator = require('../utils/utils')


const attendanceData = (attendanceData) => {

    const { registrationId, staffId } = attendanceData

    if(!registrationId) return { isAccepted: false, message: 'registration Id is required', field: 'registrationId' }

    if(!validator.isObjectId(registrationId)) return { isAccepted: false, message: 'invalid registration Id formate', field: 'registrationId' }

    if(!staffId) return { isAccepted: false, message: 'staff Id is required', field: 'staffId' }

    if(!validator.isObjectId(staffId)) return { isAccepted: false, message: 'invalid staff Id formate', field: 'staffId' }


    return { isAccepted: true, message: 'data is valid', data: attendanceData }

}

module.exports = { attendanceData }