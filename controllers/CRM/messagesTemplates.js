const MessageTemplateModel = require('../../models/CRM/MessageTemplateModel')
const CounterModel = require('../../models/CounterModel')
const MessageTemplateValidation = require('../../validations/CRM/messagesTemplates')
const utils = require('../../utils/utils')

const getMessagesTemplates = async (request, response) => {

    try {

        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        const messagesTemplates = await MessageTemplateModel
        .find(searchQuery)
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            messagesTemplates
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

const addMessageTemplate = async (request, response) => {

    try {

        const dataValidation = MessageTemplateValidation.addMessageTemplate(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { name, category } = request.body

        const messageTemplateList = await MessageTemplateModel.find({ name, category })
        if(messageTemplateList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Name is already registered',
                field: 'name'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'MessageTemplate' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const messageTemplateData = { messageTemplateId: counter.value, ...request.body }
        const messageTemplateObj = new MessageTemplateModel(messageTemplateData)
        const newMessageTemplate = await messageTemplateObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Message template is added successfully!',
            messageTemplate: newMessageTemplate
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

const updateMessageTemplate = async (request, response) => {

    try {

        const dataValidation = MessageTemplateValidation.updateMessageTemplate(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { messageTemplateId } = request.params
        const { name, category } = request.body

        const messageTemplate = await MessageTemplateModel.findById(messageTemplateId)
        if(messageTemplate.name != name) {
            const messageTemplateList = await MessageTemplateModel.find({ name, category })
            if(messageTemplateList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Name is already registered',
                    field: 'name'
                })
            }
        }
        
        const updatedMessageTemplate = await MessageTemplateModel
        .findByIdAndUpdate(messageTemplateId, request.body, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Message template is updated successfully!',
            messageTemplate: updatedMessageTemplate
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

const deleteMessageTemplate = async (request, response) => {

    try {

        const { messageTemplateId } = request.params

        const deletedMessageTemplate = await MessageTemplateModel.findByIdAndDelete(messageTemplateId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted message template successfully!',
            messageTemplate: deletedMessageTemplate
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

module.exports = { getMessagesTemplates, addMessageTemplate, updateMessageTemplate, deleteMessageTemplate }