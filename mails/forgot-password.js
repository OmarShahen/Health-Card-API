const config = require('../config/config')
const { transporter } = require('./config/config')

const sendForgotPasswordVerificationCode = async (verificationData) => {

    try {

        const { receiverEmail, verificationCode } = verificationData

        const mailOptions = {
            from: config.EMAIL.APP_MAIL,
            to: receiverEmail,
            subject: 'Forgot Password Verification Code',
            text: `This is your forgot password verification code ${verificationCode}`
        }

        const success = await transporter.sendMail(mailOptions)

        return { isSent: true }

    } catch(error) {    
        console.error(error)
        return { isSent: false }
    }

}

module.exports = { sendForgotPasswordVerificationCode }