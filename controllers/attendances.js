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
const utils = require('../utils/utils')

const addAttendance = async (request, response) => {

    try {

        const dataValidation = attendanceValidation.attendanceData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { registrationId, staffId } = request.body

        const registration = await RegistrationModel.findById(registrationId)

        if(!registration) {
            return response.status(404).json({
                message: 'registration Id does not exist',
                field: 'registrationId'
            })
        }


        const staff = await StaffModel.findById(staffId)

        if(!staff) {
            return response.status(404).json({
                message: 'staff Id does not exist',
                field: 'staffId'
            })
        }

        if(staff.isAccountActive == false) {
            return response.status(401).json({
                message: 'staff account is not active',
                field: 'staffId'
            })
        }

        const member = await MemberModel.findById(registration.memberId)

        if(member.isBlocked) {
            return response.status(401).json({
                message: 'member account is blocked',
                field: 'memberId'
            })
        }   

        if(registration.isActive == false) {
            return response.status(400).json({
                message: 'member registered expired',
                field: 'registrationId'
            })
        }

        if(registration.isFreezed == true) {
            return response.status(400).json({
                message: 'member registered is freezed',
                field: 'registrationId'
            })
        }

        const currentDate = new Date()

        if(registration.expiresAt < currentDate) {
            
            const updatedRegistration = await RegistrationModel
            .findByIdAndUpdate(registrationId, { isActive: false }, { new: true })

            return response.status(400).json({
                message: 'member registration expired',
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
            message: 'updated attendance successfully',
            attendance: newAttendance,
            registration: updatedRegistration
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}


const getRegistrationAttendancesWithStaffData = async (request, response) => {

    try {

        const { registrationId } = request.params

        const registrationAttendances = await AttendanceModel.aggregate([
            {
                $match: { registrationId: mongoose.Types.ObjectId(registrationId) }
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

        return response.status(200).json({
            attendances: registrationAttendances
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getClubAttendances = async (request, response) => {

    try {

        const { clubId } = request.params

        const attendances = await AttendanceModel.aggregate([
            {
                $match: { clubId: mongoose.Types.ObjectId(clubId) }
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
        const { searchQuery } = utils.statsQueryGenerator('clubId', clubId, request.query)


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

        const cancelledAttendancesPromise = CancelledAttendanceModel.aggregate([
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
            attendances, 
            cancelledAttendances,
            attendancesStatsByMonths,
            attendancesStatsByDays,
            attendancesStatsByHours
        ] = await Promise.all([
            attendancesPromise,
            cancelledAttendancesPromise,
            attendancesStatsByMonthPromise,
            attendancesStatsByDaysPromise,
            attendancesStatsByHoursPromise
        ])

        const totalAttendances = attendances.length
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
            totalAttendances,
            totalCancelledAttendances,
            attendancesStatsByMonths,
            attendancesStatsByDays,
            attendancesStatsByHours,
            attendances,
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



module.exports = { 
    addAttendance, 
    getClubAttendancesStatsByDate, 
    getRegistrationAttendancesWithStaffData, 
    getClubAttendances,
}