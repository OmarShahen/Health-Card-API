const LeadModel = require('../../models/CRM/LeadModel')
const StageModel = require('../../models/CRM/StageModel')
const SpecialityModel = require('../../models/SpecialityModel')
const CounterModel = require('../../models/CounterModel')
const leadValidation = require('../../validations/CRM/leads')
const utils = require('../../utils/utils')
const mongoose = require('mongoose')

const getLeads = async (request, response) => {

    try {

        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)
        const limit = 10

        const leads = await LeadModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $sort: {
                    updatedAt: -1
                }
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'specialityId',
                    foreignField: '_id',
                    as: 'speciality'
                }
            }
        ])

        leads.forEach(lead => lead.speciality = lead.speciality[0])

        const totalLeads = await LeadModel.countDocuments(searchQuery)
        const totalOpened = await LeadModel.countDocuments({ ...searchQuery, status: 'OPENED' })
        const totalClosed = await LeadModel.countDocuments({ ...searchQuery, status: 'CLOSED' })
        const totalWon = await LeadModel.countDocuments({ ...searchQuery, status: 'WON' })
        const totalLost = await LeadModel.countDocuments({ ...searchQuery, status: 'LOST' })

        const totalAmount = await LeadModel.aggregate([
            {
                $match: { ...searchQuery, status: 'OPENED' }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$value' }
                }
            }
        ])

        const potentialEarnings = totalAmount.length == 0 ? 0 : totalAmount[0].totalAmount

        return response.status(200).json({
            accepted: true,
            totalLeads,
            totalOpened,
            totalClosed,
            totalWon,
            totalLost,
            potentialEarnings,
            leads
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

const getLeadById = async (request, response) => {

    try {

        const { leadId } = request.params

        const leads = await LeadModel.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(leadId) }
            },
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'specialityId',
                    foreignField: '_id',
                    as: 'speciality'
                }
            }
        ])

        leads.forEach(lead => lead.speciality = lead.speciality[0])

        return response.status(200).json({
            accepted: true,
            lead: leads[0]
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

const searchLeads = async (request, response) => {

    try {

        let { name } = request.query

        name = name ? name : ''

        const leads = await LeadModel.aggregate([
            {
                $match: {
                    $or: [
                        { name: { $regex: name, $options: 'i' } },
                    ]
                }
            },
            {
                $limit: 10
            }
        ])

        return response.status(200).json({
            accepted: true,
            leads
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

const filterLeads = async (request, response) => {

    try {

        const { status, stage } = request.query

        let searchQuery = {}

        if(status) {
            searchQuery = { status }
        }

        if(stage) {
            searchQuery = { ...searchQuery, stage }
        }

        const leads = await LeadModel
        .find(searchQuery)
        .sort({ updatedAt: -1 })

        return response.status(200).json({
            accepted: true,
            leads
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

const addLead = async (request, response) => {

    try {

        const dataValidation = leadValidation.addLead(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }
        
        const { name, countryCode, phone, clinicName, clinicCountryCode, clinicPhone, specialityId } = request.body

        const leadsNameList = await LeadModel.find({ name })
        if(leadsNameList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Lead name is already registered',
                field: 'name'
            })
        }

        if(countryCode && phone) {
            const leadPhoneList = await LeadModel.find({ countryCode, phone })
            if(leadPhoneList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Lead phone is already registered',
                    field: 'phone'
                })
            }
        }

        if(clinicName) {
            const leadsClinicNameList = await LeadModel.find({ 'clinic.name': clinicName })
            if(leadsClinicNameList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Lead clinic name is already registered',
                    field: 'clinicName'
                })
            }
        }

        if(clinicCountryCode && clinicPhone) {
            const leadClinicPhoneList = await LeadModel
            .find({ 'clinic.countryCode': clinicCountryCode, 'clinic.phone': clinicPhone })
            if(leadClinicPhoneList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Lead clinic phone is already registered',
                    field: 'clinicPhone'
                })
            }
        }

        if(specialityId) {
            const speciality = await SpecialityModel.findById(specialityId)
            if(!speciality) {
                return response.status(400).json({
                    accepted: false,
                    message: 'invalid speciality Id',
                    field: 'specialityId'
                })
            }

            request.body.specialityId = speciality._id
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'lead' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const leadData = { 
            leadId: counter.value, 
            ...request.body,
            clinic: { 
                name: clinicName,
                countryCode: clinicCountryCode,
                phone: clinicPhone
            }
        }

        const leadObj = new LeadModel(leadData)
        const newLead = await leadObj.save()

        let newStage

        if(request.body.status == 'OPENED') {
            const counter = await CounterModel.findOneAndUpdate(
                { name: 'Stage' },
                { $inc: { value: 1 } },
                { new: true, upsert: true }
            )
            const stageData = { stageId: counter.value, leadId: newLead._id, stage: request.body.status }
            const stageObj = new StageModel(stageData)
            newStage = await stageObj.save()
        }

        return response.status(200).json({
            accepted: true,
            message: 'Added new lead successfully!',
            lead: newLead,
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

const updateLead = async (request, response) => {

    try {

        const dataValidation = leadValidation.updateLead(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }
        
        const { leadId } = request.params
        const { name, countryCode, phone, clinicName, clinicCountryCode, clinicPhone, specialityId } = request.body

        const lead = await LeadModel.findById(leadId)

        if(name && name != lead.name) {
            const leadsNameList = await LeadModel.find({ name })
            if(leadsNameList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Lead name is already registered',
                    field: 'name'
                })
            }
        }

        if(countryCode == lead.countryCode && phone != lead.phone) {
            const leadPhoneList = await LeadModel.find({ countryCode, phone })
            if(leadPhoneList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Lead phone is already registered',
                    field: 'phone'
                })
            }
        }

        if(clinicName != lead?.clinic?.name) {
            const leadsClinicNameList = await LeadModel.find({ 'clinic.name': clinicName })
            if(leadsClinicNameList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Lead clinic name is already registered',
                    field: 'clinicName'
                })
            }
        }

        if(clinicCountryCode == lead?.clinic?.countryCode && clinicPhone != lead?.clinic?.phone) {
            const leadClinicPhoneList = await LeadModel
            .find({ 'clinic.countryCode': clinicCountryCode, 'clinic.phone': clinicPhone })
            if(leadClinicPhoneList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Lead clinic phone is already registered',
                    field: 'clinicPhone'
                })
            }
        }

        if(specialityId) {
            const speciality = await SpecialityModel.findById(specialityId)
            if(!speciality) {
                return response.status(400).json({
                    accepted: false,
                    message: 'invalid speciality ID',
                    field: 'specialityId'
                })
            }

            request.body.specialityId = speciality._id
        }

        const leadData = { 
            ...request.body,
            clinic: { 
                name: clinicName,
                countryCode: clinicCountryCode,
                phone: clinicPhone
            }
        }
        
        const updatedLead = await LeadModel.findByIdAndUpdate(leadId, leadData, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated lead successfully!',
            lead: updatedLead
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

const deleteLead = async (request, response) => {

    try {

        const { leadId } = request.params
        
        const deletedLead = await LeadModel.findByIdAndDelete(leadId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted lead successfully!',
            lead: deletedLead
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
    getLeads,
    getLeadById,
    searchLeads, 
    filterLeads,
    addLead, 
    updateLead, 
    deleteLead 
}