const PatientModel = require('../models/PatientModel')
const UserModel = require('../models/UserModel')
const ClinicModel = require('../models/ClinicModel')
const EncounterModel = require('../models/EncounterModel')
const patientValidation = require('../validations/patients')
const mongoose = require('mongoose')
const utils = require('../utils/utils')


const addPatient = async (request, response) => {

    try {

        const dataValidation = patientValidation.addPatient(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { cardId, doctorId, countryCode, phone } = request.body

        const card = await PatientModel.find({ cardId })
        if(card.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'card Id is already used',
                field: 'cardId'
            })
        }


        const phoneList = await PatientModel.find({ countryCode, phone })
        if(phoneList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Phone number is already registered',
                field: 'phone'
            })
        }

        const patientData = { ...request.body }

        if(doctorId) {
            patientData.doctors = [{ doctorId, createdAt: new Date(), updatedAt: new Date() }]
        }

        const patientObj = new PatientModel(patientData)
        const newPatient = await patientObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Added patient successfully!',
            patient: newPatient
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getClinicPatients = async (request, response) => {

    try {

        const { clinicId } = request.params

        const patients = await PatientModel
        .find({ clinicId })
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            patients
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getPatientInfo = async (request, response) => {

    try {

        const { patientId } = request.params

        const patientPromise = PatientModel.findById(patientId)

        const encountersPromise = EncounterModel.aggregate([
            {
                $match: { patientId: mongoose.Types.ObjectId(patientId) }
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        const [patient, encounters] = await Promise.all([
            patientPromise,
            encountersPromise
        ])

        encounters.forEach(encounter => encounter.patient = encounter.patient[0])

        return response.status(200).json({
            accepted: true,
            patient,
            encounters
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getPatient = async (request, response) => {

    try {

        const { patientId } = request.params

        const patient = await PatientModel.findById(patientId)

        return response.status(200).json({
            accepted: true,
            patient
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getPatientByCardUUID = async (request, response) => {

    try {

        const { cardUUID } = request.params

        const patientList = await PatientModel.find({ cardUUID })
        const patient = patientList[0]

        return response.status(200).json({
            accepted: true,
            patient
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const addDoctorToPatient = async (request, response) => {

    try {

        const { cardId } = request.params
        const { doctorId } = request.body

        const dataValidation = patientValidation.addDoctorToPatient(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(500).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const doctor = await UserModel.findById(doctorId)
        if(!doctor) {
            return response.status(400).json({
                accepted: false,
                message: 'Doctor Id is not registered',
                field: 'doctorId'
            })
        }

        const patientList = await PatientModel.find({ cardId })

        if(patientList.length == 0) {
            return response.status(404).json({
                accepted: false,
                message: 'card Id is not registered',
                field: 'cardId'
            })
        }

        const patient = patientList[0]
        const patientDoctorsIds = patient.doctors.map(doctor => doctor.doctorId)
        if(patientDoctorsIds.includes(doctorId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Doctor is already registered with the patient',
                field: 'doctorId'
            })
        }

        const additionData = { doctorId, createdAt: new Date(), updatedAt: new Date() }

        const updatedPatient = await PatientModel
        .findByIdAndUpdate(patient._id, { $push: { doctors: additionData } }, { new: true })

        updatedPatient.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'Doctor is added successfully to the patient',
            updatedPatient
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getPatientsByDoctorId = async (request, response) => {

    try {

        const { userId } = request.params

        const patients = await PatientModel
        .find({ 'doctors.doctorId': userId })
        .sort({ 'doctors.createdAt': -1 })

        return response.status(200).json({
            accepted: true,
            patients
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getPatientDoctors = async (request, response) => {

    try {

        const { patientId } = request.params

        const patient = await PatientModel.findById(patientId)

        const doctorsId = patient.doctors.map(doctor => doctor.doctorId)

        const doctors = await UserModel
        .find({ _id: { $in: doctorsId }})
        .select({ password: 0 })

        return response.status(200).json({
            accepted: true,
            doctors
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const addEmergencyContactToPatient = async (request, response) => {

    try {

        const { patientId } = request.params

        const dataValidation = patientValidation.addEmergencyContactToPatient(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const patient = await PatientModel.findById(patientId)
        const { emergencyContacts, phone, countryCode } = patient

        const newContactPhone = `${request.body.countryCode}${request.body.phone}`
        const patientPhone = `${countryCode}${phone}`
        
        if(patientPhone == newContactPhone) {
            return response.status(400).json({
                accepted: false,
                message: 'contact phone is the same as patient phone',
                field: 'phone'
            })
        }

        const samePhones = emergencyContacts.filter(contact => {
            const registeredPhone = `${contact.countryCode}${contact.phone}`            
            if(newContactPhone == registeredPhone)
                return true
            return false
        })

        if(samePhones.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'contact phone is already registered',
                field: 'phone'
            })
        }

        const contactData = {
            name: request.body.name,
            relation: request.body.relation,
            countryCode: request.body.countryCode,
            phone: request.body.phone
        }

        const updatedPatient = await PatientModel
        .findByIdAndUpdate(patientId, { $push: { emergencyContacts: contactData } }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'added emergency contact successfully!',
            patient: updatedPatient
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteEmergencyContactOfPatient = async (request, response) => {

    try {

        const { patientId, countryCode, phone } = request.params

        const patient = await PatientModel.findById(patientId)

        const { emergencyContacts } = patient
        const targetContact = `${countryCode}${phone}`

        const updatedContactList = emergencyContacts.filter(contact => {
            const contactPhone = `${contact.countryCode}${contact.phone}`
            if(contactPhone == targetContact)
                return false
            return true 
        })

        const updatedPatient = await PatientModel
        .findByIdAndUpdate(patientId, { emergencyContacts: updatedContactList }, { new:true })

        return response.status(200).json({
            accepted: true,
            message: 'deleted emergency contact successfully!',
            patient: updatedPatient
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateEmergencyContactOfPatient = async (request, response) => {

    try {

        const { patientId, contactId } = request.params

        const dataValidation = patientValidation.updateEmergencyContactOfPatient(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const patient = await PatientModel.findById(patientId)
        const { emergencyContacts } = patient

        const targetContactList = emergencyContacts.filter(contact => contact._id.equals(contactId))
        if(targetContactList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'emergency contact does not exists',
                field: 'contactId'
            })
        }

        const { name, countryCode, phone, relation } = request.body

        const newPhone = `${countryCode}${phone}`
        const patientPhone = `${patient.countryCode}${patient.phone}`
        const withOutTargetContactList = emergencyContacts.map(contact => !contact._id.equals(contactId))
        const patientContacts = withOutTargetContactList.map(contact => `${contact.countryCode}${contact.phone}`)

        if(newPhone == patientPhone) {
            return response.status(200).json({
                accepted: false,
                message: 'contact phone is the same as patient phone',
                field: 'phone'
            })
        }

        if(patientContacts.includes(newPhone)) {
            return response.status(400).json({
                accepted: false,
                message: 'contact phone is already registered in patient contacts',
                field: 'phone'
            })
        }

        const newEmergencyContacts = emergencyContacts.map(contact => {
            if(contact._id.equals(contactId)) {
                return {
                    name,
                    countryCode,
                    phone,
                    relation
                }
            }

            return contact
        })

        const updatedPatient = await PatientModel
        .findByIdAndUpdate(patientId, { emergencyContacts: newEmergencyContacts }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'updated patient contact successfully',
            patient: updatedPatient
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteDoctorFromPatient = async (request, response) => {

    try {

        const { patientId, doctorId } = request.params

        const patient = await PatientModel
        .findById(patientId)
        .select({ doctors: 1 })

        const { doctors } = patient

        const targetDoctorList = doctors.filter(doctor => doctor.doctorId == doctorId)
        if(targetDoctorList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'doctor is not registered with the patient',
                field: 'doctorId'
            })
        }

        const updatedDoctorList = doctors.filter(doctor => doctor.doctorId != doctorId)

        const updatedPatient = await PatientModel
        .findByIdAndUpdate(patientId, { doctors: updatedDoctorList }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'removed patient successfully!',
            patient: updatedPatient
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}


module.exports = { 
    addPatient,
    addEmergencyContactToPatient,
    getClinicPatients, 
    getPatientInfo, 
    getPatient, 
    getPatientByCardUUID, 
    addDoctorToPatient,
    getPatientsByDoctorId,
    getPatientDoctors,
    deleteEmergencyContactOfPatient,
    updateEmergencyContactOfPatient,
    deleteDoctorFromPatient
}