const mongoose = require('mongoose')
const config = require('../config/config')
const staffValidation = require('../validations/staffs')
const statsValidation = require('../validations/stats')
const ClubModel = require('../models/ClubModel')
const StaffModel = require('../models/StaffModel')
const RegistrationModel = require('../models/RegistrationModel')
const AttendanceModel = require('../models/AttendanceModel')
const CancelledRegistrationsModel = require('../models/CancelledRegistrationModel')
const CancelledAttendancesModel = require('../models/CancelledAttendanceModel')
const FreezedRegistrationsModel = require('../models/FreezeRegistrationModel')
const ChainOwnerModel = require('../models/ChainOwnerModel')
const bcrypt = require('bcrypt')
const utils = require('../utils/utils')
const translations = require('../i18n/index')

const addClubAdmin = async (request, response) => {

    try {

        const { lang } = request.query
        const dataValidation = staffValidation.staffData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId, name, email, phone, countryCode, password } = request.body

        const club = await ClubModel.findById(clubId)

        if(!club) {
            return response.status(404).json({
                message: 'club Id does not exist',
                field: 'clubId'
            })
        }

        const emailList = await StaffModel.find({ email, isAccountActive: true })

        if(emailList.length != 0) {
            return response.status(400).json({
                message: translations[lang]['Email is already registered'],
                field: 'email'
            })
        }

        const phoneList = await StaffModel.find({ phone, countryCode, isAccountActive: true })

        if(phoneList.length != 0) {
            return response.status(400).json({
                message: translations[lang]['Phone is already registered'],
                field: 'phone'
            })
        }

        const owner = {
            clubId,
            name,
            email,
            phone,
            countryCode,
            password: bcrypt.hashSync(password, config.SALT_ROUNDS),
            role: 'CLUB-ADMIN'
        }       
        
        const ownerObj = new StaffModel(owner)
        const newOwner = await ownerObj.save()

        return response.status(200).json({
            message: translations[lang]['Added new club admin'],
            newOwner
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const addStaff = async (request, response) => {

    try {

        const { lang } = request.query

        const dataValidation = staffValidation.staffData(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId, name, email, phone, countryCode, password } = request.body

        const club = await ClubModel.findById(clubId)

        if(!club) {
            return response.status(404).json({
                message: 'club Id does not exist',
                field: 'clubId'
            })
        }

        if(email) {
            
            const emailList = await StaffModel.find({ email, isAccountActive: true })

            if(emailList.length != 0) {
                return response.status(400).json({
                    message: translations[lang]['Email is already registered'],
                    field: 'email'
                })
            }
        }

        const phoneList = await StaffModel.find({ phone, countryCode, isAccountActive: true })

        if(phoneList.length != 0) {
            return response.status(400).json({
                message: translations[lang]['Phone is already registered'],
                field: 'phone'
            })
        }

        const closedAccountsList = await StaffModel
        .find({ clubId, phone, countryCode, isAccountActive: false })

        if(closedAccountsList.length != 0) {
            return response.status(400).json({
                message: translations[lang]['Staff account is already registered in the club but closed'],
                field:'staffId'
            })
        }

        const staff = {
            clubId,
            name,
            email,
            phone,
            countryCode,
            password: bcrypt.hashSync(password, config.SALT_ROUNDS),
            role: 'STAFF'
        }       
        
        const staffObj = new StaffModel(staff)
        const newStaff = await staffObj.save()

        return response.status(200).json({
            message: translations[lang][`Added new club staff`],
            newStaff
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getStaffs = async (request, response) => {

    try {

        const { clubId } = request.params
        const { status } = request.query

        let staffs 

        if(status == 'active') {

            staffs = await StaffModel
            .find({ clubId, role: 'STAFF', isAccountActive: true })
            .sort({ createdAt: -1 })
            .select({ password: 0 })

        } else if(status == 'removed') {

            staffs = await StaffModel
            .find({ clubId, role: 'STAFF', isAccountActive: false })
            .sort({ createdAt: -1 })
            .select({ password: 0 })

        } else {

            staffs = await StaffModel
            .find({ clubId, role: 'STAFF' })
            .sort({ isAccountActive: -1, createdAt: -1 })
            .select({ password: 0 })
        }

        return response.status(200).json({
            staffs
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getClubAdmins = async (request, response) => {

    try {

        const { clubId } = request.params
        const { status } = request.query

        let staffs 

        if(status == 'active') {

            staffs = await StaffModel
            .find({ clubId, role: 'CLUB-ADMIN', isAccountActive: true })
            .sort({ createdAt: -1 })
            .select({ password: 0 })

        } else if(status == 'removed') {

            staffs = await StaffModel
            .find({ clubId, role: 'CLUB-ADMIN', isAccountActive: false })
            .sort({ createdAt: -1 })
            .select({ password: 0 })

        } else {

            staffs = await StaffModel
            .find({ clubId, role: 'CLUB-ADMIN' })
            .sort({ createdAt: -1 })
            .select({ password: 0 })
        }

        return response.status(200).json({
            staffs
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateStaff = async (request, response) => {

    try {

        const { lang } = request.query
        const dataValidation = staffValidation.updateStaffData(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { staffId } = request.params
        const { name, email, countryCode, phone } = request.body

        const staff = await StaffModel.findById(staffId)

        if(email && staff.email != email) {

            const emailList = await StaffModel
            .find({ email, isAccountActive: true })

            if(emailList.length != 0) {
                return response.status(400).json({
                    message: translations[lang]['Email is already registered'],
                    field: 'email'
                })
            }
        }

        if(countryCode == staff.countryCode && staff.phone != phone) {

            const phoneList = await StaffModel
            .find({ phone, countryCode, isAccountActive: true })

            if(phoneList.length != 0) {
                return response.status(400).json({
                    message: translations[lang]['Phone is already registered'],
                    field: 'phone'
                })
            }
        }


        let newStaff

        if(email) {
            newStaff = { name, email, countryCode, phone }
        } else {
            newStaff = { name, countryCode, phone }
        }

        const updatedStaff = await StaffModel
        .findByIdAndUpdate(
            staffId,
            newStaff,
            { new: true }
        )
        
        updatedStaff.password = null

        return response.status(200).json({
            message: translations[lang]['Staff member is updated successfully'],
            staff: updatedStaff
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteStaff = async (request, response) => {

    try {

        const { lang } = request.query
        const { staffId } = request.params

        const registrationList = await RegistrationModel
        .find({ staffId })

        if(registrationList.length != 0) {
            return response.status(400).json({
                message: translations[lang]['This staff member is registered in some members registrations'],
                field: 'staffId'
            })
        }

        const deletedStaff = await StaffModel
        .findByIdAndDelete(staffId)

        return response.status(200).json({
            message: translations[lang]['Staff is deleted successfully'],
            staff: deletedStaff
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateStaffStatus = async (request, response) => {

    try {

        const { lang } = request.query

        const { staffId } = request.params
        const { isAccountActive } = request.body


        if(typeof isAccountActive != 'boolean') {
            return response.status(400).json({
                message: 'staff status must be boolean',
                field: 'isAccountActive'
            })
        }

        const staff = await StaffModel.findById(staffId)

        if(!staff.isAccountActive && isAccountActive == true) {

            const staffList = await StaffModel
            .find({ countryCode: staff.countryCode, phone: staff.phone, isAccountActive: true })

            if(staffList.length != 0) {
                return response.status(400).json({
                    message: translations[lang]['This staff account is used in another club'],
                    field: 'staffId'
                })
            }
        }

        const updatedStaff = await StaffModel
        .findByIdAndUpdate(
            staffId,
            { isAccountActive },
            { new: true }
        )

        return response.status(200).json({
            message: translations[lang]['Staff status is updated successfully'],
            staff: updatedStaff
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteStaffAndRelated = async (request, response) => {

    try {

        const { staffId } = request.params

        const deletedRegistrations = await RegistrationModel
        .deleteMany({ staffId })

        const deletedStaff = await StaffModel
        .findByIdAndDelete(staffId)

        return response.status(200).json({
            message: 'staff deleted successfully and all related data',
            staff: deletedStaff,
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

const getStaffStatsByDate = async (request, response) => {

    try {

        const dataValidation = statsValidation.statsDates(request.query)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { staffId } = request.params
        const { searchQuery } = utils.statsQueryGenerator('staffId', staffId, request.query)

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
                    from: 'clubs',
                    localField: 'clubId',
                    foreignField: '_id',
                    as: 'club'
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

                }
            }
        ]) 

        const cancelledRegistrationsPromise = CancelledRegistrationsModel.aggregate([
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

        const cancelledAttendancesPromise = CancelledAttendancesModel.aggregate([
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



        const [registrations, attendances, cancelledRegistrations, cancelledAttendances] = await Promise.all([
            registrationsPromise,
            attendancesPromise,
            cancelledRegistrationsPromise,
            cancelledAttendancesPromise,
        ])

        const totalRegistrations = registrations.length
        const totalAttendances = attendances.length
        const totalCancelledRegistrations = cancelledRegistrations.length
        const totalCancelledAttendances = cancelledAttendances.length
        const totalEarnings = utils.calculateRegistrationsTotalEarnings(registrations)

        

        return response.status(200).json({
            totalRegistrations,
            totalAttendances,
            totalCancelledRegistrations,
            totalCancelledAttendances,
            totalEarnings,
            registrations,
            attendances,
            cancelledRegistrations,
            cancelledAttendances,
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getStaffsByOwner = async (request, response) => {

    try {

        let { ownerId, role } = request.params
        
        role = role.toUpperCase()

        if(!config.APP_ROLES.includes(role)) {
            return response.status(400).json({
                message: 'invalid role',
                field: 'role'
            })
        }

        const owner = await ChainOwnerModel.findById(ownerId)

        const clubs = owner.clubs

        const staffs = await StaffModel.aggregate([
            {
                $match: {
                    clubId: { $in: clubs },
                    role
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

        staffs.forEach(staff => staff.club = staff.club[0])

        return response.status(200).json({
            staffs
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateStaffRole = async (request, response) => {

    try {

        const { staffId } = request.params
        const { lang } = request.query
        const { role } = request.body

        const clubRoles = [config.ROLES.CLUB_ADMIN, config.ROLES.STAFF]

        if(!clubRoles.includes(role)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid role',
                field: 'role'
            })
        }

        const staff = await StaffModel.findById(staffId)

        if(!staff || !staff.isAccountActive) {
            return response.status(404).json({
                accepted: false,
                message: 'Staff account does not exists in the club',
                field: 'staffId'
            })
        }

        const updatedStaff = await StaffModel
        .findByIdAndUpdate(staff._id, { role }, { new: true })
        .select({ password: 0 })


        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Updated staff role successfully'],
            staff: updatedStaff
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
    addClubAdmin, 
    addStaff, 
    getStaffs, 
    getClubAdmins,
    updateStaff, 
    deleteStaff, 
    updateStaffStatus,
    deleteStaffAndRelated,
    getStaffStatsByDate,
    getStaffsByOwner,
    updateStaffRole
 }
