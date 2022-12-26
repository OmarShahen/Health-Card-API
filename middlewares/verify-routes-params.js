const utils = require('../utils/utils')
const ClubModel = require('../models/ClubModel')
const RegistrationModel = require('../models/RegistrationModel')
const StaffModel = require('../models/StaffModel')
const PackageModel = require('../models/PackageModel')
const MemberModel = require('../models/MemberModel')
const ChainOwnerModel = require('../models/ChainOwnerModel')
const OfferMessageModel = require('../models/OfferMessageModel')
const PaymentModel = require('../models/paymentModel')
const InstallmentModel = require('../models/InstallmentModel')
const ItemModel = require('../models/ItemModel')
const SupplierModel = require('../models/SupplierModel')

const verifyClubId = async (request, response, next) => {

    try {

        const { clubId } = request.params

        if(!utils.isObjectId(clubId)) {
            return response.status(400).json({
                message: 'invalid club Id formate',
                field: 'clubId'
            })
        }

        const clubList = await ClubModel.find({ _id: clubId })

        if(clubList.length == 0) {
            return response.status(404).json({
                message: 'club Id does not exist',
                field: 'clubId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyRegistrationId = async (request, response, next) => {

    try {

        const { registrationId } = request.params

        if(!utils.isObjectId(registrationId)) {
            return response.status(400).json({
                message: 'invalid registration Id formate',
                field: 'registrationId'
            })
        }

        const registrationList = await RegistrationModel.find({ _id: registrationId })

        if(registrationList.length == 0) {
            return response.status(404).json({
                message: 'registration Id does not exist',
                field: 'registrationId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyStaffId = async (request, response, next) => {

    try {

        const { staffId } = request.params

        if(!utils.isObjectId(staffId)) {
            return response.status(400).json({
                message: 'invalid staff Id formate',
                field: 'staffId'
            })
        }

        const staffList = await StaffModel.find({ _id: staffId })

        if(staffList.length == 0) {
            return response.status(404).json({
                message: 'staff Id does not exist',
                field: 'staffId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyPackageId = async (request, response, next) => {

    try {

        const { packageId } = request.params

        if(!utils.isObjectId(packageId)) {
            return response.status(400).json({
                message: 'invalid package Id formate',
                field: 'packageId'
            })
        }

        const packageList = await PackageModel.find({ _id: packageId })

        if(packageList.length == 0) {
            return response.status(404).json({
                message: 'package Id does not exist',
                field: 'packageId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyMemberId = async (request, response, next) => {

    try {

        const { memberId } = request.params

        if(!utils.isObjectId(memberId)) {
            return response.status(400).json({
                message: 'invalid member Id formate',
                field: 'memberId'
            })
        }

        const memberList = await MemberModel.find({ _id: memberId })

        if(memberList.length == 0) {
            return response.status(404).json({
                message: 'member Id does not exist',
                field: 'memberId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyChainOwnerId = async (request, response, next) => {

    try {

        const { ownerId } = request.params

        if(!utils.isObjectId(ownerId)) {
            return response.status(400).json({
                message: 'invalid owner Id formate',
                field: 'ownerId'
            })
        }

        const owner = await ChainOwnerModel.findById(ownerId)

        if(!owner) {
            return response.status(404).json({
                message: 'owner Id does not exist',
                field: 'ownerId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyOfferMessageId = async (request, response, next) => {

    try {

        const { offerMessageId } = request.params

        if(!utils.isObjectId(offerMessageId)) {
            return response.status(400).json({
                message: 'invalid offer message Id formate',
                field: 'offerMessageId'
            })
        }

        const offerMessage = await OfferMessageModel.findById(offerMessageId)

        if(!offerMessage) {
            return response.status(404).json({
                message: 'offerMessage Id does not exist',
                field: 'offerMessage'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyPaymentId = async (request, response, next) => {

    try {

        const { paymentId } = request.params

        if(!utils.isObjectId(paymentId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid payment Id formate',
                field: 'paymentId'
            })
        }

        const payment = await PaymentModel.findById(paymentId)

        if(!payment) {
            return response.status(404).json({
                accepted: false,
                message: 'payment Id does not exist',
                field: 'paymentId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyInstallmentId = async (request, response, next) => {

    try {

        const { installmentId } = request.params

        if(!utils.isObjectId(installmentId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid installment Id formate',
                field: 'installmentId'
            })
        }

        const installment = await InstallmentModel.findById(installmentId)

        if(!installment) {
            return response.status(404).json({
                accepted: false,
                message: 'installment Id does not exist',
                field: 'installmentId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyItemId = async (request, response, next) => {

    try {

        const { itemId } = request.params

        if(!utils.isObjectId(itemId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid item Id formate',
                field: 'itemId'
            })
        }

        const item = await ItemModel.findById(itemId)

        if(!item) {
            return response.status(404).json({
                accepted: false,
                message: 'item Id does not exist',
                field: 'itemId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifySupplierId = async (request, response, next) => {

    try {

        const { supplierId } = request.params

        if(!utils.isObjectId(supplierId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid supplier Id formate',
                field: 'supplierId'
            })
        }

        const supplier = await SupplierModel.findById(supplierId)

        if(!supplier) {
            return response.status(404).json({
                accepted: false,
                message: 'supplier Id does not exist',
                field: 'supplierId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}



module.exports = { 
    verifyClubId, 
    verifyRegistrationId, 
    verifyStaffId, 
    verifyPackageId, 
    verifyMemberId,
    verifyChainOwnerId,
    verifyOfferMessageId,
    verifyPaymentId,
    verifyInstallmentId,
    verifyItemId,
    verifySupplierId
}