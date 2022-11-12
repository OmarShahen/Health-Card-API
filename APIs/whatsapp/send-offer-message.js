const axios = require('axios')
const config = require('../../config/config')

const whatsappRequest = axios.create({
    baseURL: config.WHATSAPP.BASE_URL,
    headers: {
        Authorization: config.WHATSAPP.TOKEN
    }
})

const sendOfferMessage = async (phone, languageCode, clubImage, clubName, memberName, message) => {

    const requestBody = {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
            name: config.WHATSAPP.OFFER_MESSAGE_TEMPLATE,
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
                                link: `${clubImage}`
                            }
                        }
                    ]
                },
                {
                    type: "body",
                    parameters: [
                        {
                            type: "text",
                            text: memberName
                        },
                        {
                            type: "text",
                            text: clubName
                        },
                        {
                            type: "text",
                            text: message
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


module.exports = { sendOfferMessage }