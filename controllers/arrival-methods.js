const ArrivalMethodModel = require('../models/ArrivalMethodModel')
const ClinicPatientModel = require('../models/ClinicPatientModel')
const PatientSurveyModel = require('../models/followup-service/PatientSurveyModel')
const arrivalMethodValidation = require('../validations/arrival-methods')

const getArrivalMethods = async (request, response) => {

    try {

        const arrivalMethods = await ArrivalMethodModel
        .find()
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            arrivalMethods
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

const addArrivalMethod = async (request, response) => {

    try {

        const dataValidation = arrivalMethodValidation.addArrivalMethod(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { name } = request.body

        const arrivalMethodsList = await ArrivalMethodModel.find({ name })
        if(arrivalMethodsList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Arrival name is already registered',
                field: 'name'
            })
        }

        const arrivalMethodData = { name }
        const arrivalMethodObj = new ArrivalMethodModel(arrivalMethodData)
        const newArrivalMethod = await arrivalMethodObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'New arrival method is added successfully!',
            arrivalMethod: newArrivalMethod
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

const updateArrivalMethod = async (request, response) => {

    try {

        const dataValidation = arrivalMethodValidation.updateArrivalMethod(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { arrivalMethodId } = request.params
        const { name } = request.body

        const arrivalMethod = await ArrivalMethodModel.findById(arrivalMethodId)

        if(name != arrivalMethod.name) {

            const nameList = await ArrivalMethodModel.find({ name })
            if(nameList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Arrival method name is already registered',
                    field: 'name'
                })
            }
        }

        const arrivalMethodData = { name }
        const updatedArrivalMethod = await ArrivalMethodModel
        .findByIdAndUpdate(arrivalMethodId, arrivalMethodData, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated arrival method successfully!',
            arrivalMethod: updatedArrivalMethod
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

const deleteArrivalMethod = async (request, response) => {

    try {

        const { arrivalMethodId } = request.params

        const patientsSurveysList = await PatientSurveyModel.find({ arrivalMethodId })
        
        if(patientsSurveysList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Arrival method is registered with patients surveys',
                field: 'arrivalMethodId'
            })
        }

        const deletedArrivalMethod = await ArrivalMethodModel.findByIdAndDelete(arrivalMethodId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted arrival method successfully!',
            arrivalMethod: deletedArrivalMethod
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
    getArrivalMethods, 
    addArrivalMethod, 
    updateArrivalMethod, 
    deleteArrivalMethod 
}