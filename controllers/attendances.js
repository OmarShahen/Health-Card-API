const config = require('../config/config')
const mongoose = require('mongoose')
const attendanceValidation = require('../validations/attendances')
const statsValidation = require('../validations/stats')
const RegistrationModel = require('../models/RegistrationModel')
const MemberModel = require('../models/MemberModel')
const StaffModel = require('../models/StaffModel')
const PackageModel = require('../models/PackageModel')
const AttendanceModel = require('../models/AttendanceModel')
const CancelledAttendanceModel = require('../models/CancelledAttendanceModel')
const ChainOwnerModel = require('../models/ChainOwnerModel')
const utils = require('../utils/utils')
const translations = require('../i18n/index')

const addAttendance = async (request, response) => {

    try {

        const { lang } = request.query

        const dataValidation = attendanceValidation.attendanceData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: false,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { registrationId, staffId } = request.body

        const registration = await RegistrationModel.findById(registrationId)

        if(!registration) {
            return response.status(404).json({
                accepted: false,
                message: 'registration Id does not exist',
                field: 'registrationId'
            })
        }


        const staff = await StaffModel.findById(staffId)

        if(!staff) {
            return response.status(404).json({
                accepted: false,
                message: 'staff Id does not exist',
                field: 'staffId'
            })
        }

        if(staff.isAccountActive == false) {
            return response.status(401).json({
                accepted: false,
                message: 'staff account is not active',
                field: 'staffId'
            })
        }

        const member = await MemberModel.findById(registration.memberId)

        if(member.isBlocked) {
            return response.status(401).json({
                accepted: false,
                message: translations[lang]['Member account is blocked'],
                field: 'memberId'
            })
        }   

        if(registration.isActive == false) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Member registration is expired'],
                field: 'registrationId'
            })
        }

        if(registration.isFreezed == true) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Member registration is freezed'],
                field: 'registrationId'
            })
        }

        const currentDate = new Date()

        if(registration.expiresAt <= currentDate) {
            
            const updatedRegistration = await RegistrationModel
            .findByIdAndUpdate(registrationId, { isActive: false }, { new: true })

            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Member registration is expired'],
                field: 'registrationId'
            })
        }


        const registeredPackageList = await PackageModel.find({ _id: registration.packageId })

        const MEMBER_CURRENT_ATTENDANCE = registration.attended
        const PACKAGE_ATTENDANCE = registeredPackageList[0].attendance
        const NEW_ATTENDANCE = MEMBER_CURRENT_ATTENDANCE + 1

        let updatedRegistration

        if(PACKAGE_ATTENDANCE == NEW_ATTENDANCE) {
            
            updatedRegistration = await RegistrationModel
            .findByIdAndUpdate(registrationId, { attended: NEW_ATTENDANCE, isActive: false }, { new: true })
        
        } else {

            updatedRegistration = await RegistrationModel
            .findByIdAndUpdate(registrationId, { attended: NEW_ATTENDANCE }, { new: true })
 
        }

        const newAttendanceData = {
            clubId: registration.clubId,
            packageId: registration.packageId,
            staffId: staffId,
            memberId: registration.memberId,
            registrationId: registration._id
        }

        const attendanceObj = new AttendanceModel(newAttendanceData)
        const newAttendance = await attendanceObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'updated attendance successfully',
            attendance: newAttendance,
            registration: updatedRegistration
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

