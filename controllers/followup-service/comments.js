const CommentModel = require('../../models/followup-service/CommentModel')
const UserModel = require('../../models/UserModel')
const PatientModel = require('../../models/PatientModel')
const ClinicModel = require('../../models/ClinicModel')
const CounterModel = require('../../models/CounterModel')
const commentValidation = require('../../validations/followup-service/comments')
const utils = require('../../utils/utils')


const getComments = async (request, response) => {

    try {

        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        const comments = await CommentModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ])
        
        comments.forEach(comment => {
            comment.patient = comment.patient[0]
            comment.clinic = comment.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            comments
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

const addComment = async (request, response) => {

    try {

        const dataValidation = commentValidation.addComment(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clinicId, patientId, memberId } = request.body

        const memberPromise = UserModel.findById(memberId)
        const clinicPromise = ClinicModel.findById(clinicId)

        const [member, clinic] = await Promise.all([memberPromise, clinicPromise])

        if(!member) {
            return response.status(400).json({
                accepted: false,
                message: 'Member ID does not exist',
                field: 'doneById'
            })
        }
        
        if(patientId) {
            const patient = await PatientModel.findById(patientId)
            if(!patient) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Patient ID does not exist',
                    field: 'patientId'
                })
            }
        }   

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic ID does not exist',
                field: 'clinicId'
            })
        }   

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'Comment' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const commentData = { commentId: counter.value, ...request.body }
        const commentObj = new CommentModel(commentData)
        const newComment = await commentObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Added comment successfully!',
            comment: newComment
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

const updateComment = async (request, response) => {

    try {

        const { commentId } = request.params

        const dataValidation = commentValidation.updateComment(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        } 

        const updatedComment = await CommentModel.findByIdAndUpdate(commentId, request.body, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated comment successfully!',
            comment: updatedComment
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

const deleteComment = async (request, response) => {

    try {

        const { commentId } = request.params

        const deletedComment = await CommentModel.findByIdAndDelete(commentId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted comment successfully!',
            comment: deletedComment
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
    getComments, 
    addComment, 
    updateComment, 
    deleteComment 
}