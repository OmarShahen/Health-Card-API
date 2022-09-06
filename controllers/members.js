const mongoose = require('mongoose')
const ClubModel = require('../models/ClubModel')
const MemberModel = require('../models/MemberModel')
const RegistrationModel = require('../models/RegistrationModel')
const AttendanceModel = require('../models/AttendanceModel')
const CancelledRegistrations = require('../models/CancelledRegistrationModel')
const CancelledAttendances = require('../models/CancelledAttendanceModel')
const memberValidation = require('../validations/members')
const statsValidation = require('../validations/stats')
const utils = require('../utils/utils')
const whatsappRequest = require('../APIs/whatsapp/send-verification-code')

const addMember = async (request, response) => {

    try {

        const dataValidation = memberValidation.memberData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId, name, email, phone, countryCode, canAuthenticate, QRCodeURL, QRCodeUUID, languageCode } = request.body

        const club = await ClubModel.findById(clubId)

        if(!club) {
            return response.status(404).json({
                message: 'club Id does not exist',
                field: 'clubId'
            })
        }

        if(email) {

            const emailList = await MemberModel
            .find({ clubId, email })

            if(emailList.length != 0) {
                return response.status(400).json({
                    message: 'email is already registered in the club',
                    field: 'email'
                })
            }
        }

        const phoneList = await MemberModel
        .find({ clubId, phone, countryCode })

        if(phoneList.length != 0) {
            return response.status(400).json({
                message: 'phone number already registered in the club',
                field: 'phone'
            })
        }


        let memberData
        let verificationMessage

        if(canAuthenticate) {

            memberData = { clubId, name, email, phone, countryCode, canAuthenticate, QRCodeURL, QRCodeUUID }

            const memberPhone = countryCode + phone
            const clubData = {
                memberName: name,
                name: club.name,
                phone: club.countryCode + club.phone,
                address: `${club.location.address} ${club.location.city} ${club.location.country}`
            }

            const messageResponse = await whatsappRequest.sendMemberQRCode(memberPhone, languageCode, QRCodeURL, clubData)

            if(messageResponse.isSent) {
                verificationMessage = {
                    isSent: true,
                    message: 'verification message is sent successfully'
                }

            } else {

                verificationMessage = {
                    isSent: false,
                    message: 'verification message is not sent'
                }
            }


        } else {
            memberData = { clubId, name, email, phone, countryCode, canAuthenticate }
        }

        const memberObj = new MemberModel(memberData)
        const newMember = await memberObj.save()

    
        return response.status(200).json({
            message: `${name} is added to the club successfully`,
            newMember,
            verificationMessage
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message:'internal server error',
            error: error.message
        })
    }
}

