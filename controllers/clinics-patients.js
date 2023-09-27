const ClinicPatientModel = require('../models/ClinicPatientModel')
const clinicPatientValidation = require('../validations/clinics-patients')
const PatientModel = require('../models/PatientModel')
const ClinicModel = require('../models/ClinicModel')
const CardModel = require('../models/CardModel')
const translations = require('../i18n/index')

const getClinicsPatients = async (request, response) => {

    try {

        const clinicsPatients = await ClinicPatientModel.find()

        return response.status(200).json({
            accepted: true,
            clinicsPatients: clinicsPatients
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

const getClinicPatientsByClinicId = async (request, response) => {

    try {

        const { clinicId } = request.params

        const clinicsPatients = await ClinicPatientModel
        .find({ clinicId })
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            clinicsPatients: clinicsPatients
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

const addClinicPatient = async (request, response) => {

    try {

        const dataValidation = clinicPatientValidation.addClinicPatient(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { patientId, clinicId } = request.body

        const patientPromise = PatientModel.findById(patientId)
        const clinicPromise = ClinicModel.findById(clinicId)

        const [patient, clinic] = await Promise.all([patientPromise, clinicPromise])

        if(!patient) {
            return response.status(400).json({
                accepted: false,
                message: 'patient Id does not exists',
                field: 'patientId'
            })
        }

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'clinic Id does not exists',
                field: 'clinicId'
            })
        } 

        const registeredClinicPatientList = await ClinicPatientModel.find({ patientId, clinicId })
        if(registeredClinicPatientList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'patient already registered with clinic',
                field: 'clinicId'
            })
        }

        const clinicPatientData = { patientId, clinicId }
        const clinicPatientObj = new ClinicPatientModel(clinicPatientData)
        const newClinicPatient = await clinicPatientObj.save()


        return response.status(200).json({
            accepted: true,
            message: 'registered patient to clinic successfully!',
            clinicPatient: newClinicPatient
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

const deleteClinicPatient = async (request, response) => {

    try {

        const { lang } = request.query
        const { clinicPatientId } = request.params

        const deletedClinicPatient = await ClinicPatientModel
        .findByIdAndDelete(clinicPatientId)

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Deleted clinic patient access successfully!'],
            clinicPatient: deletedClinicPatient
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

const addClinicPatientByCardId = async (request, response) => {

    try {

        const dataValidation = clinicPatientValidation.addClinicPatientByCardId(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { cardId, cvc, clinicId } = request.body

        const cardList = await CardModel.find({ cardId, cvc })
        if(cardList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Invalid card credentials'],
                field: 'cardId'
            })
        }

        const card = cardList[0]
        if(!card.isActive) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Card is deactivated'],
                field: 'cardId'
            })
        }

        const patientListPromise = PatientModel.find({ cardId })
        const clinicPromise = ClinicModel.findById(clinicId)

        const [patientList, clinic] = await Promise.all([patientListPromise, clinicPromise])

        if(patientList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['No patient is registered with the card'],
                field: 'cardId'
            })
        }

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'clinic Id does not exists',
                field: 'clinicId'
            })
        } 

        const patient = patientList[0]
        const patientId = patient._id

        const registeredClinicPatientList = await ClinicPatientModel.find({ patientId, clinicId })
        if(registeredClinicPatientList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Patient is already registered with clinic'],
                field: 'clinicId'
            })
        }

        const clinicPatientData = { patientId, clinicId }
        const clinicPatientObj = new ClinicPatientModel(clinicPatientData)
        const newClinicPatient = await clinicPatientObj.save()

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Registered patient to clinic successfully!'],
            clinicPatient: newClinicPatient,
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

const setClinicPatientSurveyed = async (request, response) => {

    try {

        const { clinicPatientId } = request.params
        const { isSurveyed } = request.body

        if(typeof isSurveyed != 'boolean') {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid is surveyed format',
                field: 'isSurveyed'
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

        const updatedPatientClinic = await ClinicPatientModel
        .findByIdAndUpdate(clinicPatientId, surveyData, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Clinic patient is surveyed successfully!',
            clinicPatient: updatedPatientClinic
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
    getClinicsPatients,
    getClinicPatientsByClinicId,
    addClinicPatient, 
    deleteClinicPatient, 
    addClinicPatientByCardId,
    setClinicPatientSurveyed
}