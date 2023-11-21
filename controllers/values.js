const ValueModel = require('../models/ValueModel')
const valueValidation = require('../validations/values')
const CounterModel = require('../models/CounterModel')



const getValues = async (request, response) => {

    try {

        const { entity } = request.query

        const searchQuery = entity ? { entity } : {}

        const values = await ValueModel
        .find(searchQuery)
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            values
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

const addValue = async (request, response) => {

    try {

        const dataValidation = valueValidation.addValue(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { value, entity } = request.body

        const valueList = await ValueModel.find({ value, entity })
        if(valueList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'value is already registered with this entity',
                field: 'value'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'Value' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )
            
        const valueData = { valueId: counter.value, ...request.body }
        const valueObj = new ValueModel(valueData)
        const newValue = await valueObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Added value successfully!',
            value: newValue
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

const deleteValue = async (request, response) => {

    try {

        const { valueId } = request.params

        const deletedValue = await ValueModel.findByIdAndDelete(valueId)

        return response.status(200).json({
            accepted: true,
            message: 'Value is deleted successfully!',
            value: deletedValue
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

const updateValueValue = async (request, response) => {

    try {

        const dataValidation = valueValidation.updateValueValue(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { valueId } = request.params

        const value = await ValueModel.findById(valueId)

        if(value.value != request.body.value) {
            const valueList = await ValueModel.find({ value: request.body.value, entity: value.entity })
            if(valueList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'value is already registered with this entity',
                    field: 'value'
                })
            }
        }

        const updatedValue = await ValueModel
        .findByIdAndUpdate(valueId, { value: request.body.value }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated value successfully!',
            value: updatedValue
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

module.exports = { getValues, addValue, deleteValue, updateValueValue }