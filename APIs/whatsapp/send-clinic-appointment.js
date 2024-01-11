const axios = require('axios')
const config = require('../../config/config')

const whatsappRequest = axios.create({
    baseURL: config.WHATSAPP.BASE_URL,
    headers: {
        Authorization: config.WHATSAPP.TOKEN
    }
})

const sendClinicAppointment = async (phone, languageCode, messageBody) => {

    const requestBody = {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
            name: config.WHATSAPP.SEND_CLINIC_APPOINTMENT,
            language: {
                code: languageCode
            },
            components: [
                {
                    type: "body",
                    parameters: [
                        {
                            type: "text",
                            text: messageBody.expertName
                        },
                        {
                            type: "text",
                            text: messageBody.appointmentId
                        },
                        {
                            type: "text",
                            text: messageBody.appointmentDate
                        },
                        {
                            type: "text",
                            text: messageBody.appointmentTime
                        },
                        {
                            type: "text",
                            text: messageBody.duration
                        },
                        {
                            type: "text",
                            text: messageBody.seekerName
                        },
                    ]
                }
            ]
        }
        
    }
    

    try {
        const sendMessage = await whatsappRequest.post(`/${config.WHATSAPP.PHONE_NUMBER_ID}/messages`, requestBody)
        return { isSent: true }

    } catch(error) {
        console.error(error.response)
        return { isSent: false }
    }

}


module.exports = { sendClinicAppointment }