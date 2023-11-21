const utils = require('../../utils/utils')

const addMessageTemplate = (messageTemplateData) => {

    const { name, categoryId, description } = messageTemplateData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }
    
    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }
    
    if(!description) return { isAccepted: false, message: 'Description is required', field: 'description' }
    
    if(typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }
    
    if(!categoryId) return { isAccepted: false, message: 'Category ID is required', field: 'categoryId' }
    
    if(!utils.isObjectId(categoryId)) return { isAccepted: false, message: 'Category ID format is invalid', field: 'categoryId' }
    

    return { isAccepted: true, message: 'data is valid', data: messageTemplateData }
}

const updateMessageTemplate = (messageTemplateData) => {

    const { name, description, categoryId } = messageTemplateData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }
    
    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }
    
    if(!description) return { isAccepted: false, message: 'Description is required', field: 'description' }
    
    if(typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }
    
    if(!categoryId) return { isAccepted: false, message: 'Category ID is required', field: 'categoryId' }
    
    if(!utils.isObjectId(categoryId)) return { isAccepted: false, message: 'Category ID format is invalid', field: 'categoryId' }
    

    return { isAccepted: true, message: 'data is valid', data: messageTemplateData }
}


module.exports = { addMessageTemplate, updateMessageTemplate }