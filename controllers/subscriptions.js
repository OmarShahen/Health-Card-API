const SubscriptionModel = require('../models/SubscriptionModel')

const getSubscriptions = async (request, response) => {

    try {

        const subscriptions = await SubscriptionModel
        .find()
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            subscriptions
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

const isClinicHasSubscription = async (request, response) => {

    try {

        const { clinicId } = request.params

        const subcriptions = await SubscriptionModel
        .find({ clinicId, endDate: { $gt: Date.now() } })

        if(subcriptions.length == 0) {
            return response.status(200).json({
                accepted: true,
                isSubscriptionActive: false,
            })
        }

        return response.status(200).json({
            accepted: true,
            isSubscriptionActive: true,
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

const deleteSubscription = async (request, response) => {

    try {

        const { subscriptionId } = request.params

        const deletedSubscription = await SubscriptionModel.findByIdAndDelete(subscriptionId)

        return response.status(200).json({
            accepted: true,
            subscription: deletedSubscription
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

module.exports = { getSubscriptions, isClinicHasSubscription, deleteSubscription }