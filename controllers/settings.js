const SettingModel = require('../models/SettingModel')
const settingsValidation = require('../validations/settings')


const getSettings = async (request, response) => {

    try {

        const settings = await SettingModel.getSettings()

        return response.status(200).json({
            accepted: true,
            settings
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

const getSeekerSettings = async (request, response) => {

    try {

        const settings = await SettingModel.getSettings()

        const seekerSettings = {
            paymentCommission: settings.paymentCommission,
            currencyPriceUSD: settings.currencyPriceUSD
        }

        return response.status(200).json({
            accepted: true,
            settings: seekerSettings
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

const updateSettings = async (request, response) => {

    try {

        const dataValidation = settingsValidation.updateSettings(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const settings = await SettingModel.getSettings()
        
        const updatedSettings = await SettingModel
        .findByIdAndUpdate(settings._id, request.body, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated settings successfully!',
            settings: updatedSettings
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

module.exports = { getSettings, updateSettings, getSeekerSettings }