const axios = require('axios')
const config = require('../../config/config')

const whatsappRequest = axios.create({
    baseURL: config.WHATSAPP.BASE_URL,
    headers: {
        Authorization: config.WHATSAPP.TOKEN
    }
})

const sendMemberQRCode = async (phone, languageCode, QR_CODE_URL, club) => {


    const requestBody = {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
            name: config.WHATSAPP.MEMBER_QR_CODE_VERIFICATION_TEMPLATE,
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
                            text: club.memberName
                        },
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

const sendMemberResetQRCode = async (phone, languageCode, QR_CODE_URL, club) => {


    const requestBody = {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
            name: config.WHATSAPP.MEMBER_QR_CODE_RESET_TEMPLATE,
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
                            text: club.memberName
                        },
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

module.exports = { sendMemberQRCode, sendMemberResetQRCode }