const utils = require('../../utils/utils')

const addLead = (leadData) => {

    const { 
        name,
        countryCode,
        phone,
        gender,
        country,
        county,
        city,
        address,
        clinicName,
        clinicCountryCode,
        clinicPhone,
        specialityId,
        notes,
        labels,
        value,
        status,
        stage
    } = leadData

        if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

        if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }
 
        if(countryCode && typeof countryCode != 'number') return { isAccepted: false, message: 'Country code format is invalid', field: 'countryCode' }
 
        if(phone && typeof phone != 'number') return { isAccepted: false, message: 'Phone format is invalid', field: 'phone' }
 
        if(gender && !['MALE', 'FEMALE'].includes(gender)) return { isAccepted: false, message: 'Gender format is invalid', field: 'gender' }
 
        if(country && typeof country != 'string') return { isAccepted: false, message: 'Country format is invalid', field: 'country' }
 
        if(county && typeof county != 'string') return { isAccepted: false, message: 'County format is invalid', field: 'county' }

        if(city && typeof city != 'string') return { isAccepted: false, message: 'City format is invalid', field: 'city' }
 
        if(address && typeof address != 'string') return { isAccepted: false, message: 'Address format is invalid', field: 'address' }

        if(clinicName && typeof clinicName != 'string') return { isAccepted: false, message: 'Clinic name format is invalid', field: 'clinicName' }
         
        if(clinicCountryCode && typeof clinicCountryCode != 'number') return { isAccepted: false, message: 'Clinic country code format is invalid', field: 'clinicCountryCode' }
        
        if(clinicPhone && typeof clinicPhone != 'number') return { isAccepted: false, message: 'Clinic phone format is invalid', field: 'clinicPhone' }
        
        if(specialityId && !utils.isObjectId(specialityId)) return { isAccepted: false, message: 'Speciality ID format is invalid', field: 'specialityId' }
        
        if(notes && !Array.isArray(notes)) return { isAccepted: false, message: 'Notes format is invalid', field: 'notes' }
        
        if(labels && !Array.isArray(labels)) return { isAccepted: false, message: 'Labels format is invalid', field: 'labels' }
        
        if(value && typeof value != 'number') return { isAccepted: false, message: 'Value format is invalid', field: 'value' }
        
        if(stage && typeof stage != 'string') return { isAccepted: false, message: 'Stage format is invalid', field: 'stage' }
        
        if(status && typeof status != 'string') return { isAccepted: false, message: 'Status format is invalid', field: 'status' }


    return { isAccepted: true, message: 'data is valid', data: leadData }
}

const updateLead = (leadData) => {

    const { 
        name,
        countryCode,
        phone,
        gender,
        country,
        county,
        city,
        address,
        clinicName,
        clinicCountryCode,
        clinicPhone,
        specialityId,
        notes,
        labels,
        value,
        status,
        stage
    } = leadData


        if(name && typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }
 
        if(countryCode && typeof countryCode != 'number') return { isAccepted: false, message: 'Country code format is invalid', field: 'countryCode' }
 
        if(phone && typeof phone != 'number') return { isAccepted: false, message: 'Phone format is invalid', field: 'phone' }
 
        if(gender && !['MALE', 'FEMALE'].includes(gender)) return { isAccepted: false, message: 'Gender format is invalid', field: 'gender' }
 
        if(country && typeof country != 'string') return { isAccepted: false, message: 'Country format is invalid', field: 'country' }
 
        if(county && typeof county != 'string') return { isAccepted: false, message: 'County format is invalid', field: 'county' }

        if(city && typeof city != 'string') return { isAccepted: false, message: 'City format is invalid', field: 'city' }
 
        if(address && typeof address != 'string') return { isAccepted: false, message: 'Address format is invalid', field: 'address' }

        if(clinicName && typeof clinicName != 'string') return { isAccepted: false, message: 'Clinic name format is invalid', field: 'clinicName' }
         
        if(clinicCountryCode && typeof clinicCountryCode != 'number') return { isAccepted: false, message: 'Clinic country code format is invalid', field: 'clinicCountryCode' }
        
        if(clinicPhone && typeof clinicPhone != 'number') return { isAccepted: false, message: 'Clinic phone format is invalid', field: 'clinicPhone' }
        
        if(specialityId && !utils.isObjectId(specialityId)) return { isAccepted: false, message: 'Speciality ID format is invalid', field: 'specialityId' }
        
        if(notes && !Array.isArray(notes)) return { isAccepted: false, message: 'Notes format is invalid', field: 'notes' }
        
        if(labels && !Array.isArray(labels)) return { isAccepted: false, message: 'Labels format is invalid', field: 'labels' }
        
        if(value && typeof value != 'number') return { isAccepted: false, message: 'Value format is invalid', field: 'value' }
        
        if(stage && typeof stage != 'string') return { isAccepted: false, message: 'Stage format is invalid', field: 'stage' }
        
        if(status && typeof status != 'string') return { isAccepted: false, message: 'Status format is invalid', field: 'status' }


    return { isAccepted: true, message: 'data is valid', data: leadData }
}


module.exports = { addLead, updateLead }