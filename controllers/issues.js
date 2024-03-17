const IssueModel = require('../models/IssueModel')
const SpecialityModel = require('../models/SpecialityModel')
const CounterModel = require('../models/CounterModel')
const issueValidation = require('../validations/issues')
const mongoose = require('mongoose')


const addIssue = async (request, response) => {

    try {

        const dataValidation = issueValidation.addIssue(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        let { name, specialityId } = request.body

        const speciality = await SpecialityModel.findById(specialityId)
        if(!speciality) {
            return response.status(400).json({
                accepted: false,
                message: 'Speciality ID does not exist',
                field: 'specialityId'
            })
        }

        name = name.toLowerCase()
        const namesList = await IssueModel.find({ name })
        if(namesList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Name is already registered',
                field: 'name'
            })
        }
        
        const counter = await CounterModel.findOneAndUpdate(
            { name: 'Issue' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const issueData = { issueId: counter.value, name, specialityId }
        const issueObj = new IssueModel(issueData)
        const newIssue = await issueObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Added issue successfully!',
            issue: newIssue
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

const getIssues = async (request, response) => {

    try {

        let { name, limit } = request.query
        name  = name ? name : ''
        limit = limit ? Number.parseInt(limit) : 25

        const issues = await IssueModel.aggregate([
            {
                $match: {
                    name: { $regex: name, $options: 'i' }
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
            },
            {
                $sort: { createdAt: -1 }
            }
        ])

        issues.forEach(issue => issue.speciality = issue.speciality[0])

        return response.status(200).json({
            accepted: true,
            issues
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

const getIssuesBySpecialityId = async (request, response) => {

    try {

        const { specialityId } = request.params

        const issues = await IssueModel.aggregate([
            {
                $match: {
                    specialityId: mongoose.Types.ObjectId(specialityId)
                }
            },
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'specialityId',
                    foreignField: '_id',
                    as: 'speciality'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        issues.forEach(issue => issue.speciality = issue.speciality[0])

        return response.status(200).json({
            accepted: true,
            issues
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

const updateIssue = async (request, response) => {

    try {

        const dataValidation = issueValidation.updateIssue(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { issueId } = request.params
        let { name } = request.body

        name = name.toLowerCase()

        const issue = await IssueModel.findById(issueId)

        if(issue.name != name) {
            const namesList = await IssueModel.find({ name })
            if(namesList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Name is already registered',
                    field: 'name'
                })
            }
        }

        const updatedIssue = await IssueModel
        .findByIdAndUpdate(issueId, { name }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated issue successfully!',
            issue: updatedIssue 
        })

    } catch(error) {
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteIssue = async (request, response) => {

    try {

        const { issueId } = request.params

        const deletedIssue = await IssueModel.findByIdAndDelete(issueId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted issue successfully',
            issue: deletedIssue
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


module.exports = { addIssue, getIssues, getIssuesBySpecialityId, updateIssue, deleteIssue }