const config = require('../config/config')
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
const moment = require('moment')
const translations = require('../i18n/index')

const addMember = async (request, response, next) => {

    try {

        const { lang } = request.query

        const dataValidation = memberValidation.memberData(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: false,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId, staffId, name, email, phone, countryCode, membership, gender, age } = request.body

        const clubPromise = ClubModel.findById(clubId)
        const staffPromise = StaffModel.findById(staffId)

        const [club, staff] = await Promise.all([clubPromise, staffPromise])

        if(!club) {
            return response.status(404).json({
                accepted: false,
                message: 'club Id does not exist',
                field: 'clubId'
            })
        }

        if(!staff) {
            return response.status(404).json({
                accepted: false,
                message: 'staff Id does not exist',
                field: 'staffId'
            })
        }

        if(email) {

            const emailList = await MemberModel
            .find({ clubId, email })

            if(emailList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: translations[lang]['Email is already registered in the club'],
                    field: 'email'
                })
            }
        }

        const phoneList = await MemberModel
        .find({ clubId, phone, countryCode })

        if(phoneList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Phone number is already registered in the club'],
                field: 'phone'
            })
        }

        if(club.hasMembership) {

            if(!membership || typeof membership != 'number') {
                return response.status(400).json({
                    accepted: false,
                    message: translations[lang]['Membership is required and must be a number'],
                    field: 'membership'
                })
            }

            const membershipsList = await MemberModel.find({ clubId, membership })
            if(membershipsList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: translations[lang]['Membership is already registered in the club'],
                    field: 'membership'
                })
            }
        }

        let memberData = { clubId, staffId, name, email, phone, countryCode, membership, gender }

        if(age) {
            memberData.birthYear = new Date(moment().subtract(age, 'years')).getFullYear()
        }

        const memberObj = new MemberModel(memberData)
        const newMember = await memberObj.save()

    
        return response.status(200).json({
            accepted: true,
            message: translations[lang][`Member is added to the club successfully!`],
            newMember,
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message:'internal server error',
            error: error.message
        })
    }
}

