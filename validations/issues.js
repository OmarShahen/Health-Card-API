const utils = require('../utils/utils')


const addIssue = (issueData) => {

    const { name, specialityId } = issueData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' } 

    if(!specialityId) return { isAccepted: false, message: 'Speciality ID is required', field: 'specialityId' }

    if(!utils.isObjectId(specialityId)) return { isAccepted: false, message: 'Speciality Id format is invalid', field: 'specialityId' }

    return { isAccepted: true, message: 'data is valid', data: issueData }
}

const updateIssue = (issueData) => {

    const { name } = issueData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' } 

    return { isAccepted: true, message: 'data is valid', data: issueData }
}

module.exports = { addIssue, updateIssue }