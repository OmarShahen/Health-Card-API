const PaymentModel = require('../models/paymentModel')
const validator = require('../validations/payments')
const config = require('../config/config')
const utils = require('../utils/utils')

const addPayment = async (request, response) => {

    try {

        const dataValidation = validator.addPayment(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId } = request.params
        const { type, description, amount, price } = request.body

        const paymentData = { clubId, type, description, amount, price }

        const paymentObj = new PaymentModel(paymentData)
        const newPayment = await paymentObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Payment is recorded successfully',
            payment: newPayment
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

const getPayments = async (request, response) => {

    try {

        const { clubId } = request.params
        const { type } = request.query

        const { searchQuery } = utils.statsQueryGenerator('clubId', clubId, request.query)

        let payments = []

        if(type == 'EARN' || type == 'DEDUCT') {

            searchQuery.type = type
            payments = await PaymentModel
            .find(searchQuery)
            .sort({ createdAt: -1 })
        } else {
            payments = await PaymentModel
            .find(searchQuery) 
            .sort({ createdAt: -1 })
        }

        return response.status(200).json({
            accepted: true,
            payments
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

const deletePayment = async (request, response) => {

    try {

        const { paymentId } = request.params

        const deletedPayment = await PaymentModel.findByIdAndDelete(paymentId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted payment successfully',
            payment: deletedPayment
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

const updatePayment = async (request, response) => {

    try {

        const { paymentId } = request.params

        const dataValidation = validator.updatePayment(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { description, amount, price } = request.body

        const updatedPayment = await PaymentModel
        .findByIdAndUpdate(paymentId, { description, amount, price }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated payment successfully',
            payment: updatedPayment
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

module.exports = { addPayment, getPayments, deletePayment, updatePayment }