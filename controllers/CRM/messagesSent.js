const MessageSentModel = require('../../models/CRM/MessageSentModel')
const MessageTemplateModel = require('../../models/CRM/MessageTemplateModel')
const LeadModel = require('../../models/CRM/LeadModel')
const CounterModel = require('../../models/CounterModel')
const messageSentValidation = require('../../validations/CRM/messagesSent')
const utils = require('../../utils/utils')


const getMessagesSent = async (request, response) => {

    try {

        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        const messagesSent = await MessageSentModel.aggregate([
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
                $lookup: {
                    from: 'messagetemplates',
                    localField: 'messageTemplateId',
                    foreignField: '_id',
                    as: 'messageTemplate'
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ])

        messagesSent.forEach(message => {
            message.lead = message.lead[0]
            message.messageTemplate = message.messageTemplate[0]
        })

        return response.status(200).json({
            accepted: true,
            messagesSent
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

const addMessageSent = async (request, response) => {

    try {

        const dataValidation = messageSentValidation.addMessageSent(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { leadId, messageTemplateId } = request.body

        const leadPromise = LeadModel.findById(leadId)
        const messageTemplatePromise = MessageTemplateModel.findById(messageTemplateId)

        const [lead, messageTemplate] = await Promise.all([leadPromise, messageTemplatePromise])

        if(!lead) {
            return response.status(400).json({
                accepted: false,
                message: 'Lead ID is not registered',
                field: 'leadId'
            })
        }

        if(!messageTemplate) {
            return response.status(400).json({
                accepted: false,
                message: 'Message template ID is not registered',
                field: 'messageTemplateId'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'MessageSent' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const messageSentData = { messageSentId: counter.value, ...request.body }
        const messageSentObj = new MessageSentModel(messageSentData)
        const newMessageSent = await messageSentObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Message Sent is created successfully!',
            messageSent: newMessageSent
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

const deleteMessageSent = async (request, response) => {

    try {

        const { messageSentId } = request.params

        const deletedMessageSent = await MessageSentModel.findByIdAndDelete(messageSentId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted message sent successfully!',
            messageSent: deletedMessageSent
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

const updateMessageSentCTA = async (request, response) => {

    try {

        const dataValidation = messageSentValidation.updateMessageSentCTA(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { messageSentId } = request.params
        const { isCTADone } = request.body

        const updatedMessageSent = await MessageSentModel
        .findByIdAndUpdate(messageSentId, { isCTADone }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Message Sent CTA is updated successfully!',
            messageSent: updatedMessageSent
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

const updateMessageSentOpen = async (request, response) => {

    try {

        const dataValidation = messageSentValidation.updateMessageSentOpen(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { messageSentId } = request.params
        const { isOpened, openedDate } = request.body

        const updatedMessageSent = await MessageSentModel
        .findByIdAndUpdate(messageSentId, { isOpened, openedDate }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Message Sent open is updated successfully!',
            messageSent: updatedMessageSent
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

const updateMessageSentRespond = async (request, response) => {

    try {

        const dataValidation = messageSentValidation.updateMessageSentRespond(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { messageSentId } = request.params
        const { isResponded, respondedDate } = request.body

        const updatedMessageSent = await MessageSentModel
        .findByIdAndUpdate(messageSentId, { isResponded, respondedDate }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Message Sent respond is updated successfully!',
            messageSent: updatedMessageSent
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
    getMessagesSent, 
    addMessageSent, 
    deleteMessageSent,
    updateMessageSentCTA,
    updateMessageSentOpen,
    updateMessageSentRespond
}