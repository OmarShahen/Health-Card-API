const config = require('../config/config')
const { transporter } = require('./config/config')

const sendDeleteAccountCode = async (verificationData) => {

    try {

        const { receiverEmail, verificationCode } = verificationData

        const mailOptions = {
            from: config.EMAIL.APP_MAIL,
            to: receiverEmail,
            subject: 'Delete Account Verification Code',
            text: `This is your delete account verification code ${verificationCode}`
        }

        const success = await transporter.sendMail(mailOptions)

        return { isSent: true }

    } catch(error) {    
        console.error(error)
        return { isSent: false }
    }

}

module.exports = { sendDeleteAccountCode }