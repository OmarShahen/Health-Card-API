const mongoose = require('mongoose')
const ClubModel = require('../models/ClubModel')
const RegistrationModel = require('../models/RegistrationModel')
const MemberModel = require('../models/MemberModel')
const StaffModel = require('../models/StaffModel')
const PackageModel = require('../models/PackageModel')
const AttendanceModel = require('../models/AttendanceModel')
const CancelledRegistrationsModel = require('../models/CancelledRegistrationModel')
const CancelledAttendances = require('../models/CancelledAttendanceModel')
const registrationValidation = require('../validations/registrations')
const utils = require('../utils/utils')


const addRegistration = async (request, response) => {

    try {

        const dataValidation = registrationValidation.registrationData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId, memberId, staffId, packageId, paid } = request.body

        const [clubsList, membersList, staffsList, packagesList] = await Promise.all([
            ClubModel.find({ _id: clubId }),
            MemberModel.find({ _id: memberId, clubId }),
            StaffModel.find({ _id: staffId, clubId }),
            PackageModel.find({ _id: packageId, clubId, isActive: true })
        ])

        if(clubsList.length == 0) {
            return response.status(404).json({
                message: 'club Id does not exist',
                field: 'clubId'
            })
        }

        if(membersList.length == 0) {
            return response.status(400).json({
                message: 'member Id does not exist',
                field: 'memberId'
            })
        }

        if(membersList[0].isBlocked == true) {
            return response.status(400).json({
                message: 'member is blocked',
                field: 'memberId'
            })
        }

        if(staffsList.length == 0) {
            return response.status(400).json({
                message: 'staff Id does not exist',
                field: 'staffId'
            })
        }

        if(staffsList[0].isAccountActive == false) {
            return response.status(401).json({
                message: 'staff account is not active',
                field: 'staffId'
            })
        }

        if(packagesList.length == 0) {
            return response.status(400).json({
                message: 'package Id does not exist',
                field: 'packageId'
            })
        }

        const memberActivePackagesList = await RegistrationModel
        .find({ clubId, memberId, isActive: true })

        if(memberActivePackagesList.length != 0) {
            return response.status(400).json({
                message: 'member is already registered in a package',
                field: 'memberId'
            })
        }

        const package = packagesList[0]
        const registrationDate = new Date()
        const expiresAt = utils.calculateExpirationDate(registrationDate, package.expiresIn)

        let isActive = true

        if(package.attendance == 1) {
            isActive = false
        }

        const newRegistrationData = {
            clubId,
            memberId,
            staffId,
            packageId,
            expiresAt,
            paid,
            attended: 1,
            isActive
        }

        const registrationObj = new RegistrationModel(newRegistrationData)
        const newRegistration = await registrationObj.save()

        const newAttendanceData = {
            clubId,
            staffId,
            memberId,
            registrationId: newRegistration._id
        }

        const attendanceObj = new AttendanceModel(newAttendanceData)
        const newAttendance = await attendanceObj.save()

        return response.status(200).json({
            message: 'registered to package successfully',
            registration: newRegistration,
            attendance: newAttendance
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getRegistrations = async (request, response) => {

    try {

        const { clubId } = request.params
        const { status } = request.query

        if(!utils.isObjectId(clubId)) {
            return response.status(400).json({
                message: 'invalid club Id formate',
                field: 'clubId'
            })
        }

        let registrations

        if(status == 'active') {

            registrations = await RegistrationModel
            .find({ clubId, isActive: true })
            .sort({ createdAt: -1 })

        } else if(status == 'expired') {

            registrations = await RegistrationModel
            .find({ clubId, isActive: false })
            .sort({ createdAt: -1 })

        } else {

            registrations = await RegistrationModel
            .find({ clubId })
            .sort({ createdAt: -1 })

        }

        return response.status(200).json({
            registrations
        })

    } catch(error) {
        console.log(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getMemberRegistrations = async (request, response) => {

    try {

        const { clubId, memberId } = request.params

        const memberList = await MemberModel.find({ _id: memberId, clubId })

        if(memberList.length == 0) {
            return response.status(404).json({
                message: 'member does not exist',
                field: 'member'
            })
        }

        const memberRegistrations = await RegistrationModel.aggregate([
            {
                $match: {
                    memberId: mongoose.Types.ObjectId(memberId)
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
                    memberId: 0,
                    staffId: 0,
                    packageId: 0,
                    'staff.password': 0
                }
            },
            {
                $sort: { createdAt: -1 }
            }

        ])

        
        return response.status(200).json({
            memberRegistrations
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateMemberAttendance = async (request, response) => {

    try {

        const { registrationId, staffId } = request.params

        const registrationList = await RegistrationModel.find({ _id: registrationId })

        const registration = registrationList[0]

        const member = await MemberModel.findById(registration.memberId)

        if(member.isBlocked) {
            return response.status(400).json({
                message: 'member is blocked',
                field: 'memberId'
            })
        }

        if(!registration.isActive) {
            return response.status(400).json({
                message: 'member registered package expired',
                field: 'registrationId'
            })
        }

        const currentDate = new Date()

        if(registration.expiresAt < currentDate) {
            
            const updatedRegistration = await RegistrationModel
            .findByIdAndUpdate(registrationId, { isActive: false }, { new: true })

            return response.status(400).json({
                message: 'member registration expired',
                registration: updatedRegistration,
                field: 'registrationId'
            })
        }

        const registeredPackageList = await PackageModel.find({ _id: registration.packageId })

        const MEMBER_CURRENT_ATTENDANCE = registration.attended
        const PACKAGE_ATTENDANCE = registeredPackageList[0].attendance
        const NEW_ATTENDANCE = MEMBER_CURRENT_ATTENDANCE + 1

        let updatedRegistration
        let newAttendance = { staffId, attendanceDate: new Date() }

        if(PACKAGE_ATTENDANCE == NEW_ATTENDANCE) {
            
            updatedRegistration = await RegistrationModel
            .findByIdAndUpdate(registrationId, { attended: NEW_ATTENDANCE, $push: { attendances: newAttendance }, isActive: false }, { new: true })
        
        } else {

            updatedRegistration = await RegistrationModel
            .findByIdAndUpdate(registrationId, { attended: NEW_ATTENDANCE, $push: { attendances: newAttendance } }, { new: true })
 
        }

        return response.status(200).json({
            message: 'updated attendance successfully',
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

const getClubRegistrationsStatsByDate = async (request, response) => {

    try {

        const { clubId, statsDate } = request.params

        if(!utils.isDateValid(statsDate)) {
            return response.status(400).json({
                message: 'invalid date formate',
                field: 'statsDate'
            })
        }

        let fromDateTemp = new Date(statsDate)
        let toDate = new Date(fromDateTemp.setDate(fromDateTemp.getDate() + 1))


        const registrationsPromise = RegistrationModel.aggregate([
            {
                $match: {
                    clubId: mongoose.Types.ObjectId(clubId),
                    createdAt: { $lte: toDate }
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

        const cancelledRegistrationsModelPromise = CancelledRegistrationsModel.aggregate([
            {
                $match: {
                    clubId: mongoose.Types.ObjectId(clubId),
                    createdAt: { $lte: toDate }
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

        const [registrations, cancelledRegistrationsModel] = await Promise.all([
            registrationsPromise,
            cancelledRegistrationsModelPromise
        ])

        const numberOfRegistrations = registrations.length
        const numberOfCancelledRegistrationsModel = cancelledRegistrationsModel.length

        const activeRegistrations = registrations.filter(registration => registration.isActive == true)
        const numberOfActiveRegistrations = activeRegistrations.length

        const expiredRegistrations = registrations
        .filter(registration => registration.expiresAt <= toDate || registration.isActive == false)
        const numberOfExpiredRegistrations = expiredRegistrations.length

        return response.status(200).json({
            numberOfRegistrations,
            numberOfActiveRegistrations,
            numberOfExpiredRegistrations,
            numberOfCancelledRegistrationsModel,
            registrations,
            activeRegistrations,
            expiredRegistrations,
            cancelledRegistrationsModel,
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
    addRegistration, 
    getMemberRegistrations, 
    updateMemberAttendance, 
    getRegistrations,
    getClubRegistrationsStatsByDate,
}