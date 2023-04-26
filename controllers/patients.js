const PatientModel = require('../models/PatientModel')
const UserModel = require('../models/UserModel')
const ClinicModel = require('../models/ClinicModel')
const EncounterModel = require('../models/EncounterModel')
const patientValidation = require('../validations/patients')
const mongoose = require('mongoose')


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



module.exports = { 
    addPatient, 
    getClinicPatients, 
    getPatientInfo, 
    getPatient, 
    getPatientByCardUUID, 
    addDoctorToPatient,
    getPatientsByDoctorId,
    getPatientDoctors
}