const CheckaddMember = async (request, response) => {

    try {

        const { lang } = request.query

        const dataValidation = memberValidation.memberDataCheck(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId, staffId, email, phone, countryCode, gender, age } = request.body

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
                    message: translations[lang]['Email is already registered in the club'],
                    field: 'email'
                })
            }
        }

        const phoneList = await MemberModel
        .find({ clubId, phone, countryCode })

        if(phoneList.length != 0) {
            return response.status(400).json({
                message: translations[lang]['Phone number already registered in the club'],
                field: 'phone'
            })
        }


        return response.status(200).json({
            message: `Member data is valid`,
            isValid: true,
            member: request.body
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
            .sort({ createdAt: -1 })

        } else if(status == 'blocked') {

            members = await MemberModel
            .find({ clubId, isBlocked: true })
            .sort({ createdAt: -1 })

        } else {

            members = await MemberModel
            .find({ clubId })
            .sort({ createdAt: -1 })
        }

        return response.status(200).json({
            accepted: true,
            members
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

const deleteMember = async (request, response) => {

    try {

        const { memberId } = request.params

        if(!utils.isObjectId(memberId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid member Id formate',
                field: 'memberId'
            })
        }

        const memberRegistrationsList = await RegistrationModel
        .find({ memberId })

        if(memberRegistrationsList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'member has registered packages',
                field: 'memberId'
            })
        }

        const deleteMember = await MemberModel.findByIdAndDelete(memberId)

        return response.status(200).json({
            accepted: true,
            member: deleteMember
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

        const { lang } = request.query
        const { memberId } = request.params
        const { isBlocked } = request.body


        if(typeof isBlocked != 'boolean') {
            return response.status(400).json({
                accepted: false,
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
            accepted: true,
            message: translations[lang]['Member status is updated successfully'],
            member: updatedMember
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

const getClubMembersStatsByDate = async (request, response) => {

    try {

        const dataValidation = statsValidation.statsDates(request.query)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId } = request.params
        const { specific, until, to } = request.query

        const { searchQuery } = utils.statsQueryGenerator('clubId', clubId, request.query)

        const growthUntilDate = utils.growthDatePicker(until, to, specific)
        const growthQuery = utils.statsQueryGenerator('clubId', clubId, { until: growthUntilDate })

        const membersPromise = MemberModel.aggregate([
            {
                $match: searchQuery
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

        const membersStatsGrowthPromise = MemberModel.aggregate([
            {
                $match: growthQuery.searchQuery
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            }
        ])


        const membersGenderStatsPromise = MemberModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$gender',
                    count: { $sum: 1 }
                }
            }
        ])

        const membersAgeStatsPromise = MemberModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$birthYear',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ])


        const [members, membersStatsGrowth, membersGenderStats, membersAgeStats] = await Promise.all([
            membersPromise,
            membersStatsGrowthPromise,
            membersGenderStatsPromise,
            membersAgeStatsPromise
        ])

        const totalMembers = members.length

        const activeMembers = members.filter(member => !member.isBlocked)
        const blockedMembers = members.filter(member => member.isBlocked)


        membersStatsGrowth.sort((month1, month2) => new Date(month1._id) - new Date(month2._id))

        const todayDate = new Date()

        membersAgeStats
        .forEach(stat => stat._id = todayDate.getFullYear() - new Date(stat._id).getFullYear())

        members.forEach(member => {
            member.staff = member.staff[0]
        })

        const membersGenderPercentageStat = utils.calculateGenderPercentages(members)

        return response.status(200).json({
            membersGenderPercentageStat,
            membersAgeStats,
            membersGenderStats,
            totalMembers,
            totalActiveMembers: activeMembers.length,
            totalBlockedMembers: blockedMembers.length,
            membersStatsGrowth,
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

const getMemberStatsByDate = async (request, response) => {

    try {

        const dataValidation = statsValidation.statsDates(request.query)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { memberId } = request.params
        const { specific, until, to } = request.query

        const { searchQuery, toDate } = utils.statsQueryGenerator('memberId', memberId, request.query)

        const growthUntilDate = utils.growthDatePicker(until, to, specific)
        const growthQuery = utils.statsQueryGenerator('memberId', memberId, { until: growthUntilDate })

        const memberPromise = MemberModel.findById(memberId)

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
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    'staff.password': 0,
                }
            }
        ])

        const attendancesPromise = AttendanceModel.aggregate([
            {
                $match: searchQuery
            }
        ])

        const attendancesGrowthStatsPromise = AttendanceModel.aggregate([
            {
                $match: growthQuery.searchQuery
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 },
                }
            }
        ])

        const attendancesStatsDayPromise = AttendanceModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $project: {
                    weekDay: { $dayOfWeek: '$createdAt' }
                }
            },
            {
                $group: {
                    _id: '$weekDay',
                    count: { $sum: 1 }
                }
            }
        ])

        const attendancesStatsHourPromise = AttendanceModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%H', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            }
        ])

        const packagesRegistrationsStatsPromise = RegistrationModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$packageId',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'packages',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'package'
                }
            }
        ])

        let [
            member,
            registrations, 
            attendances, 
            attendancesGrowthStats,
                   attendancesStatsDay,
            attendancesStatsHour,
            packagesRegistrationsStats
        ] = await Promise.all([
            memberPromise,
            registrationsPromise,
            attendancesPromise,
            attendancesGrowthStatsPromise,
            attendancesStatsDayPromise,
            attendancesStatsHourPromise,
            packagesRegistrationsStatsPromise
        ])

        const todayDate = new Date()
        let age = todayDate.getFullYear() - new Date(member.birthYear).getFullYear()
        member = {...member._doc, age }

        registrations.forEach(registration => {
            registration.staff = registration.staff[0]
            registration.member = registration.member[0]
            registration.package = registration.package[0]
        })

        const totalRegistrations = registrations.length
        const totalAttendances = attendances.length

        attendancesStatsHour.forEach(hour => hour._id = Number.parseInt(hour._id))
        attendancesStatsHour
        .sort((hour1, hour2) => Number.parseInt(hour1._id) - Number.parseInt(hour2._id))

        attendancesGrowthStats
        .sort((month1, month2) => new Date(month1._id) - new Date(month2._id))

        attendancesStatsDay.forEach((stat) => stat.dayName = config.WEEK_DAYS[stat._id - 1])
        attendancesStatsDay.sort((day1, day2) => day2.count - day1.count)

        const expiredRegistrations = registrations
        .filter(registration => registration.expiresAt <= toDate || registration.isActive == false)

        const registrationCompletion = utils.calculateCompletedPackageAttendances(expiredRegistrations)

        let completedPackageAttendance = ((registrationCompletion.completedAttendance / registrationCompletion.total) * 100).toFixed(2)
        let incompletedPackageAttendance = ((registrationCompletion.incompletedAttendance/ registrationCompletion.total) * 100).toFixed(2)


        const registrationCompletionStat = {
            completedRegistrationAttendancePercentage: String(completedPackageAttendance) != 'NaN' ? Math.round(Number.parseFloat(completedPackageAttendance)) : 0,
            completedRegistrationAttendance: registrationCompletion.completedAttendance,
            incompletedRegistrationAttendancePercentage: String(incompletedPackageAttendance) != 'NaN' ? Math.round(Number.parseFloat(incompletedPackageAttendance)) : 0,
            incompletedRegistrationAttendance: registrationCompletion.incompletedAttendance,
            total: registrationCompletion.total
        }

        packagesRegistrationsStats.forEach(stat => stat.package = stat.package[0])


        return response.status(200).json({
            member,
            packagesRegistrationsStats,
            registrationCompletionStat,
            totalRegistrations,
            totalAttendances,
            attendancesGrowthStats,
            attendancesStatsDay,
            attendancesStatsHour,
            registrations
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

        const { lang } = request.query

        const dataValidation = memberValidation
        .updateMemberQRcodeVerificationData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: false,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { memberId } = request.params
        const { QRCodeURL, QRCodeUUID } = request.body

        const member = await MemberModel.findById(memberId)

        if(!member.canAuthenticate) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Member account authentication is closed'],
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
            accepted: true,
            message: translations[lang]['Member data is updated successfully'],
            member: updatedMember
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

const updateMemberAuthenticationStatus = async (request, response) => {

    try {

        const { lang } = request.query

        const dataValidation = memberValidation
        .updateMemberAuthenticationStatusData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: false,
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

            const updatedMemberPromise = MemberModel
            .findByIdAndUpdate(memberId, { canAuthenticate, QRCodeURL, QRCodeUUID }, { new: true })

            const RECEPIENT_PHONE = member.countryCode + member.phone
            const messageBody = {
                memberName: member.name,
                name: club.name,
                phone: club.countryCode + club.phone,
                address: `${club.location.address}, ${club.location.city}, ${club.location.country}`
            }

            const messagePromise = whatsappRequest
            .sendMemberResetQRCode(RECEPIENT_PHONE, languageCode, QRCodeURL, messageBody)

            const [updatedMemberResult, messageResult] = await Promise.all([
                updatedMemberPromise,
                messagePromise
            ])

            updatedMember = updatedMemberResult
            message = messageResult

            if(!message.isSent) {
                message.message = translations[lang]['Could not send member QR code message']
            } else {
                message.message = translations[lang]['Member QR code is sent successfully']
            }

        }

        return response.status(200).json({
            accepted: true,
            updatedMember,
            whatsappMessage: message
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

const sendMemberQRCodeWhatsapp = async (request, response) => {

    try {

        const { lang } = request.query
        const { memberId, languageCode } = request.params

        if(!utils.isObjectId(memberId)) {
            return response.status(406).json({
                accepted: false,
                message: 'invalid member Id formate',
                field: 'memberId'
            })
        }

        if(!utils.isWhatsappLanguageValid(languageCode)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid language code',
                field: 'languageCode'
            })
        }

        const member = await MemberModel.findById(memberId)

        if(!member) {
            return response.status(404).json({
                accepted: false,
                message: translations[lang]['Member account does not exist'],
                field: 'memberId'
            })
        }

        if(!member.canAuthenticate) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Authentication is closed for this member'],
                field: 'memberId'
            })
        }

        const memberClub = await ClubModel.findById(member.clubId)

        const QR_CODE_URL = member.QRCodeURL
        const memberPhone = member.countryCode + member.phone
        const clubData = {
            memberName: member.name,
            name: memberClub.name,
            phone: memberClub.countryCode + memberClub.phone,
            address: `${memberClub.location.address}, ${memberClub.location.city}, ${memberClub.location.country}`
        }

       const messageResponse = await whatsappRequest
       .sendMemberResetQRCode(memberPhone, languageCode, QR_CODE_URL, clubData)

        if(messageResponse.isSent == false) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Could not send member QR code message'],
                field: 'memberId'
            })
        }


        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Verification message is sent successfully'],
            member,
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

        const { searchQuery, until, toDate, specific } = utils.statsQueryGenerator('clubId', clubs, request.query)

        const growthUntilDate = utils.growthDatePicker(until, toDate, specific)
        const growthQuery = utils.statsQueryGenerator('clubId', clubs, { until: growthUntilDate })


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

        const membersStatsGrowthPromise = MemberModel.aggregate([
            {
                $match: growthQuery.searchQuery
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

        const membersGenderStatsPromise = MemberModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$gender',
                    count: { $sum: 1 }
                }
            }
        ])

        const membersAgeStatsPromise = MemberModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$birthYear',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ])


        const [members, membersStatsGrowth, clubsMembersStats, membersGenderStats, membersAgeStats] = await Promise.all([
            membersPromise,
            membersStatsGrowthPromise,
            clubsMembersStatsPromise,
            membersGenderStatsPromise,
            membersAgeStatsPromise
        ])

        const totalMembers = members.length

        const activeMembers = members.filter(member => !member.isBlocked)
        const blockedMembers = members.filter(member => member.isBlocked)


        membersStatsGrowth.sort((month1, month2) => new Date(month1._id) - new Date(month2._id))

        clubsMembersStats.forEach(stat => stat.club = stat.club[0])

        const todayDate = new Date()

        membersAgeStats
        .forEach(stat => stat._id = todayDate.getFullYear() - new Date(stat._id).getFullYear())

        members.forEach(member => {
            member.club = member.club[0]
            member.staff = member.staff[0]
        })

        const membersGenderPercentageStat = utils.calculateGenderPercentages(members)

        return response.status(200).json({
            membersGenderPercentageStat,
            membersAgeStats,
            membersGenderStats,
            totalMembers,
            totalActiveMembers: activeMembers.length,
            totalBlockedMembers: blockedMembers.length,
            membersStatsGrowth,
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

const insertManyMembers = async (request, response) => {

    try {

        const { members } = request.body

        const newMembers = await MemberModel.insertMany(members)

        return response.status(200).json(newMembers)

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
    getClubMembersStatsByDate,
    getMemberStatsByDate,
    sendMemberQRCodeWhatsapp,
    updateMemberQRcodeVerification,
    updateMemberAuthenticationStatus,
    getMembersByOwner,
    getChainOwnerMembersStatsByDate,
    insertManyMembers
}