const addAttendanceByMember = async (request, response) => {

    try {

        const { lang } = request.query
        const { memberId, uuid } = request.params

        if(!utils.isObjectId(memberId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid member Id',
                field: 'memberId'
            })
        }

        if(!utils.isUUIDValid(uuid)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid uuid formate',
                field: 'QRCodeUUID'
            })
        }

        const member = await MemberModel.findById(memberId)

        if(!member) {
            return response.status(404).json({
                accepted: false,
                message: 'member Id does not exists',
                field: 'memberId'
            })
        }

        if(!member.canAuthenticate) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Member account security is closed'],
                field: 'memberId'
            })
        }

        if(member.isBlocked) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Member is blocked'],
                field: 'memberId'
            })
        }

        if(member.QRCodeUUID != uuid) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['This QR code is invalid'],
                field: 'QRCodeUUID'
            })
        }

        const memberRegistrationList = await RegistrationModel
        .find({ memberId, isActive: true })

        if(memberRegistrationList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Member has no active registration']
            })
        }

        const memberRegistration = memberRegistrationList[0]

        if(memberRegistration.isFreezed) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Member registration is freezed']
            })
        }


        const currentDate = new Date()
        if(memberRegistration.expiresAt < currentDate && memberRegistration.isActive) {
            
            const updatedRegistration = await RegistrationModel
            .findByIdAndUpdate(memberRegistration._id, { isActive: false }, { new: true })

            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Member registration has passed expiration date'],
                field: 'registrationId'
            })

        } else if(memberRegistration.expiresAt < currentDate && !memberRegistration.isActive) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Member registration has passed expiration date'],
                field: 'registrationId'
            })
        }

        const registrationPackage = await PackageModel.find({ _id: memberRegistration.packageId })

        const MEMBER_CURRENT_ATTENDANCE = memberRegistration.attended
        const PACKAGE_ATTENDANCE = registrationPackage[0].attendance
        const NEW_ATTENDANCE = MEMBER_CURRENT_ATTENDANCE + 1
        const REMAINING_ATTENDANCE = PACKAGE_ATTENDANCE - NEW_ATTENDANCE

        let registrationExpirationNote
        let updatedRegistrationPromise

        if(PACKAGE_ATTENDANCE == NEW_ATTENDANCE) {
            
            registrationExpirationNote = 'This was the last attendance for the member in his registration'

            updatedRegistrationPromise = RegistrationModel
            .findByIdAndUpdate(memberRegistration._id, { attended: NEW_ATTENDANCE, isActive: false }, { new: true })
        
        } else {

            updatedRegistrationPromise = RegistrationModel
            .findByIdAndUpdate(memberRegistration._id, { attended: NEW_ATTENDANCE }, { new: true })
 
        }

        const newAttendanceData = {
            clubId: memberRegistration.clubId,
            packageId: memberRegistration.packageId,
            staffId: memberRegistration.staffId,
            memberId: memberRegistration.memberId,
            registrationId: memberRegistration._id
        }

        const attendanceObj = new AttendanceModel(newAttendanceData)

        const [updatedRegistration, newAttendance] = await Promise.all([
            updatedRegistrationPromise,
            attendanceObj.save()
        ])

        return response.status(200).json({
            accepted: true,
            remainingAttendance: REMAINING_ATTENDANCE,
            note: translations[lang][registrationExpirationNote],
            message: translations[lang]['Confirmed attendance successfully'],
            registration: updatedRegistration,
            attendance: newAttendance
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

const getRegistrationAttendancesWithStaffData = async (request, response) => {

    try {

        const { registrationId } = request.params
        const { searchQuery } = utils.statsQueryGenerator('registrationId', registrationId, request.query)

        const registrationAttendances = await AttendanceModel.aggregate([
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
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    'staff.password': 0,
                    'staff.updatedAt': 0,
                    'staff.__v': 0,
                    __v: 0,
                    updatedAt: 0
                }
            }
        ])

        registrationAttendances.forEach(attendance => {
            attendance.staff = attendance.staff[0]
        })

        return response.status(200).json({
            accepted: true,
            attendances: registrationAttendances
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

const getClubAttendances = async (request, response) => {

    try {

        const { clubId } = request.params
        const { searchQuery } = utils.statsQueryGenerator('clubId', clubId, request.query)

        const attendances = await AttendanceModel.aggregate([
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
                $lookup: {
                    from: 'members',
                    localField: 'memberId',
                    foreignField: '_id',
                    as: 'member'
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
                    'staff.updatedAt': 0,
                    'staff.__v': 0,
                    __v: 0,
                    updatedAt: 0
                }
            }
        ])

        attendances.forEach(attendance => {
            attendance.staff = attendance.staff[0]
            attendance.member = attendance.member[0]
            attendance.package = attendance.package[0]
        })

        return response.status(200).json({
            attendances
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getClubAttendancesStatsByDate = async (request, response) => {

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

        const { searchQuery, toDate } = utils.statsQueryGenerator('clubId', clubId, request.query)

        const growthUntilDate = utils.growthDatePicker(until, to, specific)
        const growthQuery = utils.statsQueryGenerator('clubId', clubId, { until: growthUntilDate })


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
                $sort: {
                    createdAt: -1
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

        const cancelledAttendancesPromise = CancelledAttendanceModel.find(searchQuery)

        const attendancesStatsGrowthPromise = AttendanceModel.aggregate([
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

        const attendancesStatsMonthPromise = AttendanceModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%m', date: '$createdAt' } },
                    count: { $sum: 1 }
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

        let [
            attendances, 
            cancelledAttendances, 
            attendancesStatsGrowth,
            attendancesStatsHour,
            attendancesStatsDay,
            attendancesStatsMonth
        ] = await Promise.all([
            attendancesPromise,
            cancelledAttendancesPromise,
            attendancesStatsGrowthPromise,
            attendancesStatsHourPromise,
            attendancesStatsDayPromise,
            attendancesStatsMonthPromise
        ])

        const totalAttendances = attendances.length
        const totalCancelledAttendances = cancelledAttendances.length

        attendancesStatsGrowth.sort((month1, month2) => new Date(month1._id) - new Date(month2._id))

        attendances.forEach(attendance => {
            attendance.package = attendance.package[0]
            attendance.staff = attendance.staff[0]
            attendance.member = attendance.member[0]
        })

        attendancesStatsHour.forEach(hour => hour._id = Number.parseInt(hour._id))
        attendancesStatsHour
        .sort((hour1, hour2) => Number.parseInt(hour1._id) - Number.parseInt(hour2._id))

        attendancesStatsMonth = utils.joinMonths(attendancesStatsMonth)
        attendancesStatsMonth.forEach(attendance => attendance._id = Number.parseInt(attendance._id))
        attendancesStatsMonth.sort((month1, month2) => month1._id - month2._id)

        attendancesStatsDay.forEach((stat) => stat.dayName = config.WEEK_DAYS[stat._id - 1])
        attendancesStatsDay.sort((day1, day2) => day2.count - day1.count)

        return response.status(200).json({
            totalAttendances,
            totalCancelledAttendances,
            attendancesStatsGrowth,
            attendancesStatsHour,
            attendancesStatsDay,
            attendancesStatsMonth,
            attendances,
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getAttendancesByOwner = async (request, response) => {

    try {

        let { ownerId } = request.params

        const owner = await ChainOwnerModel.findById(ownerId)

        const clubs = owner.clubs
        const { searchQuery } = utils.statsQueryGenerator('clubId', clubs, request.query)

        const attendances = await AttendanceModel.aggregate([
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

        attendances.forEach(attendance => {
            attendance.club = attendance.club[0]
            attendance.package = attendance.package[0]
            attendance.staff = attendance.staff[0]
            attendance.member = attendance.member[0]
        })

        return response.status(200).json({
            attendances
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}
const getChainOwnerAttendancesStatsByDate = async (request, response) => {

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


        const attendancesPromise = AttendanceModel.aggregate([
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

        const attendancesStatsGrowthPromise = AttendanceModel.aggregate([
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

        const cancelledAttendancesPromise = CancelledAttendanceModel.find(searchQuery)

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

        const attendancesStatsMonthPromise = AttendanceModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%m', date: '$createdAt' } },
                    count: { $sum: 1 }
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

        const clubsAttendancesStatsPromise = AttendanceModel.aggregate([
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


        let [
            attendances, 
            cancelledAttendances, 
            clubsAttendancesStats,
            attendancesStatsHour,
            attendancesStatsDay,
            attendancesStatsMonth,
            attendancesStatsGrowth
        ] = await Promise.all([
            attendancesPromise,
            cancelledAttendancesPromise,
            clubsAttendancesStatsPromise,
            attendancesStatsHourPromise,
            attendancesStatsDayPromise,
            attendancesStatsMonthPromise,
            attendancesStatsGrowthPromise
        ])

        const totalAttendances = attendances.length
        const totalCancelledAttendances = cancelledAttendances.length

        attendances.forEach(attendance => {
            attendance.club = attendance.club[0]
            attendance.package = attendance.package[0]
            attendance.staff = attendance.staff[0]
            attendance.member = attendance.member[0]
        })

        clubsAttendancesStats.forEach(clubAttendance => clubAttendance.club = clubAttendance.club[0])

        attendancesStatsHour.forEach(hour => hour._id = Number.parseInt(hour._id))
        attendancesStatsHour
        .sort((hour1, hour2) => Number.parseInt(hour1._id) - Number.parseInt(hour2._id))

        attendancesStatsMonth = utils.joinMonths(attendancesStatsMonth)
        attendancesStatsMonth.forEach(attendance => attendance._id = Number.parseInt(attendance._id))
        attendancesStatsMonth.sort((month1, month2) => month1._id - month2._id)

        attendancesStatsDay.forEach((stat) => stat.dayName = config.WEEK_DAYS[stat._id - 1])
        attendancesStatsDay.sort((day1, day2) => day2.count - day1.count)

        return response.status(200).json({
            attendancesStatsGrowth,
            totalAttendances,
            totalCancelledAttendances,
            clubsAttendancesStats,
            attendancesStatsHour,
            attendancesStatsDay,
            attendancesStatsMonth,
            attendances,
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
    addAttendance, 
    getClubAttendancesStatsByDate, 
    getRegistrationAttendancesWithStaffData, 
    getClubAttendances,
    getAttendancesByOwner,
    getChainOwnerAttendancesStatsByDate,
    addAttendanceByMember
}