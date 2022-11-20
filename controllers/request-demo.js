const validator = require('../validations/requestDemo')
const RequestDemoModel = require('../models/RequestDemoModel')
const { sendRequestDemo } = require('../mails/request-demo')

const addRequestDemo = async (request, response) => {

    try {

        const dataValidation = validator.requestDemo(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        request.body.name = request.body.firstName + ' ' + request.body.lastName

        const requestDemoObj = new RequestDemoModel(request.body)

        const newRequestDemoPromise = requestDemoObj.save()
        const mailResponsePromise = sendRequestDemo(request.body)

        const [newRequestDemo, mailResponse] = await Promise.all([
            newRequestDemoPromise,
            mailResponsePromise
        ])

        return response.status(200).json({
            accepted: true,
            message: 'A Barbells specialist will contact you soon',
            requestDemo: newRequestDemo
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

const getRequestDemo = async (request, response) => {

    try {

        const requestDemos = await RequestDemoModel.find()

        return response.status(200).json({
            accepted: true,
            requestDemos
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

module.exports = { addRequestDemo, getRequestDemo }