const searchMembersByPhone = async (request, response) => {

    try {

        const { clubId } = request.params
        const { countryCode, phone } = request.query

        let members

        if(countryCode && phone) {

            members = await MemberModel
            .find({ clubId, countryCode, phone })
            .sort({ createdAt: -1 })

        } else {

            members = await MemberModel
            .find({ clubId })
            .sort({ createdAt: -1 })

        }
        
        return response.status(200).json({
            members: members
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getMembers = async (request, response) => {

    try {

        const { clubId } = request.params
        const { status } = request.query

        let members

        if(status == 'active') {

            members = await MemberModel
            .find({ clubId, isBlocked: false })

        } else if(status == 'blocked') {

            members = await MemberModel
            .find({ clubId, isBlocked: true })

        } else {

            members = await MemberModel
            .find({ clubId })
        }

        return response.status(200).json({
            members
        })


    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteMember = async (request, response) => {

    try {

        const { memberId } = request.params

        if(!utils.isObjectId(memberId)) {
            return response.status(400).json({
                message: 'invalid member Id formate',
                field: 'memberId'
            })
        }

        const memberRegistrationsList = await RegistrationModel
        .find({ memberId })

        if(memberRegistrationsList.length != 0) {
            return response.status(400).json({
                message: 'member has registered packages',
                field: 'memberId'
            })
        }

        const deleteMember = await MemberModel.findByIdAndDelete(memberId)

        return response.status(200).json({
            member: deleteMember
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateMember = async (request, response) => {

    try {

        const { memberId } = request.params

        const dataValidation = memberValidation.updateMemberData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { name, email, phone, countryCode, canAuthenticate, QRCodeURL } = request.body

        const member = await MemberModel.findById(memberId)

        if(email && member.email != email) {

            const emailList = await MemberModel
            .find({ clubId: member.clubId, email })

            if(emailList.length != 0) {
                return response.status(400).json({
                    message: 'email is already registered',
                    field: 'email'
                })
            }
        }

        if(member.countryCode == countryCode && member.phone != phone) {

            const phoneList = await MemberModel
            .find({ clubId: member.clubId, countryCode, phone })

            if(phoneList.length != 0) {
                return response.status(400).json({
                    message: 'phone is already registered',
                    field: 'phone'
                })
            }
        }

        let memberData = { name, countryCode, phone, canAuthenticate }

        if(email) memberData = { ...memberData, email }

        if(canAuthenticate == true) memberData = { ...memberData, QRCodeURL }

        const updatedMember = await MemberModel
        .findByIdAndUpdate(
            memberId,
            memberData,
            { new: true }
        )

        return response.status(200).json({
            message: 'member updated successfully',
            member: updatedMember
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateMemberStatus = async (request, response) => {

    try {

        const { memberId } = request.params
        const { isBlocked } = request.body


        if(typeof isBlocked != 'boolean') {
            return response.status(400).json({
                message: 'member status must be boolean',
                field: 'isBlocked'
            })
        }

        const updatedMember = await MemberModel
        .findByIdAndUpdate(
            memberId,
            { isBlocked },
            { new: true }
        )

        return response.status(200).json({
            message: 'member status is updated successfully',
            member: updatedMember
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteMemberAndRelated = async (request, response) => {

    try {

        const { memberId } = request.params

        const deletedRegistrations = await RegistrationModel
        .deleteMany({ memberId })

        const deletedMember = await MemberModel
        .findByIdAndDelete(memberId)

        return response.status(200).json({
            message: 'member deleted successfully and all related data',
            member: deletedMember,
            deletedRegistrations: deletedRegistrations.deletedCount
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getMembersStatsByDate = async (request, response) => {

    try {

        const dataValidation = statsValidation.statsDates(request.query)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId } = request.params
        const { searchQuery } = utils.statsQueryGenerator('clubId', clubId, request.query)

        const membersPromise = MemberModel
        .find(searchQuery)

        const membersStatsPromise = MemberModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            }
        ])

        const [members, membersStats] = await Promise.all([
            membersPromise,
            membersStatsPromise
        ])

        const numberOfMembers = members.length

        const activeMembers = members.filter(member => member.isBlocked == false)
        const numberOfActiveMembers = activeMembers.length

        const blockedMembers = members.filter(member => member.isBlocked == true)
        const numberOfBlockedMembers = blockedMembers.length

        return response.status(200).json({
            numberOfMembers,
            numberOfActiveMembers,
            numberOfBlockedMembers,
            membersStats,
            members,
            activeMembers,
            blockedMembers
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getMemberRegistrationsStatsByDate = async (request, response) => {

    try {

        const dataValidation = statsValidation.statsDates(request.query)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { memberId } = request.params
        const { searchQuery } = utils.statsQueryGenerator('memberId', memberId, request.query)


        const registrationsPromise = RegistrationModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'members',
                    localField: 'memberId',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $lookup: {
                    from: 'staffs',
                    localField: 'staffId',
                    foreignField: '_id',
                    as: 'staff'
                }
            },
            {
                $lookup: {
                    from: 'packages',
                    localField: 'packageId',
                    foreignField: '_id',
                    as: 'package'
                }
            },
            {
                $lookup: {
                    from: 'clubs',
                    localField: 'clubId',
                    foreignField: '_id',
                    as: 'club'
                }
            },
            {
                $project: {
                    'member.canAuthenticate': 0,
                    'member.QRCodeURL': 0,
                    'member.updatedAt': 0,
                    'member.__v': 0,
                    'staff.password': 0,
                    'staff.updatedAt': 0,
                    'staff.__v': 0,
                    'package.updatedAt': 0,
                    'package.__v': 0,
                }
            }
        ])

        const attendancesPromise = AttendanceModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'members',
                    localField: 'memberId',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $lookup: {
                    from: 'staffs',
                    localField: 'staffId',
                    foreignField: '_id',
                    as: 'staff'
                }
            },
            {
                $lookup: {
                    from: 'packages',
                    localField: 'packageId',
                    foreignField: '_id',
                    as: 'package'
                }
            },
            {
                $lookup: {
                    from: 'clubs',
                    localField: 'clubId',
                    foreignField: '_id',
                    as: 'club'
                }
            },
            {
                $project: {
                    'member.canAuthenticate': 0,
                    'member.QRCodeURL': 0,
                    'member.updatedAt': 0,
                    'member.__v': 0,
                    'staff.password': 0,
                    'staff.updatedAt': 0,
                    'staff.__v': 0,
                    'package.updatedAt': 0,
                    'package.__v': 0,
                }
            }
        ])

        const attendancesStatsPromise = AttendanceModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 },
                }
            }
        ])

        const cancelledRegistrationsPromise = CancelledRegistrations.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'members',
                    localField: 'memberId',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $lookup: {
                    from: 'staffs',
                    localField: 'staffId',
                    foreignField: '_id',
                    as: 'staff'
                }
            },
            {
                $lookup: {
                    from: 'packages',
                    localField: 'packageId',
                    foreignField: '_id',
                    as: 'package'
                }
            },
            {
                $lookup: {
                    from: 'clubs',
                    localField: 'clubId',
                    foreignField: '_id',
                    as: 'club'
                }
            },
            {
                $project: {
                    'member.canAuthenticate': 0,
                    'member.QRCodeURL': 0,
                    'member.updatedAt': 0,
                    'member.__v': 0,
                    'staff.password': 0,
                    'staff.updatedAt': 0,
                    'staff.__v': 0,
                    'package.updatedAt': 0,
                    'package.__v': 0
                }
            }
        ])

        const cancelledAttendancesPromise = CancelledAttendances.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'members',
                    localField: 'memberId',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $lookup: {
                    from: 'staffs',
                    localField: 'staffId',
                    foreignField: '_id',
                    as: 'staff'
                }
            },
            {
                $lookup: {
                    from: 'packages',
                    localField: 'packageId',
                    foreignField: '_id',
                    as: 'package'
                }
            },
            {
                $lookup: {
                    from: 'clubs',
                    localField: 'clubId',
                    foreignField: '_id',
                    as: 'club'
                }
            },
            {
                $project: {
                    'member.canAuthenticate': 0,
                    'member.QRCodeURL': 0,
                    'member.updatedAt': 0,
                    'member.__v': 0,
                    'staff.password': 0,
                    'staff.updatedAt': 0,
                    'staff.__v': 0,
                    'package.updatedAt': 0,
                    'package.__v': 0
                }
            }
        ])

        const [registrations, attendances, attendancesStats, cancelledRegistrations, cancelledAttendances] = await Promise.all([
            registrationsPromise,
            attendancesPromise,
            attendancesStatsPromise,
            cancelledRegistrationsPromise,
            cancelledAttendancesPromise
        ])

        const numberOfRegistrations = registrations.length
        const numberOfAttendances = attendances.length
        const numberOfCancelledRegistrations = cancelledRegistrations.length
        const numberOfCancelledAttendances = cancelledAttendances.length


        return response.status(200).json({
            attendancesStats,
            numberOfRegistrations,
            numberOfAttendances,
            numberOfCancelledRegistrations,
            numberOfCancelledAttendances,
            registrations,
            attendances,
            cancelledRegistrations,
            cancelledAttendances
        })


    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateMemberQRcodeVerification = async (request, response) => {

    try {

        const dataValidation = memberValidation
        .updateMemberQRcodeVerificationData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { memberId } = request.params
        const { QRCodeURL, QRCodeUUID } = request.body

        const member = await MemberModel.findById(memberId)

        if(!member.canAuthenticate) {
            return response.status(400).json({
                message: 'member account authentication is closed',
                field: 'memberId'
            })
        }

        const updatedMember = await MemberModel
        .findByIdAndUpdate(
            memberId,
            { QRCodeURL, QRCodeUUID },
            { new: true }
        )

        return response.status(200).json({
            message: 'member data is updated successfully',
            member: updatedMember
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}


module.exports = { 
    addMember, 
    searchMembersByPhone, 
    deleteMember, 
    updateMember,
    updateMemberStatus,
    deleteMemberAndRelated,
    getMembers,
    getMembersStatsByDate,
    getMemberRegistrationsStatsByDate,
    updateMemberQRcodeVerification
}