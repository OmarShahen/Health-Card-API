const MedicationChallengeModel = require('../../models/medication-challenges/MedicationChallenges')
const CounterModel = require('../../models/CounterModel')
const TreatmentSurveyModel = require('../../models/followup-service/TreatmentSurveyModel')
const medicationChallengeValidation = require('../../validations/medication-challenges/medication-challenges')


const getMedicationChallenges = async (request, response) => {

    try {

        const { category } = request.query

        const searchQuery = category ? { category } : {}

        const medicationChallenges = await MedicationChallengeModel
        .find(searchQuery)
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            medicationChallenges  
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: errror.message
        })
    }
}


const addMedicationChallenge = async (request, response) => {

    try {

        const dataValidation = medicationChallengeValidation.addMedicationChallenge(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { name, description, category } = request.body

        const medicationChallengesList = await MedicationChallengeModel.find({ name, category })
        if(medicationChallengesList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Medication challenge name is already registered',
                field: 'name'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: `medicationChallenge` },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const medicationChallengeData = { 
            medicationChallengeId: counter.value, 
            name, 
            description, 
            category 
        }
        const medicationChallengeObj = new MedicationChallengeModel(medicationChallengeData)
        const newMedicationChallenge = await medicationChallengeObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'New medication challenge is added successfully!',
            medicationChallenge: newMedicationChallenge
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

const updateMedicationChallenge = async (request, response) => {

    try {

        const dataValidation = medicationChallengeValidation.updateMedicationChallenge(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { medicationChallengeId } = request.params
        const { name, description, category } = request.body

        const medicalChalllenge = await MedicationChallengeModel.findById(medicationChallengeId)

        if(name != medicalChalllenge.name && medicalChalllenge.category == category) {

            const nameList = await MedicationChallengeModel.find({ name, category })
            if(nameList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Medication challenge name is already registered',
                    field: 'name'
                })
            }
        }

        const medicationChallengeData = { name, description, category }
        const updatedMedicationChallenge = await MedicationChallengeModel
        .findByIdAndUpdate(medicationChallengeId, medicationChallengeData, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated medication challenge successfully!',
            medicationChallenge: updatedMedicationChallenge
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

const deleteMedicationChallenge = async (request, response) => {

    try {

        const { medicationChallengeId } = request.params

        const treatmentsSurveys = await TreatmentSurveyModel
        .find({
            $or: [
                { challengesTakingMedication: { $in: [medicationChallengeId] } },
                { challengesObtainingMedication: { $in: [medicationChallengeId] } }
            ]
        })
        
        if(treatmentsSurveys.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Medication challenge is registered with treatment survey',
                field: 'medicationChallengeId'
            })
        }

        const deletedMedicationChallenge = await MedicationChallengeModel.findByIdAndDelete(medicationChallengeId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted medication challenge successfully!',
            medicationChallenge: deletedMedicationChallenge
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
    getMedicationChallenges, 
    addMedicationChallenge, 
    updateMedicationChallenge, 
    deleteMedicationChallenge 
}