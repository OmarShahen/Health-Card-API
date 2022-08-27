const config = require('../config/config')

const isWhatsappLanguageValid = (language) => {

    const languages = config.WHATSAPP.LANGUAGES

    return languages.includes(language)
}


module.exports = { isWhatsappLanguageValid }