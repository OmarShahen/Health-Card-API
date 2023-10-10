const utils = require('../../utils/utils')

const addLabel = (labelData) => {

    const { name } = labelData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    
    return { isAccepted: true, message: 'data is valid', data: labelData }

}

const updateLabel = (labelData) => {

    const { name } = labelData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    
    return { isAccepted: true, message: 'data is valid', data: labelData }

}

module.exports = { addLabel, updateLabel }