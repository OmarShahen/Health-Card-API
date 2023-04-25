const utils = require('../utils/utils')
const ClinicModel = require('../models/ClinicModel')
const PatientModel = require('../models/PatientModel')
const UserModel = require('../models/UserModel')
const PrescriptionModel = require('../models/PrescriptionModel')
const AppointmentModel = require('../models/AppointmentModel')
const EncounterModel = require('../models/EncounterModel')

const verifyClinicId = async (request, response, next) => {

    try {

        const { clinicId } = request.params

        if(!utils.isObjectId(clinicId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid clinic Id formate',
                field: 'clinicId'
            })
        }

        const clinic = await ClinicModel.findById(clinicId)
        if(!clinic) {
            return response.status(404).json({
                accepted: false,
                message: 'clinic Id does not exist',
                field: 'clinicId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyPatientId = async (request, response, next) => {

    try {

        const { patientId } = request.params

        if(!utils.isObjectId(patientId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid patient Id formate',
                field: 'patientId'
            })
        }

        const patient = await PatientModel.findById(patientId)
        if(!patient) {
            return response.status(404).json({
                accepted: false,
                message: 'patient Id does not exist',
                field: 'patientId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyUserId = async (request, response, next) => {

    try {

        const { userId } = request.params

        if(!utils.isObjectId(userId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid user Id formate',
                field: 'userId'
            })
        }

        const user = await UserModel.findById(userId)
        if(!user) {
            return response.status(404).json({
                accepted: false,
                message: 'user Id does not exist',
                field: 'userId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyDoctorId = async (request, response, next) => {

    try {

        const { doctorId } = request.params

        if(!utils.isObjectId(doctorId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid doctor Id formate',
                field: 'doctorId'
            })
        }

        const doctor = await UserModel.findById(doctorId)
        if(!doctor || doctor.role != 'DOCTOR') {
            return response.status(404).json({
                accepted: false,
                message: 'doctor Id does not exist',
                field: 'doctorId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyPrescriptionId = async (request, response, next) => {

    try {

        const { prescriptionId } = request.params

        if(!utils.isObjectId(prescriptionId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid prescription Id formate',
                field: 'prescriptionId'
            })
        }

        const prescription = await PrescriptionModel.findById(prescriptionId)
        if(!prescription) {
            return response.status(404).json({
                accepted: false,
                message: 'prescription Id does not exist',
                field: 'prescriptionId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyCardUUID = async (request, response, next) => {

    try {

        const { cardUUID } = request.params

        if(!utils.isUUIDValid(cardUUID)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid card UUID formate',
                field: 'cardUUID'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyAppointmentId = async (request, response, next) => {

    try {

        const { appointmentId } = request.params

        if(!utils.isObjectId(appointmentId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid appointment Id formate',
                field: 'appointmentId'
            })
        }

        const appointment = await AppointmentModel.findById(appointmentId)
        if(!appointment) {
            return response.status(404).json({
                accepted: false,
                message: 'appointment Id does not exist',
                field: 'appointmentId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyEncounterId = async (request, response, next) => {

    try {

        const { encounterId } = request.params

        if(!utils.isObjectId(encounterId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid encounter Id formate',
                field: 'encounterId'
            })
        }

        const encounter = await EncounterModel.findById(encounterId)
        if(!encounter) {
            return response.status(404).json({
                accepted: false,
                message: 'encounter Id does not exist',
                field: 'encounterId'
            })
        }

        return next()

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
    verifyClinicId, 
    verifyPatientId,
    verifyUserId,
    verifyDoctorId,
    verifyPrescriptionId,
    verifyCardUUID,
    verifyAppointmentId,
    verifyEncounterId
}