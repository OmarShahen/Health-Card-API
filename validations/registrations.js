const validator = require('../utils/utils')


const registrationData = (registrationData) => {

    const { clubId, memberId, staffId, packageId, paid } = registrationData

    if(!clubId) return { isAccepted: false, message: 'club Id is required', field: 'clubId' }

    if(!validator.isObjectId(clubId)) return { isAccepted: false, message: 'invalid club Id formate', field: 'clubId' }

    if(!memberId) return { isAccepted: false, message: 'member Id is required', field: 'memberId' }

    if(!validator.isObjectId(memberId)) return { isAccepted: false, message: 'invalid member Id formate', field: 'memberId' }

    if(!staffId) return { isAccepted: false, message: 'staff Id is required', field: 'staffId' }

    if(!validator.isObjectId(staffId)) return { isAccepted: false, message: 'invalid staff Id formate', field: 'staffId' }

    if(!packageId) return { isAccepted: false, message: 'package Id is required', field: 'packageId' }

    if(!validator.isObjectId(packageId)) return { isAccepted: false, message: 'invalid package Id formate', field: 'packageId' }

    if(!paid) return { isAccepted: false, message: 'price is required', field: 'paid' }

    if(!Number.parseFloat(paid)) return { isAccepted: false, message: 'price must be a number', field: 'paid' }


    return { isAccepted: true, message: 'data is valid', data: registrationData }

}


module.exports = { registrationData } 