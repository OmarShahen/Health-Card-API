const config = require('../config/config')

const addValue = (valueData) => {

    const { value, entity } = valueData

    if(!value) return { isAccepted: false, message: 'Value is required', field: 'value' }

    if(typeof value != 'string') return { isAccepted: false, message: 'Invalid value format', field: 'value' }

    if(!entity) return { isAccepted: false, message: 'Entity is required', field: 'entity' }

    if(typeof entity != 'string') return { isAccepted: false, message: 'Invalid entity format', field: 'entity' }
    
    if(!config.VALUES_ENTITY.includes(entity)) return { isAccepted: false, message: 'This value is not registered', field: 'entity' }

    return { isAccepted: true, message: 'data is valid', data: valueData }

}

const updateValueValue = (valueData) => {

    const { value } = valueData

    if(!value) return { isAccepted: false, message: 'Value is required', field: 'value' }

    if(typeof value != 'string') return { isAccepted: false, message: 'Invalid value format', field: 'value' }
    
    return { isAccepted: true, message: 'data is valid', data: valueData }

}

module.exports = { addValue, updateValueValue }