const mongoose = require('mongoose')
const PaymentModel = require('../models/paymentModel')
const StaffModel = require('../models/StaffModel')
const RegistrationModel = require('../models/RegistrationModel')
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
        const { type, category, staffId, staffIdPayroll, description, amount, price } = request.body

        const staff = await StaffModel.findById(staffId)

        if(!staff) {
            return response.status(404).json({
                accepted: false,
                message: 'Staff Id does not exist',
                field: 'staffId'
            })
        }

        if(!staff.isAccountActive) {
            return response.status(404).json({
                accepted: false,
                message: 'Staff account is closed',
                field: 'staffId'
            })
        }

        if(category == 'PAYROLL') {

            const staffPayroll = await StaffModel.findById(staffIdPayroll)

            if(!staffPayroll) {
                return response.status(404).json({
                    accepted: false,
                    message: 'Staff Id does not exist',
                    field: 'staffIdPayroll'
                })
            }

            if(!staffPayroll.isAccountActive) {
                return response.status(404).json({
                    accepted: false,
                    message: 'Staff account is closed',
                    field: 'staffIdPayroll'
                })
            }
        }


        const paymentData = { 
            clubId, 
            type, 
            category, 
            staffId, 
            staffIdPayroll, 
            description, 
            amount, 
            price, 
            total: price * amount 
        }

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
        const { category } = request.query

        const { searchQuery } = utils.statsQueryGenerator('clubId', clubId, request.query)

        if(category) {
            searchQuery.category = category   
        }
        
        const payments = await PaymentModel.aggregate([
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
                    'staffPayroll.password': 0
                }
            }
        ])

        payments.forEach(payment => {
            payment.staff = payment.staff[0]
        })

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

const getClubPaymentsStats = async (request, response) => {

    try {

        const { clubId } = request.params

        let { searchQuery } = utils.statsQueryGenerator('clubId', clubId, request.query)

        const payments = await PaymentModel.aggregate([
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
                }
            }
        ])

        const registrations = await RegistrationModel.find(searchQuery)
        

        searchQuery.type = 'EARN'
        const earningsStats = await PaymentModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: '$total' }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ])

        searchQuery.type = 'DEDUCT'
        const deductionsStats = await PaymentModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: '$total' }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ])

        payments.forEach(payment => {
            payment.staff = payment.staff[0]
        })


        const TOTAL_REGISTRATIONS = utils.calculateRegistrationsTotalEarnings(registrations)
        const TOTAL_EARNINGS = utils.calculateTotalPaymentsByType(payments, 'EARN')
        const TOTAL_DEDUCTIONS = utils.calculateTotalPaymentsByType(payments, 'DEDUCT')
        const NET_PROFIT = (TOTAL_REGISTRATIONS + TOTAL_EARNINGS) - TOTAL_DEDUCTIONS

        earningsStats.push({ _id: 'Registrations', count: TOTAL_REGISTRATIONS })

        return response.status(200).json({
            accepted: true,
            deductionsStats,
            earningsStats,
            netProfit: NET_PROFIT,
            totalRegistrations: TOTAL_REGISTRATIONS,
            totalEarnings: TOTAL_EARNINGS,
            totalDeductions: TOTAL_DEDUCTIONS,
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

module.exports = { addPayment, getPayments, deletePayment, updatePayment, getClubPaymentsStats }