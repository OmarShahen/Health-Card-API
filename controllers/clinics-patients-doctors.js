const ClinicPatientModel = require('../models/ClinicPatientModel')
const clinicPatientValidation = require('../validations/clinics-patients-doctors')
const PatientModel = require('../models/PatientModel')
const ClinicModel = require('../models/ClinicModel')
const UserModel = require('../models/UserModel')
const ClinicPatientDoctorModel = require('../models/ClinicPatientDoctorModel')
const CardModel = require('../models/CardModel')
const translations = require('../i18n/index')


const getClinicsPatientsDoctors = async (request, response) => {

    try {

        const clinicsPatientsDoctors = await ClinicPatientDoctorModel.find()

        return response.status(200).json({
            accepted: true,
            clinicsPatientsDoctors
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


const addClinicPatientDoctor = async (request, response) => {

    try {

        const dataValidation = clinicPatientValidation.addClinicPatientDoctor(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { patientId, clinicId, doctorId } = request.body

        const patientPromise = PatientModel.findById(patientId)
        const clinicPromise = ClinicModel.findById(clinicId)
        const doctorPromise = UserModel.findById(doctorId)

        const [patient, clinic, doctor] = await Promise.all([patientPromise, clinicPromise, doctorPromise])

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

        if(!doctor) {
            return response.status(400).json({
                accepted: false,
                message: 'doctor Id does not exists',
                field: 'doctorId'
            })
        } 


        const registeredClinicPatientDoctorList = await ClinicPatientDoctorModel.find({ patientId, clinicId, doctorId })
        if(registeredClinicPatientDoctorList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'patient already registered with doctor in the clinic',
                field: 'doctorId'
            })
        }

        const registeredClinicPatientList = await ClinicPatientModel.find({ patientId, clinicId })
        let newClinicPatient
        if(registeredClinicPatientList.length == 0) {
            const clinicPatientData = { patientId, clinicId }
            const clinicPatientObj = new ClinicPatientModel(clinicPatientData)
            newClinicPatient = await clinicPatientObj.save()
        }


        const clinicPatienDoctortData = { patientId, clinicId, doctorId }
        const clinicPatientDoctorObj = new ClinicPatientDoctorModel(clinicPatienDoctortData)
        const newClinicPatientDoctor = await clinicPatientDoctorObj.save()


        return response.status(200).json({
            accepted: true,
            message: 'registered patient with doctor in clinic successfully!',
            clinicPatientDoctor: newClinicPatientDoctor,
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

const addClinicPatientDoctorByCardId = async (request, response) => {

    try {

        const dataValidation = clinicPatientValidation.addClinicPatientDoctorByCardId(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { lang } = request.query
        const { cardId, cvc, clinicId, doctorId } = request.body

        const cardList = await CardModel.find({ cardId, cvc })
        if(cardList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Invalid card credentials'],
                field: 'cardId'
            })
        }

        const card = cardList[0]
        if(!card.isActive) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Card is deactivated'],
                field: 'cardId'
            })
        }

        const patientListPromise = PatientModel.find({ cardId })
        const clinicPromise = ClinicModel.findById(clinicId)
        const doctorPromise = UserModel.findById(doctorId)

        const [patientList, clinic, doctor] = await Promise.all([patientListPromise, clinicPromise, doctorPromise])

        if(patientList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['No patient is registered with the card'],
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

        if(!doctor) {
            return response.status(400).json({
                accepted: false,
                message: 'doctor Id does not exists',
                field: 'doctorId'
            })
        } 

        const patient = patientList[0]
        const patientId = patient._id

        const registeredClinicPatientDoctorList = await ClinicPatientDoctorModel.find({ patientId, clinicId, doctorId })
        if(registeredClinicPatientDoctorList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Patient is already registered with doctor in the clinic'],
                field: 'doctorId'
            })
        }

        const registeredClinicPatientList = await ClinicPatientModel.find({ patientId, clinicId })
        let newClinicPatient
        if(registeredClinicPatientList.length == 0) {
            const clinicPatientData = { patientId, clinicId }
            const clinicPatientObj = new ClinicPatientModel(clinicPatientData)
            newClinicPatient = await clinicPatientObj.save()
        }


        const clinicPatienDoctortData = { patientId, clinicId, doctorId }
        const clinicPatientDoctorObj = new ClinicPatientDoctorModel(clinicPatienDoctortData)
        const newClinicPatientDoctor = await clinicPatientDoctorObj.save()


        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Registered patient with doctor in clinic successfully!'],
            clinicPatientDoctor: newClinicPatientDoctor,
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

const deleteClinicPatientDoctor = async (request, response) => {

    try {

        const { lang } = request.query
        const { clinicPatientDoctorId } = request.params

        const deletedClinicPatientDoctor = await ClinicPatientDoctorModel
        .findByIdAndDelete(clinicPatientDoctorId)

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Deleted clinic patient doctor access successfully!'],
            clinicPatientDoctor: deletedClinicPatientDoctor
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
    getClinicsPatientsDoctors, 
    addClinicPatientDoctor, 
    addClinicPatientDoctorByCardId, 
    deleteClinicPatientDoctor 
}