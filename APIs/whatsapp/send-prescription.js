const axios = require('axios')
const config = require('../../config/config')

const whatsappRequest = axios.create({
    baseURL: config.WHATSAPP.BASE_URL,
    headers: {
        Authorization: config.WHATSAPP.TOKEN
    }
})

const sendPrescription = async (phone, languageCode, doctorName, prescriptionURL) => {

    const requestBody = {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
            name: config.WHATSAPP.CREATE_PRESCRIPTION,
            language: {
                code: languageCode
            },
            components: [
                {
                    type: "body",
                    parameters: [
                        {
                            type: "text",
                            text: doctorName
                        }
                    ]
                },
                {
                    type: "button",
                    sub_type: "url",
                    index: "0",
                    parameters: [
                        {
                            type: "text",
                            text: prescriptionURL
                        }
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


module.exports = { sendPrescription }