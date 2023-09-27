const ClinicSubscriptionModel = require('../../models/followup-service/ClinicSubscriptionModel')
const ClinicModel = require('../../models/ClinicModel')
const CounterModel = require('../../models/CounterModel')
const clinicSubscriptionValidator = require('../../validations/followup-service/clinics-subscriptions')
const mongoose = require('mongoose')

const addClinicSubscription = async (request, response) => {

    try {

        const dataValidation = clinicSubscriptionValidator.addClinicSubscription(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clinicId } = request.body

        const clinic = await ClinicModel.findById(clinicId)

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic ID is not registered',
                field: 'clinicId'
            })
        }

        const clinicSubscriptionList = await ClinicSubscriptionModel
        .find({ clinicId, isActive: true, endDate: { $gt: Date.now() } })

        if(clinicSubscriptionList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic has a active subscription',
                field: 'clinicId'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'ClinicSubscription' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const clinicSubcriptionData = { ...request.body }
        clinicSubcriptionData.clinicSubscriptionId = counter.value

        const clinicSubscriptionObj = new ClinicSubscriptionModel(clinicSubcriptionData)
        const newClinicSubscription = await clinicSubscriptionObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Created clinic subscription successfully!',
            clinicSubscription: newClinicSubscription
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

const getClinicsSubscriptions = async (request, response) => {

    try {

        const clinicsSubscriptions = await ClinicSubscriptionModel.aggregate([
            {
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        clinicsSubscriptions.forEach(clinicSubscription => clinicSubscription.clinic = clinicSubscription.clinic[0])

        return response.status(200).json({
            accepted: true,
            clinicsSubscriptions
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

const updateClinicSubscriptionActivity = async (request, response) => {

    try {

        const { clinicSubscriptionId } = request.params
        const { isActive } = request.body

        if(typeof isActive != 'boolean') {
            return response.status(400).json({
                accepted: false,
                message: 'isActive format is invalid',
                field: 'isActive'
            })
        }

        const clinicSubscription = await ClinicSubscriptionModel.findById(clinicSubscriptionId)

        if(isActive == clinicSubscription.isActive) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic subscription is already in this status',
                field: 'clinicSubscriptionId'
            })
        }

        const subscriptionEndDate = new Date(clinicSubscription.endDate)
        const todayDate = new Date()

        if(todayDate > subscriptionEndDate) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic subscription is already expired',
                field: 'clinicSubscriptionId'
            })
        }

        if(isActive) {

            const clinicSubscriptionList = await ClinicSubscriptionModel
            .find({ clinicId: clinicSubscription.clinicId, isActive: true, endDate: { $gt: Date.now() } })

            if(clinicSubscriptionList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Clinic has active subscription',
                    field: 'clinicSubscriptionId'
                })
            }
        }

        const updatedClinicSubscription = await ClinicSubscriptionModel
        .findByIdAndUpdate(clinicSubscriptionId, { isActive }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated clinic subscription successfully!',
            clinicSubscription: updatedClinicSubscription
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

const getClinicSubscriptions = async (request, response) => {

    try {

        const { clinicId } = request.params

        const clinicsSubscriptions = await ClinicSubscriptionModel.aggregate([
            {
                $match: { clinicId: mongoose.Types.ObjectId(clinicId) }
            },
            {
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        clinicsSubscriptions.forEach(clinicSubscription => clinicSubscription.clinic = clinicSubscription.clinic[0])

        return response.status(200).json({
            accepted: true,
            clinicsSubscriptions
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

const deleteClinicSubscription = async (request, response) => {

    try {

        const { clinicSubscriptionId } = request.params

        const deletedClinicSubscription = await ClinicSubscriptionModel.findByIdAndDelete(clinicSubscriptionId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted clinic subscription successfully!',
            clinicSubscription: deletedClinicSubscription
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

const deleteClinicsSubscriptions = async (request, response) => {

    try {

        const deletedClinicsSubscriptions = await ClinicSubscriptionModel.deleteMany()

        return response.status(200).json({
            accepted: true,
            message: 'Deleted clinics subscriptions successfully!',
            clinicsSubscriptions: deletedClinicsSubscriptions
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
    addClinicSubscription, 
    getClinicsSubscriptions,
    getClinicSubscriptions, 
    deleteClinicSubscription,
    deleteClinicsSubscriptions,
    updateClinicSubscriptionActivity
}