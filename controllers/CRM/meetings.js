const MeetingModel = require('../../models/CRM/MeetingModel')
const LeadModel = require('../../models/CRM/LeadModel')
const CounterModel = require('../../models/CounterModel')
const meetingsValidation = require('../../validations/CRM/meetings')
const utils = require('../../utils/utils')
const mongoose = require('mongoose')


const getMeetings = async (request, response) => {

    try {

        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        const meetings = await MeetingModel.aggregate([
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
            }
        ])

        meetings.forEach(meeting => meeting.lead = meeting.lead[0])

        return response.status(200).json({
            accepted: true,
            meetings
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

const getMeetingsByLeadId = async (request, response) => {

    try {

        const { leadId } = request.params

        const meetings = await MeetingModel.aggregate([
            {
                $match: { leadId: mongoose.Types.ObjectId(leadId) }
            },
            {
                $lookup: {
                    from: 'leads',
                    localField: 'leadId',
                    foreignField: '_id',
                    as: 'lead'
                }
            }
        ])

        meetings.forEach(meeting => meeting.lead = meeting.lead[0])

        return response.status(200).json({
            accepted: true,
            meetings
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

const addMeeting = async (request, response) => {

    try {

        const dataValidation = meetingsValidation.addMeeting(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }
        
        const { leadId, status, reservationTime, note } = request.body

        const lead = await LeadModel.findById(leadId)
        if(!lead) {
            return response.status(400).json({
                accepted: false,
                message: 'Lead ID does not exist',
                field: 'leadId'
            })
        }
        

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'meeting' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const meetingData = {
            meetingId: counter.value,
            leadId,
            status,
            reservationTime,
            note
        }

        const meetingObj = new MeetingModel(meetingData)
        const newMeeting = await meetingObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Added new meeting successfully!',
            meeting: newMeeting
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

const updateMeeting = async (request, response) => {

    try {

        const dataValidation = meetingsValidation.updateMeeting(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }
        
        const { meetingId } = request.params
        const { status, note } = request.body
        
        const updatedMeeting = await MeetingModel.findByIdAndUpdate(meetingId, { status, note }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated meeting successfully!',
            meeting: updatedMeeting
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

const deleteMeeting = async (request, response) => {

    try {

        const { meetingId } = request.params
        
        const deletedMeeting = await MeetingModel.findByIdAndDelete(meetingId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted meeting successfully!',
            meeting: deletedMeeting
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
    getMeetings, 
    getMeetingsByLeadId, 
    addMeeting, 
    updateMeeting, 
    deleteMeeting 
}