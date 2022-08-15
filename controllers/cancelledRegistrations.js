const mongoose = require('mongoose')
const cancelRegistrationValidation = require('../validations/cancelledRegistration')
const CancelledAttendanceModel = require('../models/CancelledAttendanceModel')
const CancelledRegistrationModel = require('../models/CancelledRegistrationModel')
const RegistrationModel = require('../models/RegistrationModel')
const StaffModel = require('../models/StaffModel')
const ClubModel = require('../models/ClubModel')
const PackageModel = require('../models/PackageModel')


const addCancelRegistration = async (request, response) => {

    try {

        const dataValidation = cancelRegistrationValidation.cancelledRegistrationData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId, registrationId, staffId } = request.body

        const [club, registration, staff] = await Promise.all([
            ClubModel.findById(clubId),
            RegistrationModel.findById(registrationId),
            StaffModel.findById(staffId)
        ])

        if(!club) {
            return response.status(404).json({
                message: 'club Id does not exists',
                field: 'clubId'
            })
        }

        if(!registration) {
            return response.status(404).json({
                message: 'registration Id does not exists',
                field: 'registrationId'
            })
        }

        if(!staff) {
            return response.status(404).json({
                message: 'staff Id does not exists',
                field: 'staff'
            })
        }

        const currentDate = new Date()

        if(registration.expiresAt < currentDate) {
            return response.status(400).json({
                message: 'member registration has passed the expiry date',
                field: 'registrationId'
            })
        }

        const package = await PackageModel.findById(registration.packageId)

       if(package.attendance == 1 && (package.expiresIn == '1 day' || package.expiresIn == '1 days')) {
            
        const cancelRegistrationData = {
            clubId,
            staffId,
            memberId: registration.memberId,
            packageId: registration.packageId,
            attended: registration.attended - 1,
            expiresAt: registration.expiresAt,
            paid: registration.paid,
            registrationDate: registration.createdAt
        }
        
        const cancelRegistrationObj = new CancelledRegistrationModel(cancelRegistrationData)

        const [cancelledRegistration, deletedRegistration] = await Promise.all([
            cancelRegistrationObj.save(),
            RegistrationModel.findByIdAndDelete(registrationId)
        ])


        return response.status(200).json({
            message: 'member registration is deleted successfully',
            cancelledRegistration: cancelledRegistration
        })

       }

        if(!registration.isActive) {
            return response.status(400).json({
                message: 'member registration is already expired',
                field: 'registrationId'
            })
        }


        const cancelRegistrationData = {
            clubId,
            staffId,
            memberId: registration.memberId,
            packageId: registration.packageId,
            attended: registration.attended,
            expiresAt: registration.expiresAt,
            paid: registration.paid,
            registrationDate: registration.createdAt
        }

        const cancelRegistrationObj = new CancelledRegistrationModel(cancelRegistrationData)

        const [cancelledRegistration, deletedRegistration] = await Promise.all([
            cancelRegistrationObj.save(),
            RegistrationModel.findByIdAndDelete(registrationId)
        ])
        

        return response.status(200).json({
            message: 'member registration is cancelled successfully',
            cancelledRegistration: cancelledRegistration
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { addCancelRegistration }