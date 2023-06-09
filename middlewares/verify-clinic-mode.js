const ClinicModel = require('../models/ClinicModel')
const EncounterModel = require('../models/EncounterModel')
const PrescriptionModel = require('../models/PrescriptionModel')
const InvoiceModel = require('../models/InvoiceModel')
const AppointmentModel = require('../models/AppointmentModel')
const ClinicPatientModel = require('../models/ClinicPatientModel')
const ClinicRequestModel = require('../models/ClinicRequestModel')
const ServiceModel = require('../models/ServiceModel')
const utils = require('../utils/utils')
const config = require('../config/config')


const verifyClinicEncounters = async (request, response, next) => {

    try {

        const { clinicId } = request.body

        if(!utils.isObjectId(clinicId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        const clinic = await ClinicModel.findById(clinicId)

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        if(clinic.mode == 'TEST') {
            const encounters = await EncounterModel.find({ clinicId })
            if(encounters.length >= config.TEST_MODE_LIMIT) {
                return response.status(400).json({
                    accepted: false,
                    message: 'passed testing mode limit in encounters',
                    field: 'mode'
                })
            }
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

const verifyClinicPrescriptions = async (request, response, next) => {

    try {

        const { clinicId } = request.body

        if(!utils.isObjectId(clinicId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        const clinic = await ClinicModel.findById(clinicId)

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        if(clinic.mode == 'TEST') {
            const prescriptions = await PrescriptionModel.find({ clinicId })
            if(prescriptions.length >= config.TEST_MODE_LIMIT) {
                return response.status(400).json({
                    accepted: false,
                    message: 'passed testing mode limit in prescriptions',
                    field: 'mode'
                })
            }
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

const verifyClinicInvoices = async (request, response, next) => {

    try {

        const { clinicId } = request.body

        if(!utils.isObjectId(clinicId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        const clinic = await ClinicModel.findById(clinicId)

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        if(clinic.mode == 'TEST') {
            const invoices = await InvoiceModel.find({ clinicId })
            if(invoices.length >= config.TEST_MODE_LIMIT) {
                return response.status(400).json({
                    accepted: false,
                    message: 'passed testing mode limit in invoices',
                    field: 'mode'
                })
            }
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

const verifyClinicAppointments = async (request, response, next) => {

    try {

        const { clinicId } = request.body

        if(!utils.isObjectId(clinicId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        const clinic = await ClinicModel.findById(clinicId)

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        if(clinic.mode == 'TEST') {
            const appointments = await AppointmentModel.find({ clinicId })
            if(appointments.length >= config.TEST_MODE_LIMIT) {
                return response.status(400).json({
                    accepted: false,
                    message: 'passed testing mode limit in appointments',
                    field: 'mode'
                })
            }
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

const verifyClinicServices = async (request, response, next) => {

    try {

        const { clinicId } = request.body

        if(!utils.isObjectId(clinicId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        const clinic = await ClinicModel.findById(clinicId)

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        if(clinic.mode == 'TEST') {
            const services = await ServiceModel.find({ clinicId })
            if(services.length >= config.TEST_MODE_LIMIT) {
                return response.status(400).json({
                    accepted: false,
                    message: 'passed testing mode limit in clinic services',
                    field: 'mode'
                })
            }
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

const verifyClinicPatients = async (request, response, next) => {

    try {

        const { clinicId, cardId } = request.body

        if(!utils.isObjectId(clinicId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        const clinic = await ClinicModel.findById(clinicId)

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        if(clinic.mode == 'TEST') {
            const patients = await ClinicPatientModel.find({ clinicId })
            if(patients.length >= config.TEST_MODE_LIMIT) {
                return response.status(400).json({
                    accepted: false,
                    message: 'passed testing mode limit in patients',
                    field: 'mode'
                })
            }

            if(![18101851, 18101852, 18101853].includes(cardId)) {
                return response.status(400).json({
                    accepted: false,
                    message: 'patient card ID is not included in testing mode',
                    field: 'mode'
                })
            }
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

const verifyClinicStaffRequest = async (request, response, next) => {

    try {

        const { clinicId } = request.body

        if(!utils.isObjectId(clinicId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        const clinic = await ClinicModel.findById(clinicId)

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        if(clinic.mode == 'TEST') {
            const clinicRequests = await ClinicRequestModel.find({ clinicId, role: 'STAFF' })
            if(clinicRequests.length >= 1) {
                return response.status(400).json({
                    accepted: false,
                    message: 'passed testing mode limit in clinic staffs invitations',
                    field: 'mode'
                })
            }
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

const verifyClinicAddDoctorRequest = async (request, response, next) => {

    try {

        const { clinicId } = request.body

        if(!utils.isObjectId(clinicId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        const clinic = await ClinicModel.findById(clinicId)

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        if(clinic.mode == 'TEST') {
            const clinicRequests = await ClinicRequestModel.find({ clinicId, role: 'DOCTOR' })
            if(clinicRequests.length >= 1) {
                return response.status(400).json({
                    accepted: false,
                    message: 'passed testing mode limit in clinic doctors invitations',
                    field: 'mode'
                })
            }
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

const verifyClinicAddOwnerRequest = async (request, response, next) => {

    try {

        const { clinicId } = request.body

        if(!utils.isObjectId(clinicId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        const clinic = await ClinicModel.findById(clinicId)

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        if(clinic.mode == 'TEST') {
            const clinicRequests = await ClinicRequestModel.find({ clinicId, role: 'OWNER' })
            if(clinicRequests.length >= 1) {
                return response.status(400).json({
                    accepted: false,
                    message: 'passed testing mode limit in clinic owners invitations',
                    field: 'mode'
                })
            }
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
    verifyClinicEncounters, 
    verifyClinicPrescriptions, 
    verifyClinicInvoices,
    verifyClinicAppointments,
    verifyClinicServices,
    verifyClinicPatients,
    verifyClinicStaffRequest,
    verifyClinicAddDoctorRequest,
    verifyClinicAddDoctorRequest,
    verifyClinicAddOwnerRequest
}