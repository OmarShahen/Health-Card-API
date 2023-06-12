const config = require('../config/config')
const { transporter } = require('./config/config')

const sendVerificationCode = async (verificationData) => {

    try {

        const { receiverEmail, verificationCode } = verificationData

        const mailOptions = {
            from: config.EMAIL.APP_MAIL,
            to: receiverEmail,
            subject: 'Account Email Verification',
            text: `This is your account verification code ${verificationCode}`
        }

        const success = await transporter.sendMail(mailOptions)

        return { isSent: true }

    } catch(error) {    
        console.error(error)
        return { isSent: false }
    }

}

module.exports = { sendVerificationCode }