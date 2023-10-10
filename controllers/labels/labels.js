const LabelModel = require('../../models/labels/LabelModel')
const ClinicPatientModel = require('../../models/ClinicPatientModel')
const labelValidation = require('../../validations/labels/labels')
const mongoose = require('mongoose')


const getLabels = async (request, response) => {

    try {

        const labels = await LabelModel
        .find()
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            labels
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


const addLabel = async (request, response) => {

    try {

        const dataValidation = labelValidation.addLabel(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { name } = request.body

        const labelsList = await LabelModel.find({ name })
        if(labelsList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Label name is already registered',
                field: 'name'
            })
        }

        const labelData = { name }
        const labelObj = new LabelModel(labelData)
        const newLabel = await labelObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'New label is added successfully!',
            label: newLabel
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

const updateLabel = async (request, response) => {

    try {

        const dataValidation = labelValidation.updateLabel(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { labelId } = request.params
        const { name } = request.body

        const label = await LabelModel.findById(labelId)

        if(name != label.name) {

            const nameList = await LabelModel.find({ name })
            if(nameList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Label name is already registered',
                    field: 'name'
                })
            }
        }

        const labelData = { name }
        const updatedLabel = await LabelModel
        .findByIdAndUpdate(labelId, labelData, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated label successfully!',
            label: updatedLabel
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

const deleteLabel = async (request, response) => {

    try {

        const { labelId } = request.params

        const clinicsPatientsList = await ClinicPatientModel
        .find({ labels: mongoose.Types.ObjectId(labelId) })
        
        if(clinicsPatientsList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Label is registered with entities',
                field: 'labelId'
            })
        }

        const deletedLabel = await LabelModel.findByIdAndDelete(labelId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted label successfully!',
            label: deletedLabel
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

module.exports = { getLabels, addLabel, updateLabel, deleteLabel }