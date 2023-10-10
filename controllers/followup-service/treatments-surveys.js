const TreatmentSurveyModel = require('../../models/followup-service/TreatmentSurveyModel')
const MedicationChallengeModel = require('../../models/medication-challenges/MedicationChallenges')
const PatientModel = require('../../models/PatientModel')
const ClinicModel = require('../../models/ClinicModel')
const UserModel = require('../../models/UserModel')
const CallModel = require('../../models/followup-service/CallModel')
const CounterModel = require('../../models/CounterModel')
const treatmentSurveyValidation = require('../../validations/followup-service/treatments-surveys')
const utils = require('../../utils/utils')


const getTreatmentsSurveys = async (request, response) => {

    try {

        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)
        
        const treatmentsSurveys = await TreatmentSurveyModel.aggregate([
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
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'doneById',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $project: {
                    'patient.emergencyContacts': 0,
                    'patient.healthHistory': 0,
                    'member.password': 0
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        treatmentsSurveys.forEach(treatmentSurvey => {
            treatmentSurvey.patient = treatmentSurvey.patient[0]
            treatmentSurvey.member = treatmentSurvey.member[0]
            treatmentSurvey.clinic = treatmentSurvey.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            treatmentsSurveys
        })

    } catch(error) {
        console.error(error)
        return response.status(400).json({
            accepted: false,
            messsage: 'internal server error',
            error: error.message
        })
    }
}

const getTreatmentsSurveysByPatientId = async (request, response) => {

    try {

        const { patientId } = request.params

        const { searchQuery } = utils.statsQueryGenerator('patientId', patientId, request.query)
        
        const treatmentsSurveys = await TreatmentSurveyModel.aggregate([
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
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'doneById',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $project: {
                    'patient.emergencyContacts': 0,
                    'patient.healthHistory': 0,
                    'member.password': 0
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        treatmentsSurveys.forEach(treatmentSurvey => {
            treatmentSurvey.patient = treatmentSurvey.patient[0]
            treatmentSurvey.member = treatmentSurvey.member[0]
            treatmentSurvey.clinic = treatmentSurvey.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            treatmentsSurveys
        })

    } catch(error) {
        console.error(error)
        return response.status(400).json({
            accepted: false,
            messsage: 'internal server error',
            error: error.message
        })
    }
}

const getTreatmentsSurveysByClinicId = async (request, response) => {

    try {

        const { clinicId } = request.params

        const { searchQuery } = utils.statsQueryGenerator('clinicId', clinicId, request.query)
        
        const treatmentsSurveys = await TreatmentSurveyModel.aggregate([
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
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'doneById',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $project: {
                    'patient.emergencyContacts': 0,
                    'patient.healthHistory': 0,
                    'member.password': 0
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        treatmentsSurveys.forEach(treatmentSurvey => {
            treatmentSurvey.patient = treatmentSurvey.patient[0]
            treatmentSurvey.member = treatmentSurvey.member[0]
            treatmentSurvey.clinic = treatmentSurvey.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            treatmentsSurveys
        })

    } catch(error) {
        console.error(error)
        return response.status(400).json({
            accepted: false,
            messsage: 'internal server error',
            error: error.message
        })
    }
}

const addTreatmentSurvey = async (request, response) => {

    try {

        const dataValidation = treatmentSurveyValidation.addTreatmentSurvey(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clinicId, patientId, doneById, callDuration, challengesTakingMedication, challengesObtainingMedication } = request.body

        const memberPromise = UserModel.findById(doneById)
        const patientPromise = PatientModel.findById(patientId)
        const clinicPromise = ClinicModel.findById(clinicId)

        const [member, patient, clinic] = await Promise.all([memberPromise, patientPromise, clinicPromise])

        if(!member) {
            return response.status(400).json({
                accepted: false,
                message: 'Member ID does not exist',
                field: 'doneById'
            })
        }
        
        if(!patient) {
            return response.status(400).json({
                accepted: false,
                message: 'Patient ID does not exist',
                field: 'patientId'
            })
        }   

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic ID does not exist',
                field: 'clinicId'
            })
        } 

        if(challengesTakingMedication && challengesTakingMedication.length != 0) {
            const medicationChallenges = await MedicationChallengeModel.find({ _id: { $in: challengesTakingMedication } })
            if(medicationChallenges.length == 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Challenges Ids is not valid',
                    field: 'challengesTakingMedication'
                })
            }
        }

        if(challengesObtainingMedication && challengesObtainingMedication.length != 0) {
            const medicationChallenges = await MedicationChallengeModel.find({ _id: { $in: challengesObtainingMedication } })
            if(medicationChallenges.length == 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Challenges Ids is not valid',
                    field: 'challengesObtainingMedication'
                })
            }
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'TreatmentSurvey' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const treatmentSurveyData = { treatmentSurveyId: counter.value, ...request.body }
        const TreatmentSurveyObj = new TreatmentSurveyModel(treatmentSurveyData)
        const newTreatmentSurvey = await TreatmentSurveyObj.save()

        let newCall = {}

        if(callDuration) {

            const counter = await CounterModel.findOneAndUpdate(
                { name: 'call' },
                { $inc: { value: 1 } },
                { new: true, upsert: true }
            )

            const callData = {
                callId: counter.value,
                patientId,
                clinicId,
                doneById,
                treatmentSurveyId: newTreatmentSurvey._id,
                duration: callDuration
            }

            const callObj = new CallModel(callData)
            newCall = await callObj.save()
        }

        return response.status(200).json({
            accepted: true,
            message: 'Added treatment survey successfully!',
            treatmentSurvey: newTreatmentSurvey
        })

    } catch(error) {
        console.error(error)
        return response.status(400).json({
            accepted: false,
            messsage: 'internal server error',
            error: error.message
        })
    }
}

const updateTreatmentSurvey = async (request, response) => {

    try {

        const { treatmentSurveyId } = request.params
        const { challengesTakingMedication, challengesObtainingMedication } = request.body

        const dataValidation = treatmentSurveyValidation.updateTreatmentSurvey(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        if(challengesTakingMedication && challengesTakingMedication.length != 0) {
            const medicationChallenges = await MedicationChallengeModel.find({ _id: { $in: challengesTakingMedication } })
            if(medicationChallenges.length == 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Challenges Ids is not valid',
                    field: 'challengesTakingMedication'
                })
            }
        }

        if(challengesObtainingMedication && challengesObtainingMedication.length != 0) {
            const medicationChallenges = await MedicationChallengeModel.find({ _id: { $in: challengesObtainingMedication } })
            if(medicationChallenges.length == 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Challenges Ids is not valid',
                    field: 'challengesObtainingMedication'
                })
            }
        }

        const updatedTreatmentSurvey = await TreatmentSurveyModel.findByIdAndUpdate(treatmentSurveyId, request.body, { new: true })
        
        return response.status(200).json({
            accepted: true,
            message: 'Updated treatment survey successfully!',
            treatmentSurvey: updatedTreatmentSurvey
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


const deleteTreatmentSurvey = async (request, response) => {

    try {

        const { treatmentSurveyId } = request.params

        const deletedTreatmentSurvey = await TreatmentSurveyModel.findByIdAndDelete(treatmentSurveyId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted treatment survey successfully!',
            treatmentSurvey: deletedTreatmentSurvey,
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
    getTreatmentsSurveys, 
    getTreatmentsSurveysByPatientId,
    getTreatmentsSurveysByClinicId,
    addTreatmentSurvey, 
    updateTreatmentSurvey,
    deleteTreatmentSurvey 
}