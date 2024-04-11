const CustomerModel = require('../models/CustomerModel')
const UserModel = require('../models/UserModel')
const CounterModel = require('../models/CounterModel')
const customerValidation = require('../validations/customers')
const mongoose = require('mongoose')


const getCustomers = async (request, response) => {

    try {

        const customers = await CustomerModel
        .find()
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            customers
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

const addCustomer = async (request, response) => {

    try {

        const dataValidation = customerValidation.addCustomer(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { seekerId, expertId } = request.body

        const seeker = await UserModel.findById(seekerId)
        const expert = await UserModel.findById(expertId)

        if(!seeker) {
            return response.status(400).json({
                accepted: false,
                message: 'Seeker Id is not registered',
                field: 'seekerId'
            })
        }

        if(!expert) {
            return response.status(400).json({
                accepted: false,
                message: 'Expert Id is not registered',
                field: 'expertId'
            })
        }

        const customerCount = await CustomerModel.countDocuments({ expertId, seekerId })
        if(customerCount != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Expert is already registered with seeker',
                field: 'expertId'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'Customer' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const customerData = { customerId: counter.value, expertId, seekerId }
        const customerObj = new CustomerModel(customerData)
        const newCustomer = await customerObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Added customer successfully!',
            customer: newCustomer
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

const deleteCustomer = async (request, response) => {

    try {

        const { customerId } = request.params

        const deletedCustomer = await CustomerModel.findByIdAndDelete(customerId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted customer successfully!',
            customer: deletedCustomer
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

const getCustomersByExpertId = async (request, response) => {

    try {

        const { userId } = request.params

        const matchQuery = { expertId: mongoose.Types.ObjectId(userId) }

        const customers = await CustomerModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $limit: 25
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'seekerId',
                    foreignField: '_id',
                    as: 'seeker'
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    'seeker.password': 0
                }
            }
        ])

        customers.forEach(customer => customer.seeker = customer.seeker[0])

        const totalCustomers = await CustomerModel.countDocuments(matchQuery)

        return response.status(200).json({
            accepted: true,
            totalCustomers,
            customers
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

const searchCustomersByExpertIdAndSeekerName = async (request, response) => {

    try {

        const { userId } = request.params
        const { name } = request.query

        const matchQuery = { expertId: mongoose.Types.ObjectId(userId) }

        const customers = await CustomerModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'seekerId',
                    foreignField: '_id',
                    as: 'seeker'
                }
            },
            {
                $match: {
                    'seeker.firstName': { $regex: new RegExp(name, 'i') }
                }
            },
            {
                $limit: 20
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    'seeker.password': 0
                }
            }
        ])

        customers.forEach(customer => customer.seeker = customer.seeker[0])

        return response.status(200).json({
            accepted: true,
            customers
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
    getCustomers, 
    addCustomer, 
    deleteCustomer, 
    getCustomersByExpertId,
    searchCustomersByExpertIdAndSeekerName
}