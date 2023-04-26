const utils = require('../utils/utils')
const config = require('../config/config')

const medicineValidation  = (medicine) => {

    const { name, frequency, duration, dosage, instructions } = medicine

    if(!name) return { isAccepted: false, message: 'Medicine name is required', field: 'medicine.name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Medicine name must be a string', field: 'medicine.name' }

    //if(!dosage) return { isAccepted: false, message: 'Medicine dosage is required', field: 'medicine.dosage' }

    if(dosage && typeof dosage.amount != 'number') return { isAccepted: false, message: 'Dosage amount must be a number', field: 'medicine.dosage.amount' }

    if(dosage && typeof dosage.unit != 'string') return { isAccepted: false, message: 'Dosage unit must be a string', field: 'medicine.dosage.unit' }

    //if(dosage && !config.DOSGAE_TYPES.includes(dosage.unit)) return { isAccepted: false, message: 'Dosage type is not registered', field: 'medicine.dosage.unit' }

    //if(!frequency) return { isAccepted: false, message: 'Medicine frequency is required', field: 'medicine.frequency' }

    if(frequency && typeof frequency.number != 'number') return { isAccepted: false, message: 'Frequency number must be a number', field: 'medicine.frequency.number' }

    if(frequency && typeof frequency.timeUnit != 'string') return { isAccepted: false, message: 'Frequency time unit must be a string', field: 'medicine.frequency.timeUnit' }

    //if(frequency && !config.TIME_UNIT.includes(frequency.timeUnit)) return { isAccepted: false, message: 'Frequency time unit is not registered', field: 'medicine.frequency.timeUnit' }

    //if(!duration) return { isAccepted: false, message: 'Medicine duration is required', field: 'medicine.duration' }

    if(duration && typeof duration.number != 'number') return { isAccepted: false, message: 'Duration number must be a number', field: 'medicine.duration.number' }

    if(duration && typeof duration.timeUnit != 'string') return { isAccepted: false, message: 'Duration time unit must be a string', field: 'medicine.duration.timeUnit' }

    //if(duration && !config.TIME_UNIT.includes(duration.timeUnit)) return { isAccepted: false, message: 'Duration time unit is not registered', field: 'medicine.duration.timeUnit' }

    if(!Array.isArray(instructions)) return { isAccepted: false, message: 'Medicine instructions is required', field: 'medicine.instructions' }


    return { isAccepted: true, message: 'data is valid', data: medicine }

}

const addPrescription = (prescriptionData) => {

    const { doctorId, patientId, note, medicines } = prescriptionData

    if(!doctorId) return { isAccepted: false, message: 'Doctor Id is required', field: 'doctorId' }

    if(!utils.isObjectId(doctorId)) return { isAccepted: false, message: 'Invalid doctor Id formate', field: 'doctorId' }

    if(!patientId) return { isAccepted: false, message: 'Patient Id is required', field: 'patientId' }

    if(!utils.isObjectId(patientId)) return { isAccepted: false, message: 'Invalid patient Id formate', field: 'patientId' }

    if(note && typeof note != 'string') return { isAccepted: false, message: 'note must be a string', field: 'note' }

    if(!Array.isArray(medicines) || medicines.length == 0) return { isAccepted: false, message: 'Medicines must be a list', field: 'medicines' }

    for(let i=0;i<medicines.length;i++) {
        const dataValidation = medicineValidation(medicines[i])
        if(!dataValidation.isAccepted) return dataValidation
    }


    return { isAccepted: true, message: 'data is valid', data: prescriptionData }

}

const addPrescriptionByPatientCardId = (prescriptionData) => {

    const { doctorId, note, medicines } = prescriptionData

    if(!doctorId) return { isAccepted: false, message: 'Doctor Id is required', field: 'doctorId' }

    if(!utils.isObjectId(doctorId)) return { isAccepted: false, message: 'Invalid doctor Id formate', field: 'doctorId' }

    if(note && typeof note != 'string') return { isAccepted: false, message: 'note must be a string', field: 'note' }

    if(!Array.isArray(medicines) || medicines.length == 0) return { isAccepted: false, message: 'Medicines must be a list', field: 'medicines' }

    for(let i=0;i<medicines.length;i++) {
        const dataValidation = medicineValidation(medicines[i])
        if(!dataValidation.isAccepted) return dataValidation
    }


    return { isAccepted: true, message: 'data is valid', data: prescriptionData }

}


module.exports = { addPrescription, addPrescriptionByPatientCardId } 