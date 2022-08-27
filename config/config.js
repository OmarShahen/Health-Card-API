module.exports = {

    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    MAIL_APP_PASSWORD: process.env.MAIL_APP_PASSWORD,
    SALT_ROUNDS: Number.parseInt(process.env.SALT_ROUNDS),
    SECRET_KEY: process.env.SECRET_KEY,
    ADMIN_ROLES: ['SUPER'],
    COUNTRY_CODES: ['20'],
    EXPIRATION_PERIODS: ['day', 'days', 'week', 'weeks', 'month', 'months', 'year'],
    MAX_ATTENDANCE: 1095,
    WHATSAPP:{
        BASE_URL: 'https://graph.facebook.com/v13.0',
        TOKEN: process.env.WHATSAPP_TOKEN,
        LANGUAGES: ['en_US'],
        PHONE_NUMBER_ID: 106539322179267
    }
}