const utils = require('../utils/utils')
const ClubModel = require('../models/ClubModel')
const RegistrationModel = require('../models/RegistrationModel')
const StaffModel = require('../models/StaffModel')
const PackageModel = require('../models/PackageModel')
const MemberModel = require('../models/MemberModel')

const verifyClubId = async (request, response, next) => {

    try {

        const { clubId } = request.params

        if(!utils.isObjectId(clubId)) {
            return response.status(400).json({
                message: 'invalid club Id formate',
                field: 'clubId'
            })
        }

        const clubList = await ClubModel.find({ _id: clubId })

        if(clubList.length == 0) {
            return response.status(404).json({
                message: 'club Id does not exist',
                field: 'clubId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyRegistrationId = async (request, response, next) => {

    try {

        const { registrationId } = request.params

        if(!utils.isObjectId(registrationId)) {
            return response.status(400).json({
                message: 'invalid registration Id formate',
                field: 'registrationId'
            })
        }

        const registrationList = await RegistrationModel.find({ _id: registrationId })

        if(registrationList.length == 0) {
            return response.status(404).json({
                message: 'registration Id does not exist',
                field: 'registrationId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyStaffId = async (request, response, next) => {

    try {

        const { staffId } = request.params

        if(!utils.isObjectId(staffId)) {
            return response.status(400).json({
                message: 'invalid staff Id formate',
                field: 'staffId'
            })
        }

        const staffList = await StaffModel.find({ _id: staffId })

        if(staffList.length == 0) {
            return response.status(404).json({
                message: 'staff Id does not exist',
                field: 'staffId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyPackageId = async (request, response, next) => {

    try {

        const { packageId } = request.params

        if(!utils.isObjectId(packageId)) {
            return response.status(400).json({
                message: 'invalid package Id formate',
                field: 'packageId'
            })
        }

        const packageList = await PackageModel.find({ _id: packageId })

        if(packageList.length == 0) {
            return response.status(404).json({
                message: 'package Id does not exist',
                field: 'packageId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyMemberId = async (request, response, next) => {

    try {

        const { memberId } = request.params

        if(!utils.isObjectId(memberId)) {
            return response.status(400).json({
                message: 'invalid member Id formate',
                field: 'memberId'
            })
        }

        const memberList = await MemberModel.find({ _id: memberId })

        if(memberList.length == 0) {
            return response.status(404).json({
                message: 'member Id does not exist',
                field: 'memberId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}





module.exports = { verifyClubId, verifyRegistrationId, verifyStaffId, verifyPackageId, verifyMemberId }