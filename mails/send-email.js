const config = require('../config/config')
const { transporter } = require('./config/config')

const sendEmail = async (mailData) => {

    try {

        const { receiverEmail, subject, mailBodyText, mailBodyHTML } = mailData

        const mailOptions = {
            from: config.EMAIL.APP_MAIL,
            to: receiverEmail,
            subject,
            text: mailBodyText,
            html: mailBodyHTML,
        }

        await transporter.sendMail(mailOptions)

        return { isSent: true }

    } catch(error) {    
        console.error(error)
        return { isSent: false }
    }

}

module.exports = { sendEmail }