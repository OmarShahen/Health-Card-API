const config = require('../../config/config')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: config.EMAIL.APP_MAIL_SERVICE,
  auth: {
    user: config.EMAIL.APP_MAIL,
    pass: config.EMAIL.APP_MAIL_PASSWORD
  }
})

module.exports = { transporter }