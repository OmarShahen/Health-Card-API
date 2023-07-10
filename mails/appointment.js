const config = require('../config/config')
const { transporter } = require('./config/config')

const sendAppointmentEmail = async (mailData) => {

    try {

        const { receiverEmail, appointmentData } = mailData
        const { clinicName, clinicCity, serviceName, appointmentDate } = appointmentData

        const mailOptions = {
            from: config.EMAIL.APP_MAIL,
            to: receiverEmail,
            subject: 'New Clinic Appointment',
            text: `You have a new appointment in ${clinicName} in ${clinicCity} for ${serviceName} at ${appointmentDate}.`,
        }

        const success = await transporter.sendMail(mailOptions)

        return { isSent: true }

    } catch(error) {    
        console.error(error)
        return { isSent: false }
    }

}

module.exports = { sendAppointmentEmail }