const mongoose = require('mongoose')
const attendanceValidation = require('../validations/attendances')
const statsValidation = require('../validations/stats')
const RegistrationModel = require('../models/RegistrationModel')
const MemberModel = require('../models/MemberModel')
const StaffModel = require('../models/StaffModel')
const PackageModel = require('../models/PackageModel')
const AttendanceModel = require('../models/AttendanceModel')
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
            staffId: registration.staffId,
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

        const attendancesStatsByMonthsPromise = AttendanceModel.aggregate([
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

        const [attendancesStatsByHours, attendancesStatsByMonths] = await Promise.all([
            attendancesStatsByHoursPromise,
            attendancesStatsByMonthsPromise
        ])

        return response.status(200).json({
            attendancesStatsByHours,
            attendancesStatsByMonths
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { addAttendance, getClubAttendancesStatsByDate }