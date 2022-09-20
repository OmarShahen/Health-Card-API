module.exports = {

    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    MAIL_APP_PASSWORD: process.env.MAIL_APP_PASSWORD,
    SALT_ROUNDS: Number.parseInt(process.env.SALT_ROUNDS),
    SECRET_KEY: process.env.SECRET_KEY,
    ADMIN_ROLES: ['SUPER'],
    COUNTRY_CODES: ['20'],
    APP_ROLES: ['APP-ADMIN', 'STAFF', 'CLUB-ADMIN', 'CHAIN-OWNER'],
    EXPIRATION_PERIODS: ['day', 'days', 'week', 'weeks', 'month', 'months', 'year'],
    MAX_ATTENDANCE: 1095,
    WEEK_DAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    WHATSAPP:{
        BASE_URL: 'https://graph.facebook.com/v13.0',
        TOKEN: process.env.WHATSAPP_TOKEN,
        LANGUAGES: ['en', 'ar'],
        PHONE_NUMBER_ID: 100238229498518,
        MEMBER_QR_CODE_VERIFICATION_TEMPLATE: 'member_identity_verification_qr_code',
        MEMBER_QR_CODE_RESET_TEMPLATE: 'reset_member_qr_code'
    }
}