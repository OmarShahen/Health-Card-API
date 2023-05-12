const mongoose = require('mongoose')
const PrescriptionModel = require('../models/PrescriptionModel')
const PatientModel = require('../models/PatientModel')
const UserModel = require('../models/UserModel')
const prescriptionValidation = require('../validations/prescriptions')
const config = require('../config/config')
const utils = require('../utils/utils')


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

        const { doctorId, patientId } = request.body

        const doctor = await UserModel.findById(doctorId)
        if(!doctor || doctor.role != 'DOCTOR') {
            return response.status(400).json({
                accepted: false,
                message: 'Doctor Id does not exist',
                field: 'doctorId'
            })
        }

        const patient = await PatientModel.findById(patientId)
        if(!patient) {
            return response.status(400).json({
                accepted: false,
                message: 'Patient Id does not exist',
                field: 'patientId'
            })
        }

        const prescriptionObj = new PrescriptionModel(request.body)
        const newPrescription = await prescriptionObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Prescription is recorded successfully',
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

const addPrescriptionByPatientCardId = async (request, response) => {

    try {

        const dataValidation = prescriptionValidation.addPrescriptionByPatientCardId(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { cardId } = request.params
        const { doctorId } = request.body

        const doctor = await UserModel.findById(doctorId)
        if(!doctor || doctor.role != 'DOCTOR') {
            return response.status(400).json({
                accepted: false,
                message: 'Doctor Id does not exist',
                field: 'doctorId'
            })
        }

        const patientList = await PatientModel.find({ cardId })
        if(patientList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Patient card Id does not exists',
                field: 'cardId'
            })
        }

        const patient = patientList[0]
        const prescriptionData = { ...request.body, patientId: patient._id }

        const prescriptionObj = new PrescriptionModel(prescriptionData)
        const newPrescription = await prescriptionObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Prescription is recorded successfully',
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
            message: 'prescription deleted successfully',
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

        const { medicines } = request.body

        const updatedPrescription = await PrescriptionModel
        .findByIdAndUpdate(prescriptionId, { medicines }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'updated prescription successfully!',
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
    addPrescriptionByPatientCardId,
    getDoctorPrescriptions, 
    getPatientPrescriptions, 
    getPrescription, 
    ratePrescription, 
    getPatientLastPrescriptionByCardUUID,
    deletePrescription,
    getPatientDrugs,
    updatePrescription
}