const PatientModel = require('../models/PatientModel')
const UserModel = require('../models/UserModel')
const CounterModel = require('../models/CounterModel')
const EncounterModel = require('../models/EncounterModel')
const patientValidation = require('../validations/patients')
const ClinicPatientDoctorModel = require('../models/ClinicPatientDoctorModel')
const ClinicPatientModel = require('../models/ClinicPatientModel')
const mongoose = require('mongoose')
const ClinicDoctorModel = require('../models/ClinicDoctorModel')
const ClinicModel = require('../models/ClinicModel')
const utils = require('../utils/utils')
const CardModel = require('../models/CardModel')
const translations = require('../i18n/index')

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

        const { cardId, cvc, clinicId, doctorId, countryCode, phone } = request.body

        const card = await PatientModel.find({ cardId })
        if(card.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Card ID is already used'],
                field: 'cardId'
            })
        }

        if(clinicId) {
            const clinic = await ClinicModel.findById(clinicId)
            if(!clinic) {
                return response.status(400).json({
                    accepted: false,
                    message: 'clinic Id is not registered',
                    field: 'clinicId'
                })
            }
        }

        if(doctorId) {
            const doctor = await UserModel.findById(doctorId)
            if(!doctor) {
                return response.status(400).json({
                    accepted: false,
                    message: 'doctor Id is not registered',
                    field: 'doctorId'
                })
            }
        }


        const phoneList = await PatientModel.find({ countryCode, phone })
        if(phoneList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Phone number is already registered'],
                field: 'phone'
            })
        }

        const patientData = { ...request.body }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'patient' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        patientData.patientId = counter.value
        const patientObj = new PatientModel(patientData)
        const newPatient = await patientObj.save()

        let newClinicPatient
        let newClinicPatientDoctor

        if(clinicId && doctorId) {

            const clinicPatientDoctorData = { patientId: newPatient._id, clinicId, doctorId }
            const clinicPatientDoctorObj = new ClinicPatientDoctorModel(clinicPatientDoctorData)
            newClinicPatientDoctor = await clinicPatientDoctorObj.save()

            const clinicPatientData = { patientId: newPatient._id, clinicId }
            const clinicPatientObj = new ClinicPatientModel(clinicPatientData)
            newClinicPatient = await clinicPatientObj.save()

        } else if(clinicId) {
            const clinicPatientData = { patientId: newPatient._id, clinicId }
            const clinicPatientObj = new ClinicPatientModel(clinicPatientData)
            newClinicPatient = await clinicPatientObj.save()
        }

        const cardData = { cardId, cvc }
        const cardObj = new CardModel(cardData)
        const newCard = await cardObj.save()

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added patient successfully!'],
            patient: newPatient,
            card: newCard,
            clinicPatient: newClinicPatient,
            clinicPatientDoctor: newClinicPatientDoctor
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

const getPatientByCardId = async (request, response) => {

    try {

        const { cardId } = request.params

        if(isNaN(Number.parseInt(cardId))) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid card ID format',
                field: 'cardId'
            })
        }

        const cardList = await CardModel.find({ cardId })
        if(cardList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'card ID is not registered',
                field: 'cardId'
            })
        }

        const card = cardList[0]
        if(!card.isActive) {
            return response.status(400).json({
                accepted: false,
                message: 'Card is deactivated',
                field: 'cardId'
            })
        }

        const patientList = await PatientModel.find({ cardId })
        const patient = patientList[0] || null

        return response.status(200).json({
            accepted: true,
            patient: patient
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
                message: translations[request.query.lang]['Doctor is already registered with the patient'],
                field: 'doctorId'
            })
        }

        const additionData = { doctorId, createdAt: new Date(), updatedAt: new Date() }

        const updatedPatient = await PatientModel
        .findByIdAndUpdate(patient._id, { $push: { doctors: additionData } }, { new: true })

        updatedPatient.password = undefined

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Doctor is added successfully to the patient'],
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

const getPatientsByClinicId = async (request, response) => {

    try {

        const { clinicId } = request.params

        const { searchQuery } = utils.statsQueryGenerator('clinicId', clinicId, request.query)

        const patients = await ClinicPatientModel.aggregate([
            {
                $match: searchQuery
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
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    patient: 1,
                    createdAt: 1
                }
            }
        ])

        patients.forEach(patient => {
            patient.patient = patient.patient[0]
            patient.patient.emergencyContacts = undefined
            patient.patient.healthHistory = undefined
        })

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

const getPatientsByDoctorId = async (request, response) => {

    try {

        const { userId } = request.params

        const { searchQuery } = utils.statsQueryGenerator('doctorId', userId, request.query)

        const patients = await ClinicPatientDoctorModel.aggregate([
            {
                $match: searchQuery
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
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    'patient.healthHistory': 0,
                    'patient.emergencyContacts': 0
                }
            }
        ])

        patients.forEach(patient => {
            patient.patient = patient.patient[0]
            patient.clinic = patient.clinic[0]
        })

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

const getDoctorsByPatientId = async (request, response) => {

    try {

        const { patientId } = request.params

        const doctorsList = await ClinicPatientDoctorModel.find({ patientId })

        const doctorsIdsList = doctorsList.map(doctor => doctor.doctorId)
        const doctorsIdsSet = new Set(doctorsIdsList)
        const doctorsIds = [...doctorsIdsSet]

        const doctors = await UserModel.aggregate([
            {
                $match: { _id: { $in: doctorsIds } }
            },
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'speciality',
                    foreignField: '_id',
                    as: 'specialities'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    password: 0,
                    resetPassword: 0,
                    deleteAccount: 0
                }
            }
        ])

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
                message: translations[request.query.lang]['Contact phone is the same as patient phone'],
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
                message: translations[request.query.lang]['Contact phone is already registered in patient contacts'],
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
            message: translations[request.query.lang]['Added emergency contact successfully!'],
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
            message: translations[request.query.lang]['Deleted emergency contact successfully!'],
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
                message: translations[request.query.lang]['Contact phone is the same as patient phone'],
                field: 'phone'
            })
        }

        if(patientContacts.includes(newPhone)) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Contact phone is already registered in patient contacts'],
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
            message: translations[request.query.lang]['Updated patient contact successfully!'],
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
                message: translations[request.query.lang]['Doctor is not registered with the patient'],
                field: 'doctorId'
            })
        }

        const updatedDoctorList = doctors.filter(doctor => doctor.doctorId != doctorId)

        const updatedPatient = await PatientModel
        .findByIdAndUpdate(patientId, { doctors: updatedDoctorList }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Removed patient successfully!'],
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
    getPatientInfo, 
    getPatient, 
    getPatientByCardId, 
    addDoctorToPatient,
    getPatientsByClinicId,
    getPatientsByDoctorId,
    getDoctorsByPatientId,
    deleteEmergencyContactOfPatient,
    updateEmergencyContactOfPatient,
    deleteDoctorFromPatient
}