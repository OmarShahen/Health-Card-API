const PromoCodeModel = require('../models/PromoCodeModel')
const promoCodeValidation = require('../validations/promoCodes')
const CounterModel = require('../models/CounterModel')
const AppointmentModel = require('../models/AppointmentModel')


const getPromoCodes = async (request, response) => {

    try {

        const promoCodes = await PromoCodeModel
        .find()
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            promoCodes  
        })

    } catch(error) {
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getPromoCodeByCode = async (request, response) => {

    try {

        const { code } = request.params

        const promoCodes = await PromoCodeModel.find({ code })

        return response.status(200).json({
            accepted: true,
            promoCodes  
        })

    } catch(error) {
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const addPromoCode = async (request, response) => {

    try {

        const dataValidation = promoCodeValidation.addPromoCode(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { code } = request.body

        const promoCodesList = await PromoCodeModel.find({ code })
        if(promoCodesList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Code is already registered',
                field: 'code'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'promoCode' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const promoCodeData = { promoCodeId: counter.value, ...request.body }
        const promoCodeObj = new PromoCodeModel(promoCodeData)
        const newPromoCode = await promoCodeObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Added promo code successfully!',
            promoCode: newPromoCode 
        })

    } catch(error) {
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const updatePromoCode = async (request, response) => {

    try {

        const dataValidation = promoCodeValidation.updatePromoCode(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { promoCodeId } = request.params
        const { code } = request.body

        const promoCode = await PromoCodeModel.findById(promoCodeId)

        if(promoCode.code != code) {
            const promoCodesList = await PromoCodeModel.find({ code })
            if(promoCodesList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Code is already registered',
                    field: 'code'
                })
            }
        }

        const updatedPromoCode = await PromoCodeModel
        .findByIdAndUpdate(promoCodeId, request.body, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated promo code successfully!',
            promoCode: updatedPromoCode 
        })

    } catch(error) {
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const updatePromoCodeActivity = async (request, response) => {

    try {

        const { promoCodeId } = request.params

        const dataValidation = promoCodeValidation.updatePromoCodeActivity(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { isActive } = request.body

        const updatedPromoCode = await PromoCodeModel
        .findByIdAndUpdate(promoCodeId, { isActive }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated promo code successfully!',
            promoCode: updatedPromoCode 
        })

    } catch(error) {
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const deletePromoCode = async (request, response) => {

    try {

        const { promoCodeId } = request.params

        const totalAppointments = await AppointmentModel.countDocuments({ promoCodeId })
        if(totalAppointments != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Promo Code is registered with appointments',
                field: 'promoCodeId'
            })
        }

        const deletedPromoCode = await PromoCodeModel.findByIdAndDelete(promoCodeId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted promo code successfully!',
            promoCode: deletedPromoCode
        })

    } catch(error) {
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}


module.exports = { 
    getPromoCodes, 
    addPromoCode,
    updatePromoCode, 
    getPromoCodeByCode,
    updatePromoCodeActivity,
    deletePromoCode
}