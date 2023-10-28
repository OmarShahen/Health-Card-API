const config = require('../../config/config')


const addMedicationChallenge = (medicationChallengeData) => {

    const { name, description, category } = medicationChallengeData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    if(!description) return { isAccepted: false, message: 'Description is required', field: 'description' }

    if(typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(!category) return { isAccepted: false, message: 'Category is required', field: 'category' }
    
    if(!config.MEDICATION_CHALLENGES_CATEGORY.includes(category)) return { isAccepted: false, message: 'category format is invalid', field: 'category' }

    return { isAccepted: true, message: 'data is valid', data: medicationChallengeData }

}


const updateMedicationChallenge = (medicationChallengeData) => {

    const { name, description, category } = medicationChallengeData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Name format is invalid', field: 'name' }

    if(!description) return { isAccepted: false, message: 'Description is required', field: 'description' }

    if(typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(!category) return { isAccepted: false, message: 'Category is required', field: 'category' }
    
    if(!config.MEDICATION_CHALLENGES_CATEGORY.includes(category)) return { isAccepted: false, message: 'category format is invalid', field: 'category' }

    return { isAccepted: true, message: 'data is valid', data: medicationChallengeData }

}

module.exports = { addMedicationChallenge, updateMedicationChallenge }