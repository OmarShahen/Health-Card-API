const utils = require('../utils/utils')
const config = require('../config/config')

const addSpeciality = (specialData) => {

    const { name, description, type, mainSpecialityId } = specialData


    if(!name) return { isAccepted: false, message: 'name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name formate', field: 'name' }

    if(description && typeof description != 'string') return { isAccepted: false, message: 'Invalid description formate', field: 'description' }
    
    if(!type) return { isAccepted: false, message: 'Type is required', field: 'type' }

    if(!config.SPECIALITIES_TYPES.includes(type)) return { isAccepted: false, message: 'Invalid type value', field: 'type' }

    if(type === 'SUB' && !mainSpecialityId) return { isAccepted: false, message: 'main speciality is required', field: 'mainSpecialityId' }

    if(type === 'SUB' && !utils.isObjectId(mainSpecialityId)) return { isAccepted: false, message: 'main speciality format is invalid', field: 'mainSpecialityId' }

    return { isAccepted: true, message: 'data is valid', data: specialData }

}

const updateSpeciality = (specialData) => {

    const { name, description } = specialData

    if(!name) return { isAccepted: false, message: 'name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name formate', field: 'name' }

    if(description && !utils.isNameValid(description)) return { isAccepted: false, message: 'Invalid description formate', field: 'description' }
    

    return { isAccepted: true, message: 'data is valid', data: specialData }

}



module.exports = { addSpeciality, updateSpeciality }