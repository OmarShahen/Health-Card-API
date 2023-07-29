const encounterValidation = require('../validations/encounters')
const EncounterModel = require('../models/EncounterModel')
const PrescriptionModel = require('../models/PrescriptionModel')
const UserModel = require('../models/UserModel')
const PatientModel = require('../models/PatientModel')
const CounterModel = require('../models/CounterModel')
const ClinicPatientDoctorModel = require('../models/ClinicPatientDoctorModel')
const ClinicModel = require('../models/ClinicModel')
const mongoose = require('mongoose')
const utils = require('../utils/utils')
const translations = require('../i18n/index')


const addEncounter = async (request, response) => {

    try {

        const dataValidation = encounterValidation.addEncounter(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { doctorId, patientId, symptoms, diagnosis, notes, medicines } = request.body

        const doctorPromise = UserModel.findById(doctorId)
        const patientPromise = PatientModel.findById(patientId)

        const [doctor, patient] = await Promise.all([
            doctorPromise,
            patientPromise
        ])

        if(!doctor || !doctor.roles.includes('DOCTOR')) {
            return response.status(400).json({
                accepted: false,
                message: 'Doctor Id does not exist',
                field: 'doctorId'
            })
        }

        if(!patient) {
            return response.status(400).json({
                accepted: false,
                message: 'Patient Id does not exist',
                field: 'patientId'
            })
        }

        const doctorPatientAccessList = await DoctorPatientAccessModel.find({ doctorId, patientId })

        if(doctorPatientAccessList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'no access to this patient',
                field: 'patientId'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'encounter' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        let encounterData = {
            encounterId: counter.value,
            doctorId,
            patientId,
            symptoms,
            diagnosis,
            notes,
        }

        let newPrescription

        if(medicines && medicines.length != 0) {
            const counter = await CounterModel.findOneAndUpdate(
                { name: 'prescription' },
                { $inc: { value: 1 } },
                { new: true, upsert: true }
            )
            let prescriptionData = { prescriptionId: counter.value, doctorId, patientId, medicines }
            const prescriptionObj = new PrescriptionModel(prescriptionData)
            newPrescription = await prescriptionObj.save()
        }

        const encounterObj = new EncounterModel(encounterData)
        const newEncounter = await encounterObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Encounter added successfully!',
            encounter: newEncounter,
            prescription: newPrescription,
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

const addEncounterByPatientCardId = async (request, response) => {

    try {

        const dataValidation = encounterValidation.addEncounterByPatientCardId(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { cardId } = request.params
        const { doctorId, clinicId, symptoms, diagnosis, registrationDate, notes, medicines } = request.body

        const doctorPromise = UserModel.findById(doctorId)
        const patientPromise = PatientModel.find({ cardId })
        const clinicPromise = ClinicModel.findById(clinicId)

        const [doctor, patientList, clinic] = await Promise.all([
            doctorPromise,
            patientPromise,
            clinicPromise
        ])

        if(!doctor || !doctor.roles.includes('DOCTOR')) {
            return response.status(400).json({
                accepted: false,
                message: 'Doctor Id does not exist',
                field: 'doctorId'
            })
        }

        if(patientList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Patient card Id does not exists',
                field: 'cardId'
            })
        }

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exists',
                field: 'clinicId'
            })
        }

        const patient = patientList[0]
        const doctorPatientAccessList = await ClinicPatientDoctorModel.find({ doctorId, patientId: patient._id, clinicId: clinic._id })

        if(doctorPatientAccessList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Doctor does not have access to the patient'],
                field: 'patientId'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'encounter' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        let encounterData = {
            encounterId: counter.value,
            clinicId,
            patientId: patient._id,
            doctorId,
            symptoms,
            diagnosis,
            notes,
            createdAt: registrationDate
        }

        let newPrescription

        if(medicines && medicines.length != 0) {
            const counter = await CounterModel.findOneAndUpdate(
                { name: 'prescription' },
                { $inc: { value: 1 } },
                { new: true, upsert: true }
            )
            let prescriptionData = { 
                prescriptionId: counter.value,
                clinicId,
                doctorId, 
                patientId: patient._id, 
                medicines 
            }
            const prescriptionObj = new PrescriptionModel(prescriptionData)
            newPrescription = await prescriptionObj.save()
        }


        const encounterObj = new EncounterModel(encounterData)
        const newEncounter = await encounterObj.save()

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Encounter added successfully!'],
            encounter: newEncounter,
            prescription: newPrescription,
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

const deleteEncounter = async (request, response) => {

    try {

        const { encounterId } = request.params

        const deletedEncounter = await EncounterModel.findByIdAndDelete(encounterId)

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Encounter deleted successfully!'],
            encounter: deletedEncounter
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

const getPatientEncounters = async (request, response) => {

    try {

        const { patientId } = request.params
        let { query } = request.query

        query = query ? query : ''

        const { searchQuery } = utils.statsQueryGenerator('patientId', patientId, request.query)

        const encounters = await EncounterModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctor'
                }
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
                $match: {
                    $or: [
                        { 'doctor.firstName': { $regex: query, $options: 'i' } },
                        { 'doctor.lastName': { $regex: query, $options: 'i' } },
                        { 'doctor.email': { $regex: query, $options: 'i' } },
                    ]
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    'doctor.password': 0,
                    'patient.healthHistory': 0,
                    'patient.emergencyContacts': 0
                }
            }
        ])
        
        encounters.forEach(encounter => {
            encounter.doctor = encounter.doctor[0]
            encounter.patient = encounter.patient[0]
            encounter.clinic = encounter.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
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

const getDoctorEncounters = async (request, response) => {

    try {

        const { userId } = request.params
        let { query } = request.query

        query = query ? query : ''

        const { searchQuery } = utils.statsQueryGenerator('doctorId', userId, request.query)

        const encounters = await EncounterModel.aggregate([
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
                $lookup: {
                    from: 'users',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            {
                $match: {
                    $or: [
                        { 'patient.firstName': { $regex: query, $options: 'i' } },
                        { 'patient.lastName': { $regex: query, $options: 'i' } },
                        { 'patient.phone': { $regex: query, $options: 'i' } },
                        { 'patient.cardId': { $regex: query, $options: 'i' } },
                    ]
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    'doctor.password': 0,
                    'patient.healthHistory': 0,
                    'patient.emergencyContacts': 0
                }
            }
        ])

        encounters.forEach(encounter => {
            encounter.patient = encounter.patient[0]
            encounter.doctor = encounter.doctor[0]
            encounter.clinic = encounter.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
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

const getEncounter = async (request, response) => {

    try {

        const { encounterId } = request.params

        const encounter = await EncounterModel.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(encounterId)
                }
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
                    from: 'users',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            {
                $project: {
                    'doctor.password': 0,
                    'patient.healthHistory': 0,
                    'patient.emergencyContacts': 0,
                    'patient.doctors': 0
                }
            }
        ])

        encounter.forEach(encounter => {
            encounter.patient = encounter.patient[0]
            encounter.doctor = encounter.doctor[0]
        })

        return response.status(200).json({
            accepted: true,
            encounter: encounter[0]
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

const updateEncounter = async (request, response) => {

    try {

        const { encounterId } = request.params

        const dataValidation = encounterValidation.updateEncounter(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { symptoms, diagnosis, notes } = request.body

        const updatedEncounter = await EncounterModel
        .findByIdAndUpdate(encounterId, { symptoms, diagnosis, notes }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated encounter successfully!'],
            encounter: updatedEncounter
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
    addEncounter, 
    deleteEncounter, 
    getPatientEncounters, 
    getDoctorEncounters,
    getEncounter,
    addEncounterByPatientCardId,
    updateEncounter
}