const config = require('../config/config')

const verifyLanguage = (request, response, next) => {

    if(!request.query.lang || !config.LANGUAGES.includes(request.query.lang)) {
        request.query.lang = 'en'
        next()
    } else {
        next()
    }
}

const translateMessages = (request, response, next) => {

    console.log(response)

    console.log('here')

    next()
}

module.exports = { verifyLanguage, translateMessages }