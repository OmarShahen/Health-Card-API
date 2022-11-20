const utils = require('../utils/utils')
const NewsLetterModel = require('../models/NewsLetter')

const addEmailToNewsLetter = async (request, response) => {

    try {

        const { email } = request.body

        if(!email) {
            return response.status(400).json({
                accepted: true,
                message: 'Email is required',
                field: 'email'
            })
        }

        if(!utils.isEmailValid(email)) {
            return response.status(400).json({
                accepted: true,
                message: 'Invalid email formate',
                field: 'email'
            })
        }

        const emailList = await NewsLetterModel.find({ email })

        if(emailList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Email is already registered to our news letter',
                field: 'email'
            })
        }

        const emailObj = new NewsLetterModel({ email })
        const addedEmail = await emailObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Your are now added to our news letter',
            email: addedEmail
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { addEmailToNewsLetter }