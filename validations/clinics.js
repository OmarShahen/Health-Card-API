const utils = require('../utils/utils')

const checkSpecialities = (specialities) => {

    for(let i=0;i<specialities.length;i++) {
        if(!utils.isObjectId(specialities[i])) {
            return false
        }
    }

    return true
}

const checkAddress = (addressData) => {
    
    const { buildingName, apartmentNumber, floor, street, additionalDirections } = addressData

    if(!buildingName) return { isAccepted: false, message: 'Building name is required', field: 'address.buildingName' }

    if(typeof buildingName != 'string') return { isAccepted: false, message: 'Building name format is invalid', field: 'address.buildingName' }

    if(!apartmentNumber) return { isAccepted: false, message: 'Apartment number is required', field: 'address.apartmentNumber' }

    if(typeof apartmentNumber != 'string') return { isAccepted: false, message: 'Apartment number format is invalid', field: 'address.apartmentNumber' }

    if(!floor) return { isAccepted: false, message: 'Floor is required', field: 'address.floor' }

    if(typeof floor != 'string') return { isAccepted: false, message: 'Floor format is invalid', field: 'address.floor' }

    if(!street) return { isAccepted: false, message: 'Street is required', field: 'address.street' }

    if(typeof street != 'string') return { isAccepted: false, message: 'Street format is invalid', field: 'address.street' }

    if(additionalDirections && typeof additionalDirections != 'string') return { isAccepted: false, message: 'Additional directions format is invalid', field: 'address.additionalDirections' }

    return { isAccepted: true, message: 'data is valid', data: addressData }
}

const addClinic = (clinicData) => {

    const { name, ownerId, speciality, city, country } = clinicData

    if(!ownerId) return { isAccepted: false, message: 'owner Id is required', field: 'ownerId' }

    if(!utils.isObjectId(ownerId)) return { isAccepted: false, message: 'owner Id is invalid', field: 'ownerId' }

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name formate', field: 'name' }

    if(!speciality) return { isAccepted: false, message: 'Speciality is required', field: 'speciality' }

    if(!Array.isArray(speciality)) return { isAccepted: false, message: 'Speciality must be a list', field: 'speciality' }    

    if(!checkSpecialities(speciality)) return { isAccepted: false, message: 'Speciality values is invalid', field: 'speciality' }
    
    if(!city) return { isAccepted: false, message: 'City is required', field: 'city' }

    if(typeof city != 'string') return { isAccepted: false, message: 'City formate is invalid', field: 'city' }

    if(!country) return { isAccepted: false, message: 'Country is required', field: 'country' }

    if(typeof country != 'string') return { isAccepted: false, message: 'Country formate is invalid', field: 'country' }

    
    return { isAccepted: true, message: 'data is valid', data: clinicData }

}

const updateClinic = (clinicData) => {

    const { name, speciality, city, country } = clinicData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name formate', field: 'name' }

    if(!speciality) return { isAccepted: false, message: 'Speciality is required', field: 'speciality' }

    if(!Array.isArray(speciality)) return { isAccepted: false, message: 'Speciality must be a list', field: 'speciality' }    

    if(!checkSpecialities(speciality)) return { isAccepted: false, message: 'Speciality values is invalid', field: 'speciality' }
    
    if(!city) return { isAccepted: false, message: 'City is required', field: 'city' }

    if(typeof city != 'string') return { isAccepted: false, message: 'City formate is invalid', field: 'city' }

    if(!country) return { isAccepted: false, message: 'Country is required', field: 'country' }

    if(typeof country != 'string') return { isAccepted: false, message: 'Country formate is invalid', field: 'country' }

    
    return { isAccepted: true, message: 'data is valid', data: clinicData }

}

module.exports = { addClinic, updateClinic }