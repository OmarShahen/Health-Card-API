const RegistrationModel = require('../models/RegistrationModel')
const InstallmentModel = require('../models/InstallmentModel')
const installmentsValidation = require('../validations/installments')
const mongoose = require('mongoose')
const StaffModel = require('../models/StaffModel')

const addInstallment = async (request, response) => {

    try {

        const { registrationId } = request.params
        const { lang } = request.query
        const { staffId, paid } = request.body

        const dataValidation = installmentsValidation.addInstallment(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const staff = await StaffModel.findById(staffId)
        if(!staff) {
            return response.status(404).json({
                accepted: false,
                message: translations[lang]['Staff is not found'],
                field: 'staffId'
            })
        }

        const registration = await RegistrationModel.findById(registrationId)
        if(!registration.isInstallment) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Installment is closed for this registration'],
                field: 'isInstallment'
            })
        }

        if(registration.isPaidFull) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Registration is paid full'],
                field: 'isPaidFull'
            })
        }

        const NEW_PAID = registration.paid + paid

        if(NEW_PAID > registration.originalPrice) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Amount paid is more than the required'],
                field: 'paid'
            })
        }

        let isPaidFull = NEW_PAID == registration.originalPrice ? true : false
        const AMOUNT_REMAIN = registration.originalPrice - NEW_PAID

        const installmentData = {
            clubId: registration.clubId,
            staffId,
            memberId: registration.memberId,
            packageId: registration.packageId,
            registrationId: registration._id,
            paid
        }

        const installmentObj = new InstallmentModel(installmentData)

        const updateRegistrationPromise = RegistrationModel
        .findByIdAndUpdate(registrationId, { isPaidFull, paid: NEW_PAID }, { new: true })

        const [installment, updatedRegistration] = await Promise.all([
            installmentObj.save(),
            updateRegistrationPromise
        ])

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Payment is recorded successfully'],
            remainigAmount: AMOUNT_REMAIN,
            installment,
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

const getClubInstallments = async (request, response) => {

    try {

        const { clubId } = request.params

        const installments = await InstallmentModel.aggregate([
            {
                $match: { clubId: mongoose.Types.ObjectId(clubId) }
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
                $project: {
                    'staff.password': 0
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        installments.forEach(installment => {
            installment.staff = installment.staff[0]
            installment.package = installment.package[0]
            installment.member = installment.member[0]
        })

        return response.status(200).json({
            accepted: true,
            installments
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

const getRegistrationInstallments = async (request, response) => {

    try {

        const { registrationId } = request.params

        const installments = await InstallmentModel.aggregate([
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
                $project: {
                    'staff.password': 0
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        installments.forEach(installment => {
            installment.staff = installment.staff[0]
        })

        return response.status(200).json({
            accepted: true,
            installments
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

const deleteInstallment = async (request, response) => {

    try {

        const { installmentId } = request.params

        const installment = await InstallmentModel.findById(installmentId)
        const registration = await RegistrationModel.findById(installment.registrationId)

        const NEW_PAID = registration.paid - installment.paid

        const updatedRegistrationPromise = RegistrationModel
        .findByIdAndUpdate(registration._id, { paid: NEW_PAID, isPaidFull: false }, { new: true })

        const deleteInstallmentPromise = InstallmentModel.findByIdAndDelete(installmentId)

        const [updatedRegistration, deletedInstallment] = await Promise.all([
            updatedRegistrationPromise,
            deleteInstallmentPromise
        ])

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Deleted payment successfully'],
            installment: deletedInstallment,
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



module.exports = { 
    addInstallment, 
    deleteInstallment, 
    getClubInstallments,
    getRegistrationInstallments
}