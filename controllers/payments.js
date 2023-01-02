const mongoose = require('mongoose')
const PaymentModel = require('../models/paymentModel')
const StaffModel = require('../models/StaffModel')
const RegistrationModel = require('../models/RegistrationModel')
const validator = require('../validations/payments')
const config = require('../config/config')
const utils = require('../utils/utils')
const translations = require('../i18n/index')

const addPayment = async (request, response) => {

    try {

        const { lang } = request.query

        const dataValidation = validator.addPayment(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId } = request.params
        const { type, category, staffId, description, amount, price } = request.body

        if(type == 'EARN' && category != 'INVENTORY') {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Only deduct payment is valid in this category'],
                field: 'type'
            })
        }

        if(category != 'INVENTORY' && amount > 1) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Amount must be equal to 1 in this category'],
                field: 'amount'
            })
        }


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


        const paymentData = { 
            clubId, 
            type, 
            category, 
            staffId, 
            description, 
            amount, 
            price, 
            total: price * amount 
        }

        const paymentObj = new PaymentModel(paymentData)
        const newPayment = await paymentObj.save()

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Payment is recorded successfully'],
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

const addPayrollPayment = async (request, response) => {

    try {

        const { lang } = request.query

        const dataValidation = validator.addPayrollPayment(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId } = request.params
        const { staffId, staffIdPayroll, paid } = request.body

        const payrollPayment = { clubId, type: 'DEDUCT', category: 'PAYROLL', staffId, staffIdPayroll, price: paid, total: paid }
        
        const paymentObj = new PaymentModel(payrollPayment)
        const newPayment = await paymentObj.save()

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Payroll payment is recorded successfully'],
            payment: newPayment
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error
        })
    }
}

const addBillPayment = async (request, response) => {

    try {

        const { lang } = request.query

        const dataValidation = validator.addBillPayment(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId } = request.params
        const { description, staffId, paid, imageURL } = request.body

        const billPayment = { clubId, description, type: 'DEDUCT', category: 'BILL', staffId, price: paid, total: paid, imageURL }
        
        const paymentObj = new PaymentModel(billPayment)
        const newPayment = await paymentObj.save()

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Bill payment is recorded succesfully'],
            payment: newPayment
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error
        })
    }
}

const addMaintenancePayment = async (request, response) => {

    try {

        const { lang } = request.query

        const dataValidation = validator.addMaintenancePayment(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId } = request.params
        const { description, staffId, paid } = request.body

        const billPayment = { clubId, description, type: 'DEDUCT', category: 'MAINTENANCE', staffId, price: paid, total: paid }
        
        const paymentObj = new PaymentModel(billPayment)
        const newPayment = await paymentObj.save()

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Maintenance payment is recorded succesfully'],
            payment: newPayment
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error
        })
    }
}

