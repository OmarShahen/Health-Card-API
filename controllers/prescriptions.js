const mongoose = require('mongoose')
const PrescriptionModel = require('../models/PrescriptionModel')
const PatientModel = require('../models/PatientModel')
const ClinicSubscriptionModel = require('../models/followup-service/ClinicSubscriptionModel')
const UserModel = require('../models/UserModel')
const ClinicPatientDoctorModel = require('../models/ClinicPatientDoctorModel')
const CounterModel = require('../models/CounterModel')
const prescriptionValidation = require('../validations/prescriptions')
const ClinicModel = require('../models/ClinicModel')
const config = require('../config/config')
const utils = require('../utils/utils')
const translations = require('../i18n/index')
const whatsapp = require('../APIs/whatsapp/send-prescription')

const formatPrescriptionsDrugs = (prescriptions) => {
    let drugs = []
    for(let i=0;i<prescriptions.length;i++) {
        const prescription = prescriptions[i]
        for(let j=0;j<prescription.medicines.length;j++) {
            const medicine = prescription.medicines[j]
            drugs.push({ _id: prescription._id, ...medicine })
        }
    }

    return drugs
}


const addPrescription = async (request, response) => {

    try {

        const dataValidation = prescriptionValidation.addPrescription(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { doctorId, patientId, clinicId, medicines, registrationDate, notes } = request.body

        const patientPromise = PatientModel.findById(patientId)
        const doctorPromise = UserModel.findById(doctorId)
        const clinicPromise = ClinicModel.findById(clinicId)


        const [doctor, patient, clinic] = await Promise.all([
            doctorPromise,
            patientPromise,
            clinicPromise
        ])

        if(!patient) {
            return response.status(400).json({
                accepted: false,
                message:'Patient ID is not registered',
                field: 'patientId'
            })
        }

        if(!doctor || !doctor.roles.includes('DOCTOR')) {
            return response.status(400).json({
                accepted: false,
                message: 'Doctor Id does not exist',
                field: 'doctorId'
            })
        }

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        const doctorPatientAccessList = await ClinicPatientDoctorModel.find({ doctorId, patientId: patient._id, clinicId: clinic._id })

        if(doctorPatientAccessList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Doctor does not have access to the patient'],
                field: 'patientId'
            })
        }

        const treatmentEndDate = utils.getTreatmentExpirationDate(medicines, new Date())

        const counter = await CounterModel.findOneAndUpdate(
            { name: `${clinic._id}-prescription` },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )
        
        const prescriptionData = {
            prescriptionId: counter.value,
            clinicId,
            patientId: patient._id,
            doctorId,
            medicines,
            treatmentEndDate,
            notes,
            createdAt: registrationDate
        }

        const prescriptionObj = new PrescriptionModel(prescriptionData)
        const newPrescription = await prescriptionObj.save()

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Prescription is added successfully!'],
            prescription: newPrescription
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

const getDoctorPrescriptions = async (request, response) => {

    try {

        const { doctorId } = request.params
        let { query } = request.query

        query = query ? query : ''

        const { searchQuery } = utils.statsQueryGenerator('doctorId', doctorId, request.query)

        const prescriptions = await PrescriptionModel.aggregate([
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
                    from: 'users',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctor'
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
                    'patient.healthHistory': 0,
                    'patient.emergencyContacts': 0,
                    'patient.doctors': 0,
                    'doctor.password': 0
                }
            }
        ])

        prescriptions.forEach(prescription => {
            prescription.patient = prescription.patient[0]
            prescription.doctor = prescription.doctor[0]
            prescription.clinic = prescription.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            prescriptions
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

const getClinicPrescriptions = async (request, response) => {

    try {

        const { clinicId } = request.params
        const { searchQuery } = utils.statsQueryGenerator('clinicId', clinicId, request.query)

        const prescriptions = await PrescriptionModel.aggregate([
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
                    from: 'users',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctor'
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
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    'patient.healthHistory': 0,
                    'patient.emergencyContacts': 0,
                    'patient.doctors': 0,
                    'doctor.password': 0
                }
            }
        ])

        prescriptions.forEach(prescription => {
            prescription.patient = prescription.patient[0]
            prescription.doctor = prescription.doctor[0]
            prescription.clinic = prescription.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            prescriptions
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

const getPatientPrescriptions = async (request, response) => {

    try {

        const { patientId } = request.params
        let { query } = request.query

        query = query ? query : ''

        const { searchQuery } = utils.statsQueryGenerator('patientId', patientId, request.query)

        const prescriptions = await PrescriptionModel.aggregate([
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
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
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
                    'patient.healthHistory': 0,
                    'patient.emergencyContacts': 0,
                    'patient.doctors': 0,
                    'doctor.password': 0
                }
            }
        ])

        prescriptions.forEach(prescription => {
            prescription.doctor = prescription.doctor[0]
            prescription.patient = prescription.patient[0]
            prescription.clinic = prescription.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            prescriptions
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

const getPatientPrescription = async (request, response) => {

    try {

        const { patientId, prescriptionId } = request.params

        const searchQuery = {
            _id: mongoose.Types.ObjectId(prescriptionId),
            patientId: mongoose.Types.ObjectId(patientId)
        }

        const prescriptions = await PrescriptionModel.aggregate([
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
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
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
                    'patient.healthHistory': 0,
                    'patient.emergencyContacts': 0,
                    'patient.doctors': 0,
                    'doctor.password': 0
                }
            }
        ])

        prescriptions.forEach(prescription => {
            prescription.doctor = prescription.doctor[0]
            prescription.patient = prescription.patient[0]
            prescription.clinic = prescription.clinic[0]
        })

        let prescription = null

        if(prescriptions.length != 0) {
            prescription = prescriptions[0]
        }

        return response.status(200).json({
            accepted: true,
            prescription
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

const getClinicPatientPrescriptions = async (request, response) => {

    try {

        const { clinicId, patientId } = request.params
        let { query } = request.query

        query = query ? query : ''

        const { searchQuery } = utils.statsQueryGenerator('patientId', patientId, request.query)
        searchQuery.clinicId = mongoose.Types.ObjectId(clinicId)

        const prescriptions = await PrescriptionModel.aggregate([
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
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
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
                    'patient.healthHistory': 0,
                    'patient.emergencyContacts': 0,
                    'patient.doctors': 0,
                    'doctor.password': 0
                }
            }
        ])

        prescriptions.forEach(prescription => {
            prescription.doctor = prescription.doctor[0]
            prescription.patient = prescription.patient[0]
            prescription.clinic = prescription.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            prescriptions
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

const deletePrescription = async (request, response) => {

    try {

        const { prescriptionId } = request.params

        const deletedPrescription = await PrescriptionModel.findByIdAndDelete(prescriptionId)

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Prescription deleted successfully!'],
            prescription: deletedPrescription
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

const getPrescription = async (request, response) => {

    try {

        const { prescriptionId } = request.params

        const prescription = await PrescriptionModel.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(prescriptionId)
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

        prescription.forEach(prescription => {
            prescription.patient = prescription.patient[0]
            prescription.doctor = prescription.doctor[0]
        })

        return response.status(200).json({
            accepted: true,
            prescription: prescription[0]
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

const updatePrescription = async (request, response) => {

    try {

        const { prescriptionId } = request.params

        const dataValidation = prescriptionValidation.updatePrescription(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { medicines, notes } = request.body

        const prescription = await PrescriptionModel.findById(prescriptionId)

        const treatmentEndDate = utils.getTreatmentExpirationDate(medicines, prescription.createdAt)

        const updateData = { medicines, notes, treatmentEndDate }

        const updatedPrescription = await PrescriptionModel
        .findByIdAndUpdate(prescriptionId, updateData, { new: true })

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated prescription successfully!'],
            prescription: updatedPrescription
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

const ratePrescription = async (request, response) => {

    try {

        const { prescriptionId } = request.params
        const { rate } = request.body

        if(!config.RATES.includes(rate)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid rate value',
                field: 'rate'
            })
        }

        const updatedPerscription = await PrescriptionModel
        .findByIdAndUpdate(prescriptionId, { rate }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated prescription rate successfully',
            prescription: updatedPerscription
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

const getPatientLastPrescriptionByCardUUID = async (request, response) => {

    try {

        const { cardUUID } = request.params

        const patient = await PatientModel.find({ cardUUID })

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

const getClinicPatientDrugs = async (request, response) => {

    try {

        const { clinicId, patientId } = request.params
        let { query } = request.query

        query = query ? query : ''

        const { searchQuery } = utils.statsQueryGenerator('patientId', patientId, request.query)
        searchQuery.clinicId = mongoose.Types.ObjectId(clinicId)

        const prescriptions = await PrescriptionModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    medicines: 1
                }
            }
        ])

        const drugs = formatPrescriptionsDrugs(prescriptions)

        return response.status(200).json({
            accepted: true,
            drugs
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

const getPatientDrugs = async (request, response) => {

    try {

        const { patientId } = request.params
        let { query } = request.query

        query = query ? query : ''

        const { searchQuery } = utils.statsQueryGenerator('patientId', patientId, request.query)

        const prescriptions = await PrescriptionModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    medicines: 1
                }
            }
        ])

        const drugs = formatPrescriptionsDrugs(prescriptions)

        return response.status(200).json({
            accepted: true,
            drugs
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

const sendPrescriptionThroughWhatsapp = async (request, response) => {

    try {

        const { prescriptionId } = request.params

        const prescription = await PrescriptionModel.findById(prescriptionId)

        const doctorPromise = UserModel.findById(prescription.doctorId)
        const patientPromise = PatientModel.findById(prescription.patientId)

        const [doctor, patient] = await Promise.all([doctorPromise, patientPromise])

        const patientPhone = `${patient.countryCode}${patient.phone}`
        const doctorName = `${doctor.firstName} ${doctor.lastName}`
        const prescriptionURL = `patients/${prescription.patientId}/prescriptions/${prescription._id}`

        const message = await whatsapp.sendPrescription(patientPhone, 'ar', doctorName, prescriptionURL)

        if(!message.isSent) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['There was a problem sending your prescription'],
                field: 'prescriptionId'
            })
        }

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Prescription is sent successfully']
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

const getFollowupRegisteredClinicsPrescriptions = async (request, response) => {

    try {

        const subscriptionList = await ClinicSubscriptionModel
        .find({ isActive: true, endDate: { $gt: Date.now() } })

        const clinicsIds = subscriptionList.map(subscription => subscription.clinicId)
        
        const uniqueClinicIdsSet = new Set(clinicsIds)
        const uniqueClinicIdsList = [...uniqueClinicIdsSet]

        const prescriptions = await PrescriptionModel.aggregate([
            {
                $match: {
                    clinicId: { $in: uniqueClinicIdsList }
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
                    localField: 'survey.doneById',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $project: {
                    'member.password': 0
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ])

        prescriptions.forEach(prescription => {
            prescription.patient = prescription.patient[0]
            prescription.clinic = prescription.clinic[0]
            prescription.doctor = prescription.doctor[0]
            prescription.member = prescription.member[0]
        })
        

        return response.status(200).json({
            accepted: true,
            prescriptions
        })

    } catch(error) {
        console.error(error)
        return response.status(400).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const updatePrescriptionSurvey = async (request, response) => {

    try {

        const { prescriptionId } = request.params
        const { isSurveyed } = request.body

        if(typeof isSurveyed != 'boolean') {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid is surveyed format',
                field: 'isSurveyed'
            })
        }

        const prescription = await PrescriptionModel.findById(prescriptionId)

        if(isSurveyed && prescription.treatmentEndDate && new Date(prescription.treatmentEndDate) > new Date()) {
            return response.status(400).json({
                accepted: false,
                message: 'Treatment date did not pass',
                field: 'prescriptionId'
            })
        }

        let surveyData = {
            survey: {
                isDone: isSurveyed,
                doneById: null,
                doneDate: null
            }
        }

        if(isSurveyed) {
            surveyData = {
                survey: {
                    isDone: isSurveyed,
                    doneById: request.user._id,
                    doneDate: new Date()
                }
            }
        }

        const updatedPrescription = await PrescriptionModel
        .findByIdAndUpdate(prescriptionId, surveyData, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Prescription is surveyed successfully!',
            prescription: updatedPrescription
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
    addPrescription,
    getDoctorPrescriptions, 
    getClinicPrescriptions,
    getPatientPrescriptions, 
    getPatientPrescription,
    getClinicPatientPrescriptions,
    getPrescription, 
    ratePrescription, 
    getPatientLastPrescriptionByCardUUID,
    deletePrescription,
    getPatientDrugs,
    getClinicPatientDrugs,
    updatePrescription,
    sendPrescriptionThroughWhatsapp,
    getFollowupRegisteredClinicsPrescriptions,
    updatePrescriptionSurvey
}