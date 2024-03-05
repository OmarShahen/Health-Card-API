const utils = require('../utils/utils')

const addService = (serviceData) => {

    const { expertId, title, description, price, duration } = serviceData

    if(!expertId) return { isAccepted: false, message: 'Expert ID is required', field: 'expertId' }

    if(!utils.isObjectId(expertId)) return { isAccepted: false, message: 'Expert ID format is invalid', field: 'expertId' }

    if(!title) return { isAccepted: false, message: 'Title is required', field: 'title' }

    if(typeof title!= 'string') return { isAccepted: false, message: 'Invalid title format', field: 'title' }

    if(!description) return { isAccepted: false, message: 'Description is required', field: 'description' }

    if(typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(typeof price != 'number') return { isAccepted: false, message: 'Price format is invalid', field: 'price' }

    if(!duration) return { isAccepted: false, message: 'Duration is required', field: 'duration' }

    if(typeof duration != 'number') return { isAccepted: false, message: 'Duration format is invalid', field: 'duration' }

    if(duration < 5) return { isAccepted: false, message: 'Duration minimum is 5 minutes', field: 'duration' }

    if(duration > 180) return { isAccepted: false, message: 'Duration maximum is 180 minutes', field: 'duration' }

    return { isAccepted: true, message: 'data is valid', data: serviceData }
} 

const updateService = (serviceData) => {

    const { title, description, price, duration } = serviceData

    if(!title) return { isAccepted: false, message: 'Title is required', field: 'title' }

    if(typeof title!= 'string') return { isAccepted: false, message: 'Invalid title format', field: 'title' }

    if(!description) return { isAccepted: false, message: 'Description is required', field: 'description' }

    if(typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(!price) return { isAccepted: false, message: 'Price is required', field: 'price' }

    if(typeof price != 'number') return { isAccepted: false, message: 'Price format is invalid', field: 'price' }

    if(!duration) return { isAccepted: false, message: 'Duration is required', field: 'duration' }

    if(typeof duration != 'number') return { isAccepted: false, message: 'Duration format is invalid', field: 'duration' }

    if(duration < 5) return { isAccepted: false, message: 'Duration minimum is 5 minutes', field: 'duration' }

    if(duration > 180) return { isAccepted: false, message: 'Duration maximum is 180 minutes', field: 'duration' }

    return { isAccepted: true, message: 'data is valid', data: serviceData }
} 

const updateServiceActivity = (serviceData) => {

    const { isActive } = serviceData

    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive format is invalid', field: 'isActive' }

    return { isAccepted: true, message: 'data is valid', data: serviceData }
} 


module.exports = { addService, updateService, updateServiceActivity }