const utils = require('../utils/utils')

const addArrivalMethod = (arrivalMethodData) => {

    const { name } = arrivalMethodData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    
    return { isAccepted: true, message: 'data is valid', data: arrivalMethodData }

}

const updateArrivalMethod = (arrivalMethodData) => {

    const { name } = arrivalMethodData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    
    return { isAccepted: true, message: 'data is valid', data: arrivalMethodData }

}

module.exports = { addArrivalMethod, updateArrivalMethod }