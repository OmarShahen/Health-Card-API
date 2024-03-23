const functions = require('firebase-functions')

exports.sendAppointmentReminders = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {

    console.log('The function is working')
})