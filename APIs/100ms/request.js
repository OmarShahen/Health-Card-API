const axios = require('axios')
const config = require('../../config/config')

const videoPlatformRequest = axios.create({
    baseURL: config.VIDEO_PLATFORM.BASE_URL,
    headers: {
        Authorization: `Bearer ${process.env.VIDEO_PLATFORM_ACCESS_TOKEN}`
    }
})


module.exports = { videoPlatformRequest }