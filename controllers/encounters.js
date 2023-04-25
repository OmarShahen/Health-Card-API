const encounterValidation = require('../validations/encounters')
const EncounterModel = require('../models/EncounterModel')
const PrescriptionModel = require('../models/PrescriptionModel')
const UserModel = require('../models/UserModel')
const PatientModel = require('../models/PatientModel')
const mongoose = require('mongoose')

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

        const { doctorId, patientId, symptoms, diagnosis, notes, labTests, labAnalysis, medicines } = request.body

        const doctorPromise = UserModel.findById(doctorId)
        const patientPromise = PatientModel.findById(patientId)

        const [doctor, patient] = await Promise.all([
            doctorPromise,
            patientPromise
        ])

        if(!doctor || doctor.role != 'DOCTOR') {
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

        let encounterData = {
            doctorId,
            patientId,
            symptoms,
            diagnosis,
            notes,
            labTests,
            labAnalysis
        }

        let newPrescription

        if(medicines && medicines.length != 0) {
            let prescriptionData = { doctorId, patientId, medicines }
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

const deleteEncounter = async (request, response) => {

    try {

        const { encounterId } = request.params

        const deletedEncounter = await EncounterModel.findByIdAndDelete(encounterId)

        return response.status(200).json({
            accepted: true,
            message: 'encounter deleted successfully',
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

        const encounters = await EncounterModel.aggregate([
            {
                $match: { patientId: mongoose.Types.ObjectId(patientId) }
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

        const encounters = await EncounterModel.aggregate([
            {
                $match: { doctorId: mongoose.Types.ObjectId(userId) }
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

module.exports = { addEncounter, deleteEncounter, getPatientEncounters, getDoctorEncounters }