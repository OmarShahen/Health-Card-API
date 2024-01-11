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
const FolderModel = require('../models/file-storage/FolderModel')
const FileModel = require('../models/file-storage/FileModel')
const ClinicSubscriptionModel = require('../models/followup-service/ClinicSubscriptionModel')
const PatientSurveyModel = require('../models/followup-service/PatientSurveyModel')
const ArrivalMethodModel = require('../models/ArrivalMethodModel')
const LabelModel = require('../models/labels/LabelModel')
const TreatmentSurveyModel = require('../models/followup-service/TreatmentSurveyModel')
const MedicationChallengeModel = require('../models/medication-challenges/MedicationChallenges')
const LeadModel = require('../models/CRM/LeadModel')
const MeetingModel = require('../models/CRM/MeetingModel')
const CommentModel = require('../models/followup-service/CommentModel')
const StageModel = require('../models/CRM/StageModel')
const MessageTemplateModel = require('../models/CRM/MessageTemplateModel')
const MessageSentModel = require('../models/CRM/MessageSentModel')
const ValueModel = require('../models/ValueModel')
const OpeningTimeModel = require('../models/OpeningTimeModel')
const ReviewModel = require('../models/ReviewModel')


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

const verifyFolderId = async (request, response, next) => {

    try {

        const { folderId } = request.params

        if(!utils.isObjectId(folderId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid folder Id format',
                field: 'folderId'
            })
        }

        const folder = await FolderModel.findById(folderId)
        if(!folder) {
            return response.status(404).json({
                accepted: false,
                message: 'Folder Id does not exist',
                field: 'folderId'
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

const verifyFileId = async (request, response, next) => {

    try {

        const { fileId } = request.params

        if(!utils.isObjectId(fileId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid file Id format',
                field: 'fileId'
            })
        }

        const file = await FileModel.findById(fileId)
        if(!file) {
            return response.status(404).json({
                accepted: false,
                message: 'File Id does not exist',
                field: 'fileId'
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

const verifyClinicSubscriptionId = async (request, response, next) => {

    try {

        const { clinicSubscriptionId } = request.params

        if(!utils.isObjectId(clinicSubscriptionId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid clinic subscription Id format',
                field: 'clinicSubscriptionId'
            })
        }

        const clinicSubscription = await ClinicSubscriptionModel.findById(clinicSubscriptionId)
        if(!clinicSubscription) {
            return response.status(404).json({
                accepted: false,
                message: 'Clinic subscription Id does not exist',
                field: 'clinicSubscriptionId'
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

const verifyPatientSurveyId = async (request, response, next) => {

    try {

        const { patientSurveyId } = request.params

        if(!utils.isObjectId(patientSurveyId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid patient survey Id format',
                field: 'patientSurveyId'
            })
        }

        const patientSurvey = await PatientSurveyModel.findById(patientSurveyId)
        if(!patientSurvey) {
            return response.status(404).json({
                accepted: false,
                message: 'Patient survey Id does not exist',
                field: 'patientSurveyId'
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

const verifyArrivalMethodId = async (request, response, next) => {

    try {

        const { arrivalMethodId } = request.params

        if(!utils.isObjectId(arrivalMethodId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid arrival method Id format',
                field: 'arrivalMethodId'
            })
        }

        const arrivalMethod = await ArrivalMethodModel.findById(arrivalMethodId)
        if(!arrivalMethod) {
            return response.status(404).json({
                accepted: false,
                message: 'Arrival Method Id does not exist',
                field: 'arrivalMethodId'
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

const verifyLabelId = async (request, response, next) => {

    try {

        const { labelId } = request.params

        if(!utils.isObjectId(labelId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid label Id format',
                field: 'labelId'
            })
        }

        const label = await LabelModel.findById(labelId)
        if(!label) {
            return response.status(404).json({
                accepted: false,
                message: 'Label ID does not exist',
                field: 'labelId'
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

const verifyTreatmentSurveyId = async (request, response, next) => {

    try {

        const { treatmentSurveyId } = request.params

        if(!utils.isObjectId(treatmentSurveyId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid treatment survey Id format',
                field: 'treatmentSurveyId'
            })
        }

        const treatmentSurvey = await TreatmentSurveyModel.findById(treatmentSurveyId)
        if(!treatmentSurvey) {
            return response.status(404).json({
                accepted: false,
                message: 'Treatment survey ID does not exist',
                field: 'treatmentSurveyId'
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

const verifyMedicationChallengeId = async (request, response, next) => {

    try {

        const { medicationChallengeId } = request.params

        if(!utils.isObjectId(medicationChallengeId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid medication challenge ID format',
                field: 'medicationChallengeId'
            })
        }

        const medicationChallenge = await MedicationChallengeModel.findById(medicationChallengeId)
        if(!medicationChallenge) {
            return response.status(404).json({
                accepted: false,
                message: 'Medication challenge ID does not exist',
                field: 'medicationChallengeId'
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

const verifyLeadId = async (request, response, next) => {

    try {

        const { leadId } = request.params

        if(!utils.isObjectId(leadId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid lead ID format',
                field: 'leadId'
            })
        }

        const lead = await LeadModel.findById(leadId)
        if(!lead) {
            return response.status(404).json({
                accepted: false,
                message: 'Lead ID does not exist',
                field: 'leadId'
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

const verifyMeetingId = async (request, response, next) => {

    try {

        const { meetingId } = request.params

        if(!utils.isObjectId(meetingId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid meeting ID format',
                field: 'meetingId'
            })
        }

        const meeting = await MeetingModel.findById(meetingId)
        if(!meeting) {
            return response.status(404).json({
                accepted: false,
                message: 'Meeting ID does not exist',
                field: 'meetingId'
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

const verifyCommentId = async (request, response, next) => {

    try {

        const { commentId } = request.params

        if(!utils.isObjectId(commentId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid comment ID format',
                field: 'commentId'
            })
        }

        const comment = await CommentModel.findById(commentId)
        if(!comment) {
            return response.status(404).json({
                accepted: false,
                message: 'Comment ID does not exist',
                field: 'commentId'
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

const verifyStageId = async (request, response, next) => {

    try {

        const { stageId } = request.params

        if(!utils.isObjectId(stageId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid stage ID format',
                field: 'stageId'
            })
        }

        const stage = await StageModel.findById(stageId)
        if(!stage) {
            return response.status(404).json({
                accepted: false,
                message: 'Stage ID does not exist',
                field: 'stageId'
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

const verifyMessageTemplateId = async (request, response, next) => {

    try {

        const { messageTemplateId } = request.params

        if(!utils.isObjectId(messageTemplateId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid message template ID format',
                field: 'messageTemplateId'
            })
        }

        const messageTemplate = await MessageTemplateModel.findById(messageTemplateId)
        if(!messageTemplate) {
            return response.status(404).json({
                accepted: false,
                message: 'Message template ID does not exist',
                field: 'messageTemplateId'
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

const verifyMessageSentId = async (request, response, next) => {

    try {

        const { messageSentId } = request.params

        if(!utils.isObjectId(messageSentId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid message sent ID format',
                field: 'messageSentId'
            })
        }

        const messageSent = await MessageSentModel.findById(messageSentId)
        if(!messageSent) {
            return response.status(404).json({
                accepted: false,
                message: 'Message sent ID does not exist',
                field: 'messageSentId'
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

const verifyValueId = async (request, response, next) => {

    try {

        const { valueId } = request.params

        if(!utils.isObjectId(valueId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid value ID format',
                field: 'valueId'
            })
        }

        const value = await ValueModel.findById(valueId)
        if(!value) {
            return response.status(404).json({
                accepted: false,
                message: 'Value ID does not exist',
                field: 'valueId'
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

const verifyOpeningTimeId = async (request, response, next) => {

    try {

        const { openingTimeId } = request.params

        if(!utils.isObjectId(openingTimeId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid opening ID format',
                field: 'openingTimeId'
            })
        }

        const openingTime = await OpeningTimeModel.findById(openingTimeId)
        if(!openingTime) {
            return response.status(404).json({
                accepted: false,
                message: 'Opening ID does not exist',
                field: 'openingTimeId'
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

const verifyReviewId = async (request, response, next) => {

    try {

        const { reviewId } = request.params

        if(!utils.isObjectId(reviewId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid review ID format',
                field: 'reviewId'
            })
        }

        const review = await ReviewModel.findById(reviewId)
        if(!review) {
            return response.status(404).json({
                accepted: false,
                message: 'Review ID does not exist',
                field: 'reviewId'
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
    verifyInsurancePolicyId,
    verifyFolderId,
    verifyFileId,
    verifyClinicSubscriptionId,
    verifyPatientSurveyId,
    verifyArrivalMethodId,
    verifyLabelId,
    verifyTreatmentSurveyId,
    verifyMedicationChallengeId,
    verifyLeadId,
    verifyMeetingId,
    verifyCommentId,
    verifyStageId,
    verifyMessageTemplateId,
    verifyMessageSentId,
    verifyValueId,
    verifyOpeningTimeId,
    verifyReviewId
}