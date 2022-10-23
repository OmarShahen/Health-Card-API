const config = require('../config/config')
const nodemailer = require('nodemailer')
const templateGenerator = require('./template-generator')
const translations = require('../i18n/index')

const transporter = nodemailer.createTransport({
  service: config.EMAIL.APP_MAIL_SERVICE,
  auth: {
    user: config.EMAIL.APP_MAIL,
    pass: config.EMAIL.APP_MAIL_PASSWORD
  }
})

const sendResetPassword = async (user, lang) => {

    try {

        const mailData = {
            name: user.name,
            link: `${config.WEB_FORGOT_PASSWORD_URL}/${user.token}`
        }

        const mailOptions = {
            from: config.EMAIL.APP_MAIL,
            to: user.email,
            subject: translations[lang]['Account Password Reset'],
            html: templateGenerator.generateForgotPasswordTemplate(mailData, lang),
        }

        const success = await transporter.sendMail(mailOptions)

        return { isSent: true }

    } catch(error) {    
        console.error(error)
        return { isSent: false }
    }

}

module.exports = { sendResetPassword }