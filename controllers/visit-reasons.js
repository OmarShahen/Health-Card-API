const VisitReasonModel = require('../models/VisitReasonModel')
const CounterModel = require('../models/CounterModel')
const visitReasonValidation = require('../validations/visit-reasons')

const getVisitReasons = async (request, response) => {

    try {

        const visitReasons = await VisitReasonModel.find()

        return response.status(200).json({
            accepted: true,
            visitReasons
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

const addVisitReason = async (request, response) => {

    try {

        const dataValidation = visitReasonValidation.addVisitReason(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { name, description } = request.body

        const nameList = await VisitReasonModel.find({ name })
        if(nameList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'visit reason name is already registered',
                field: 'name'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'visitReason' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const visitReasonData = { visitReasonId: counter.value, name, description }
        const visitReasonObj = new VisitReasonModel(visitReasonData)
        const newVisitReason = await visitReasonObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'added visit reason successfully!',
            visitReason: newVisitReason
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

const deleteVisitReason = async (request, response) => {

    try {

        const { visitReasonId } = request.params

        const deletedVisitReason = await VisitReasonModel.findByIdAndDelete(visitReasonId)

        return response.status(200).json({
            accepted: true,
            message: 'deleted visit reason successfully!',
            visitReason: deletedVisitReason
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

const deleteVisitReasons = async (request, response) => {

    try {

        const deletedVisitReasons = await VisitReasonModel.deleteMany({})

        return response.status(200).json({
            accepted: true,
            message: 'deleted all records successfully!',
            noOfDeletedRecords: deletedVisitReasons.deletedCount
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

const updateVisitReason = async (request, response) => {

    try {

        const dataValidation = visitReasonValidation.updateVisitReason(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { visitReasonId } = request.params
        const { name, description } = request.body

        const visitReason = await VisitReasonModel.findById(visitReasonId)

        if(name != visitReason.name) {

            const nameList = await VisitReasonModel.find({ name })
            if(nameList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'visit reason name is already registered',
                    field: 'name'
                })
            }
        }

        const visitReasonData = { name, description }
        const updatedVisitReason = await VisitReasonModel
        .findByIdAndUpdate(visitReasonId, visitReasonData, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'updated visit reason successfully!',
            visitReason: updatedVisitReason
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
    getVisitReasons, 
    addVisitReason, 
    deleteVisitReason,
    deleteVisitReasons,
    updateVisitReason
}