const getClubPayrolls = async (request, response) => {

    try {

        const { clubId } = request.params
        let { searchQuery } = utils.statsQueryGenerator('clubId', clubId, request.query)
        searchQuery.category = 'PAYROLL'

        const payrolls = await PaymentModel.aggregate([
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
                $lookup: {
                    from: 'staffs',
                    localField: 'staffIdPayroll',
                    foreignField: '_id',
                    as: 'staffPayroll'
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

        payrolls.forEach(payroll => {
            payroll.staff = payroll.staff[0]
            payroll.staffPayroll = payroll.staffPayroll[0]
        })

        return response.status(200).json({
            accepted: true,
            payrolls
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

        const { lang } = request.query
        const { paymentId } = request.params

        const deletedPayment = await PaymentModel.findByIdAndDelete(paymentId)

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Deleted payment successfully'],
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

        const { lang } = request.query
        const { paymentId } = request.params

        const dataValidation = validator.updatePayment(request.body, lang)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { description, amount, price } = request.body

        const updatedPayment = await PaymentModel
        .findByIdAndUpdate(paymentId, { description, amount, price, total: amount * price }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Updated payment successfully'],
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

        const paymentsPromise = PaymentModel.aggregate([
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

        const registrationsPromise = RegistrationModel.find(searchQuery)
        
        let earnSearchQuery = { ...searchQuery, type: 'EARN' }
        let deductSearchQuery = { ...searchQuery, type: 'DEDUCT' }

        const earningsStatsPromise = PaymentModel.aggregate([
            {
                $match: earnSearchQuery
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

        const deductionsStatsPromise = PaymentModel.aggregate([
            {
                $match: deductSearchQuery
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

        const [payments, registrations, earningsStats, deductionsStats] = await Promise.all([
            paymentsPromise,
            registrationsPromise,
            earningsStatsPromise,
            deductionsStatsPromise
        ])

        payments.forEach(payment => {
            payment.staff = payment.staff[0]
        })


        const TOTAL_REGISTRATIONS = utils.calculateRegistrationsTotalEarnings(registrations)
        const TOTAL_EARNINGS = utils.calculateTotalPaymentsByType(payments, 'EARN')
        const TOTAL_DEDUCTIONS = utils.calculateTotalPaymentsByType(payments, 'DEDUCT')
        const NET_PROFIT = (TOTAL_REGISTRATIONS + TOTAL_EARNINGS) - TOTAL_DEDUCTIONS

        const allPayments = [...utils.formateRegistrationsToPayments(registrations), ...payments]
        const sortedPayments = allPayments.sort((pay1, pay2) => pay2.createdAt - pay1.createdAt)

        earningsStats.push({ _id: 'Registrations', count: TOTAL_REGISTRATIONS })

        return response.status(200).json({
            accepted: true,
            deductionsStats,
            earningsStats,
            netProfit: NET_PROFIT,
            totalRegistrations: TOTAL_REGISTRATIONS,
            totalEarnings: TOTAL_EARNINGS,
            totalDeductions: TOTAL_DEDUCTIONS,
            payments: sortedPayments
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

const getClubCategoryPaymentsStats = async (request, response) => {

    try {

        let { clubId, category } = request.params
        category = category.toUpperCase()

        let { searchQuery } = utils.statsQueryGenerator('clubId', clubId, request.query)
        searchQuery.category = category

        if(!config.CLUB_PAYMENT_CATEGORIES.includes(category)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid category',
                field: 'category'
            })
        }

        const categoryPayments = await PaymentModel.aggregate([
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
                    'staff.password': 0
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
                    _id: '$description',
                    count: { $sum: '$total' }
                }
            }
        ])

        let earningsStats

        if(category == 'INVENTORY') {
            searchQuery.type = 'EARN'
            earningsStats = await PaymentModel.aggregate([
                {
                    $match: searchQuery
                },
                {
                    $group: {
                        _id: '$description',
                        count: { $sum: '$total' }
                    }
                }
            ])
        }

        let TOTAL_PAYMENTS
        let TOTAL_EARNINGS
        let TOTAL_DEDUCTIONS
        let NET_PROFIT

        if(category == 'INVENTORY') {

            TOTAL_EARNINGS = utils.calculateTotalPaymentsByType(categoryPayments, 'EARN')
            TOTAL_DEDUCTIONS = utils.calculateTotalPaymentsByType(categoryPayments, 'DEDUCT')
            NET_PROFIT = TOTAL_EARNINGS - TOTAL_DEDUCTIONS

        } else {
            TOTAL_PAYMENTS = utils.calculateTotalPayments(categoryPayments)
        }

        const TOTAL_OPERATIONS = categoryPayments.length
        const TOTAL_WAYS = deductionsStats.length

        categoryPayments.forEach(payment => payment.staff = payment.staff[0])

        return response.status(200).json({
            accepted: true,
            totalPayments: TOTAL_PAYMENTS,
            totalEarnings: TOTAL_EARNINGS,
            totalDeductions: TOTAL_DEDUCTIONS,
            netProfit: NET_PROFIT,
            totalOperations: TOTAL_OPERATIONS,
            totalWays: TOTAL_WAYS,
            deductionsStats,
            earningsStats,
            payments: categoryPayments
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
    addPayment, 
    getPayments, 
    deletePayment, 
    updatePayment, 
    getClubPaymentsStats,
    getClubCategoryPaymentsStats,
    addPayrollPayment,
    getClubPayrolls,
    addBillPayment,
    addMaintenancePayment
}