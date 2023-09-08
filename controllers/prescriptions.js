const mongoose = require('mongoose')
const PrescriptionModel = require('../models/PrescriptionModel')
const PatientModel = require('../models/PatientModel')
const UserModel = require('../models/UserModel')
const ClinicPatientDoctorModel = require('../models/ClinicPatientDoctorModel')
const CounterModel = require('../models/CounterModel')
const prescriptionValidation = require('../validations/prescriptions')
const ClinicModel = require('../models/ClinicModel')
const config = require('../config/config')
const utils = require('../utils/utils')
const translations = require('../i18n/index')

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

        const updateData = { medicines, notes }

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



module.exports = { 
    addPrescription,
    getDoctorPrescriptions, 
    getClinicPrescriptions,
    getPatientPrescriptions, 
    getPrescription, 
    ratePrescription, 
    getPatientLastPrescriptionByCardUUID,
    deletePrescription,
    getPatientDrugs,
    updatePrescription
}