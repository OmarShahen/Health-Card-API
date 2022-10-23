const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')


const generateForgotPasswordTemplate = (data, lang) => {

    const filePath = lang == 'ar' ? "/templates/reset-password-ar.handlebars" : "/templates/reset-password-en.handlebars"

    const emailTemplate = fs.readFileSync(path.join(__dirname, filePath), 'utf-8')
    const template = handlebars.compile(emailTemplate)
    const messageBody = template(data)

    return messageBody
}

module.exports = { generateForgotPasswordTemplate }