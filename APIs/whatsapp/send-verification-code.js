const axios = require('axios')
const config = require('../../config/config')

const whatsappRequest = axios.create({
    baseURL: config.WHATSAPP.BASE_URL,
    headers: {
        Authorization: config.WHATSAPP.TOKEN
    }
})

const sendQRCode = async (phone, languageCode, QR_CODE_URL, club) => {


    const requestBody = {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
            name: "qr_code_verification",
            language: {
                code: languageCode
            },
            components: [
                {
                    type: "header",
                    parameters: [
                        {
                            type: "image",
                            image: {
                                link: `${QR_CODE_URL}`
                            }
                        }
                    ]
                },
                {
                    type: "body",
                    parameters: [
                        {
                            type: "text",
                            text: club.name
                        },
                        {
                            type: "text",
                            text: club.phone
                        },
                        {
                            type: "text",
                            text: club.address
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

module.exports = { sendQRCode }