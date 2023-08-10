const utils = require('../utils/utils')
const ClinicModel = require('../models/ClinicModel')
const PatientModel = require('../models/PatientModel')
const UserModel = require('../models/UserModel')
const PrescriptionModel = require('../models/PrescriptionModel')
const AppointmentModel = require('../models/AppointmentModel')
const EncounterModel = require('../models/EncounterModel')
const ClinicPatientModel = require('../models/ClinicPatientModel')
const VisitReasonModel = require('../models/VisitReasonModel')
const SpecialityModel = require('../models/SpecialityModel')
const ClinicOwnerModel = require('../models/ClinicOwnerModel')
const ClinicDoctorModel = require('../models/ClinicDoctorModel')
const ClinicPatientDoctorModel = require('../models/ClinicPatientDoctorModel')
const ClinicRequestModel = require('../models/ClinicRequestModel')
const ServiceModel = require('../models/ServiceModel')
const InvoiceModel = require('../models/InvoiceModel')
const InvoiceServiceModel = require('../models/InvoiceServiceModel')
const CardModel = require('../models/CardModel')
const SubscriptionModel = require('../models/SubscriptionModel')
const InsuranceModel = require('../models/InsuranceModel')
const InsurancePolicyModel = require('../models/InsurancePolicyModel')


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
        if(!doctor || !doctor.roles.includes('DOCTOR')) {
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

        request.doctorId = prescription.doctorId

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyCardId = async (request, response, next) => {

    try {

        const { cardId } = request.params

        const cardsList = await CardModel.find({ cardId })
        if(cardsList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'card Id does not exist',
                field: 'cardId'
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

        request.doctorId = encounter.doctorId

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

const verifyClinicPatientId = async (request, response, next) => {

    try {

        const { clinicPatientId } = request.params

        if(!utils.isObjectId(clinicPatientId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid clinic patient Id formate',
                field: 'clinicPatientId'
            })
        }

        const clinicPatient = await ClinicPatientModel.findById(clinicPatientId)
        if(!clinicPatient) {
            return response.status(404).json({
                accepted: false,
                message: 'clinic patient Id does not exist',
                field: 'clinicPatientId'
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

const verifyVisitReasonId = async (request, response, next) => {

    try {

        const { visitReasonId } = request.params

        if(!utils.isObjectId(visitReasonId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid visit reason Id formate',
                field: 'visitReasonId'
            })
        }

        const visitReason = await VisitReasonModel.findById(visitReasonId)
        if(!visitReason) {
            return response.status(404).json({
                accepted: false,
                message: 'visit reason Id does not exist',
                field: 'visitReasonId'
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

const verifySpecialityId = async (request, response, next) => {

    try {

        const { specialityId } = request.params

        if(!utils.isObjectId(specialityId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid speciality Id formate',
                field: 'specialityId'
            })
        }

        const speciality = await SpecialityModel.findById(specialityId)
        if(!speciality) {
            return response.status(404).json({
                accepted: false,
                message: 'speciality Id does not exist',
                field: 'specialityId'
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

const verifyClinicOwnerId = async (request, response, next) => {

    try {

        const { clinicOwnerId } = request.params

        if(!utils.isObjectId(clinicOwnerId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid clinic owner Id formate',
                field: 'clinicOwnerId'
            })
        }

        const clinicOwner = await ClinicOwnerModel.findById(clinicOwnerId)
        if(!clinicOwner) {
            return response.status(404).json({
                accepted: false,
                message: 'clinic owner Id does not exist',
                field: 'clinicOwnerId'
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

const verifyClinicDoctorId = async (request, response, next) => {

    try {

        const { clinicDoctorId } = request.params

        if(!utils.isObjectId(clinicDoctorId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid clinic doctor Id formate',
                field: 'clinicDoctorId'
            })
        }

        const clinicDoctor = await ClinicDoctorModel.findById(clinicDoctorId)
        if(!clinicDoctor) {
            return response.status(404).json({
                accepted: false,
                message: 'clinic doctor Id does not exist',
                field: 'clinicDoctorId'
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

const verifyClinicPatientDoctorId = async (request, response, next) => {

    try {

        const { clinicPatientDoctorId } = request.params

        if(!utils.isObjectId(clinicPatientDoctorId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid clinic patient doctor Id formate',
                field: 'clinicPatientDoctorId'
            })
        }

        const clinicPatientDoctor = await ClinicPatientDoctorModel.findById(clinicPatientDoctorId)
        if(!clinicPatientDoctor) {
            return response.status(404).json({
                accepted: false,
                message: 'clinic patient doctor Id does not exist',
                field: 'clinicPatientDoctorId'
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

const verifyClinicRequestId = async (request, response, next) => {

    try {

        const { clinicRequestId } = request.params

        if(!utils.isObjectId(clinicRequestId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid clinic request Id formate',
                field: 'clinicRequestId'
            })
        }

        const clinicRequest = await ClinicRequestModel.findById(clinicRequestId)
        if(!clinicRequest) {
            return response.status(404).json({
                accepted: false,
                message: 'clinic request Id does not exist',
                field: 'clinicRequestId'
            })
        }

        // for the check clinic mode middleware
        
        request.body.clinicId = clinicRequest.clinicId

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyServiceId = async (request, response, next) => {

    try {

        const { serviceId } = request.params

        if(!utils.isObjectId(serviceId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid service Id formate',
                field: 'serviceId'
            })
        }

        const service = await ServiceModel.findById(serviceId)
        if(!service) {
            return response.status(404).json({
                accepted: false,
                message: 'service Id does not exist',
                field: 'serviceId'
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

const verifyInvoiceId = async (request, response, next) => {

    try {

        const { invoiceId } = request.params

        if(!utils.isObjectId(invoiceId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid invoice Id formate',
                field: 'invoiceId'
            })
        }

        const invoice = await InvoiceModel.findById(invoiceId)
        if(!invoice) {
            return response.status(404).json({
                accepted: false,
                message: 'invoice Id does not exist',
                field: 'invoiceId'
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

const verifyInvoiceServiceId = async (request, response, next) => {

    try {

        const { invoiceServiceId } = request.params

        if(!utils.isObjectId(invoiceServiceId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid invoice service Id format',
                field: 'invoiceServiceId'
            })
        }

        const invoiceService = await InvoiceServiceModel.findById(invoiceServiceId)
        if(!invoiceService) {
            return response.status(404).json({
                accepted: false,
                message: 'invoice service Id does not exist',
                field: 'invoiceServiceId'
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

const verifySubscriptionId = async (request, response, next) => {

    try {

        const { subscriptionId } = request.params

        if(!utils.isObjectId(subscriptionId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid subscription Id format',
                field: 'subscriptionId'
            })
        }

        const subscription = await SubscriptionModel.findById(subscriptionId)
        if(!subscription) {
            return response.status(404).json({
                accepted: false,
                message: 'subscription Id does not exist',
                field: 'subscriptionId'
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


const verifyInsuranceId = async (request, response, next) => {

    try {

        const { insuranceId } = request.params

        if(!utils.isObjectId(insuranceId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid insurance Id format',
                field: 'insuranceId'
            })
        }

        const insurance = await InsuranceModel.findById(insuranceId)
        if(!insurance) {
            return response.status(404).json({
                accepted: false,
                message: 'Insurance Id does not exist',
                field: 'insuranceId'
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

const verifyInsurancePolicyId = async (request, response, next) => {

    try {

        const { insurancePolicyId } = request.params

        if(!utils.isObjectId(insurancePolicyId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid insurance policy Id format',
                field: 'insurancePolicyId'
            })
        }

        const insurancePolicy = await InsurancePolicyModel.findById(insurancePolicyId)
        if(!insurancePolicy) {
            return response.status(404).json({
                accepted: false,
                message: 'Insurance policy Id does not exist',
                field: 'insurancePolicyId'
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

module.exports = { 
    verifyClinicId, 
    verifyPatientId,
    verifyUserId,
    verifyDoctorId,
    verifyPrescriptionId,
    verifyAppointmentId,
    verifyEncounterId,
    verifyClinicPatientId,
    verifyVisitReasonId,
    verifySpecialityId,
    verifyClinicOwnerId,
    verifyClinicDoctorId,
    verifyClinicPatientDoctorId,
    verifyClinicRequestId,
    verifyServiceId,
    verifyInvoiceId,
    verifyInvoiceServiceId,
    verifyCardId,
    verifySubscriptionId,
    verifyInsuranceId,
    verifyInsurancePolicyId
}