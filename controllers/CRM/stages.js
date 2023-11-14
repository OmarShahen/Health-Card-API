const StageModel = require('../../models/CRM/StageModel')
const LeadModel = require('../../models/CRM/LeadModel')
const CounterModel = require('../../models/CounterModel')
const stageValidation = require('../../validations/CRM/stages')
const utils = require('../../utils/utils')

const getStages = async (request, response) => {

    try {

        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)
        
        const stages = await StageModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'leads',
                    localField: 'leadId',
                    foreignField: '_id',
                    as: 'lead'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        stages.forEach(stage => stage.lead = stage.lead[0])        

        return response.status(200).json({
            accepted: true,
            stages
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

const getStagesByLeadId = async (request, response) => {

    try {

        const { leadId } = request.params

        const { searchQuery } = utils.statsQueryGenerator('leadId', leadId, request.query)
        
        const stages = await StageModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'leads',
                    localField: 'leadId',
                    foreignField: '_id',
                    as: 'lead'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        stages.forEach(stage => stage.lead = stage.lead[0])        

        return response.status(200).json({
            accepted: true,
            stages
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

const addStage = async (request, response) => {

    try {
        
        const dataValidation = stageValidation.addStage(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { leadId } = request.body

        const lead = await LeadModel.findById(leadId)
        if(!lead) {
            return response.status(400).json({
                accepted: false,
                message: 'Lead ID is not registered',
                field: 'leadId'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'Stage' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const stageData = { stageId: counter.value, ...request.body }
        const stageObj = new StageModel(stageData)
        const newStage = await stageObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Stage is added successfully!',
            stage: newStage
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

const updateStage = async (request, response) => {

    try {
        
        const dataValidation = stageValidation.updateStage(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { stageId } = request.params
        const { stage, note } = request.body

        const updatedStage = await StageModel.findByIdAndUpdate(stageId, { stage, note }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Stage is updated successfully!',
            stage: updatedStage
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

const deleteStage = async (request, response) => {

    try {
        
        const { stageId } = request.params    
        
        const deletedStage = await StageModel.findByIdAndDelete(stageId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted stage successfully!',
            stage: deletedStage
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
    getStages, 
    getStagesByLeadId,
    addStage, 
    updateStage,
    deleteStage 
}