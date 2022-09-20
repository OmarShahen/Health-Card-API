const mongoose = require('mongoose')
const ClubModel = require('../models/ClubModel')
const MemberModel = require('../models/MemberModel')
const RegistrationModel = require('../models/RegistrationModel')
const StaffModel = require('../models/StaffModel')
const AttendanceModel = require('../models/AttendanceModel')
const CancelledRegistrations = require('../models/CancelledRegistrationModel')
const CancelledAttendances = require('../models/CancelledAttendanceModel')
const ChainOwnerModel = require('../models/ChainOwnerModel')
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

        const { clubId, staffId, name, email, phone, countryCode, canAuthenticate, QRCodeURL, QRCodeUUID, languageCode } = request.body

        const clubPromise = ClubModel.findById(clubId)
        const staffPromise = StaffModel.findById(staffId)

        const [club, staff] = await Promise.all([clubPromise, staffPromise])

        if(!club) {
            return response.status(404).json({
                message: 'club Id does not exist',
                field: 'clubId'
            })
        }

        if(!staff) {
            return response.status(404).json({
                message: 'staff Id does not exist',
                field: 'staffId'
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

            memberData = { clubId, staffId, name, email, phone, countryCode, canAuthenticate, QRCodeURL, QRCodeUUID }

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
            memberData = { clubId, staffId, name, email, phone, countryCode, canAuthenticate }
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

const CheckaddMember = async (request, response) => {

    try {

        const dataValidation = memberValidation.memberDataCheck(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId, staffId, email, phone, countryCode } = request.body

        const clubPromise = ClubModel.findById(clubId)
        const staffPromise = StaffModel.findById(staffId)

        const [club, staff] = await Promise.all([clubPromise, staffPromise])

        if(!club) {
            return response.status(404).json({
                message: 'club Id does not exist',
                field: 'clubId'
            })
        }

        if(!staff) {
            return response.status(404).json({
                message: 'staff Id does not exist',
                field: 'staffId'
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

        return response.status(200).json({
            message: `Member data is valid`,
            isValid: true
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

        const { name, email, phone, countryCode } = request.body

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

        let memberData = { name, countryCode, phone }

        if(email) memberData = { ...memberData, email }

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

        const totalMembers = members.length

        const activeMembers = members.filter(member => member.isBlocked == false)
        const totalActiveMembers = activeMembers.length

        const blockedMembers = members.filter(member => member.isBlocked == true)
        const totalBlockedMembers = blockedMembers.length

        membersStats
        .sort((month1, month2) => new Date(month1._id) - new Date(month2._id))

        return response.status(200).json({
            totalMembers,
            totalActiveMembers,
            totalBlockedMembers,
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

        const attendancesStatsByMonthPromise = AttendanceModel.aggregate([
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

        const attendancesStatsByDaysPromise = AttendanceModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            }
        ])

        const attendancesStatsByHoursPromise = AttendanceModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%dT%H', date: '$createdAt' } },
                    count: { $sum: 1 }
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

        const [
            registrations, 
            attendances, 
            cancelledRegistrations, 
            cancelledAttendances,
            attendancesStatsByMonths,
            attendancesStatsByDays,
            attendancesStatsByHours
        ] = await Promise.all([
            registrationsPromise,
            attendancesPromise,
            cancelledRegistrationsPromise,
            cancelledAttendancesPromise,
            attendancesStatsByMonthPromise,
            attendancesStatsByDaysPromise,
            attendancesStatsByHoursPromise
        ])

        const totalRegistrations = registrations.length
        const totalAttendances = attendances.length
        const totalCancelledRegistrations = cancelledRegistrations.length
        const totalCancelledAttendances = cancelledAttendances.length

        attendancesStatsByHours.forEach(hour => hour._id = hour._id.split('T')[1] + ':00')
        attendancesStatsByHours
        .sort((hour1, hour2) => Number.parseInt(hour1._id) - Number.parseInt(hour2._id))

        attendancesStatsByMonths
        .sort((month1, month2) => new Date(month1._id) - new Date(month2._id))

        attendancesStatsByDays.forEach(day => {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            day._id = days[new Date(day._id).getDay()]
        })

        attendancesStatsByDays.sort((day1, day2) => day2.count - day1.count)



        return response.status(200).json({
            totalRegistrations,
            totalAttendances,
            totalCancelledRegistrations,
            totalCancelledAttendances,
            attendancesStatsByMonths,
            attendancesStatsByDays,
            attendancesStatsByHours,
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

const updateMemberAuthenticationStatus = async (request, response) => {

    try {

        const dataValidation = memberValidation
        .updateMemberAuthenticationStatusData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { memberId } = request.params
        const { canAuthenticate, QRCodeURL, QRCodeUUID, languageCode } = request.body

        let updatedMember = {}
        let message = { isSent: false }

        if(!canAuthenticate) {

            updatedMember = await MemberModel
            .findByIdAndUpdate(memberId, { canAuthenticate }, { new: true })

        } else if(canAuthenticate) {

            const member = await MemberModel.findById(memberId)
            const club = await ClubModel.findById(member.clubId)

            const updatedMemberPromise = await MemberModel
            .findByIdAndUpdate(memberId, { canAuthenticate, QRCodeURL, QRCodeUUID }, { new: true })

            const RECEPIENT_PHONE = member.countryCode + member.phone
            const QR_CODE_URL = member.QRCodeURL
            const messageBody = {
                memberName: member.name,
                name: club.name,
                phone: club.countryCode + club.phone,
                address: `${club.location.address}, ${club.location.city}, ${club.location.country}`
            }

            const messagePromise = await whatsappRequest
            .sendMemberResetQRCode(RECEPIENT_PHONE, languageCode, QR_CODE_URL, messageBody)

            const [updatedMemberResult, messageResult] = await Promise.all([
                updatedMemberPromise,
                messagePromise
            ])

            updatedMember = updatedMemberResult
            message = messageResult


            if(!message.isSent) {
                message.message = 'could not send member QR code message'
            } else {
                message.message = 'member QR code is sent successfully'
            }


        }

        return response.status(200).json({
            updatedMember,
            whatsappMessage: message
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getMembersByOwner = async (request, response) => {

    try {

        const { ownerId } = request.params

        const owner = await ChainOwnerModel.findById(ownerId)

        const clubs = owner.clubs

        const members = await MemberModel.aggregate([
            {
                $match: {
                    clubId: { $in: clubs },
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
                $lookup: {
                    from: 'staffs',
                    localField: 'staffId',
                    foreignField: '_id',
                    as: 'staff'
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    password: 0,
                    updatedAt: 0,
                    __v: 0,
                    'club.updatedAt': 0,
                    'club.__v': 0
                }
            }
        ])

        members.forEach(member => {
            member.club = member.club[0]
            member.staff = member.staff[0]
        })

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

const getChainOwnerMembersStatsByDate = async (request, response) => {

    try {

        const dataValidation = statsValidation.statsDates(request.query)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { ownerId } = request.params

        const owner = await ChainOwnerModel.findById(ownerId)

        const clubs = owner.clubs

        const { searchQuery } = utils.statsQueryGenerator('clubId', clubs, request.query)


        const membersPromise = MemberModel.aggregate([
            {
                $match: searchQuery
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
                $lookup: {
                    from: 'staffs',
                    localField: 'staffId',
                    foreignField: '_id',
                    as: 'staff'
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    'staff.password': 0,
                    'staff.updatedAt': 0,
                    'staff.__v': 0
                }
            }
        ])

        const membersStatsByMonthPromise = MemberModel.aggregate([
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

        const clubsMembersStatsPromise = MemberModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$clubId',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'clubs',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'club'
                }
            }
        ])


        const [members, membersStatsByMonth, clubsMembersStats] = await Promise.all([
            membersPromise,
            membersStatsByMonthPromise,
            clubsMembersStatsPromise
        ])

        const totalMembers = members.length

        const activeMembers = members.filter(member => !member.isBlocked)
        const blockedMembers = members.filter(member => member.isBlocked)


        membersStatsByMonth.sort((month1, month2) => new Date(month1._id) - new Date(month2._id))

        clubsMembersStats.forEach(stat => stat.club = stat.club[0])

        members.forEach(member => {
            member.club = member.club[0]
            member.staff = member.staff[0]
        })

        return response.status(200).json({
            totalMembers,
            totalActiveMembers: activeMembers.length,
            totalBlockedMembers: blockedMembers.length,
            membersStatsByMonth,
            clubsMembersStats,
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


module.exports = { 
    addMember, 
    CheckaddMember,
    searchMembersByPhone, 
    deleteMember, 
    updateMember,
    updateMemberStatus,
    deleteMemberAndRelated,
    getMembers,
    getMembersStatsByDate,
    getMemberRegistrationsStatsByDate,
    updateMemberQRcodeVerification,
    updateMemberAuthenticationStatus,
    getMembersByOwner,
    getChainOwnerMembersStatsByDate
}