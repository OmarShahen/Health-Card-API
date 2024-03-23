const mongoose = require('mongoose')

const SettingSchema = new mongoose.Schema({
    notificationEmail: { type: String, required: true },
    paymentCommission: { type: Number, required: true },
    currencyPriceUSD: { type: Number, default: 48 },
    supportNumber: { type: String, required: true }

}, { timestamps: true })

SettingSchema.statics.getSettings = async function () {
    let settings = await this.findOne()
    if(!settings) {
        const settingsData = {
            notificationEmail: 'omarredaelsayedmohamed@gmail.com',
            paymentCommission: 0.1,
            supportNumber: '+201065630331'
        }
        settings = await this.create(settingsData)
    }

    return settings
}

module.exports = mongoose.model('Setting', SettingSchema)