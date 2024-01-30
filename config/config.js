module.exports = {

    PORT: process.env.APP_PORT,
    DB_URL: process.env.PROD_DB_URL,
    //DB_URL: process.env.DB_URL,
    PAYMOB_HMAC: process.env.PAYMOB_HMAC,
    PAYMOB_API_KEYS: process.env.PAYMOB_API_KEYS,
    PAYMOB: {
        LOCAL_CARDS_INTEGRATION_ID: 3931768,
        MOBILE_WALLET_INTEGRATION_ID: 4447178
    },
    PAYMENT_COMMISSION: 0.1,
    GENDER: ['MALE', 'FEMALE'],
    ROLES: ['OWNER', 'DOCTOR', 'STAFF'],
    TYPES: ['EXPERT', 'SEEKER'],
    SPECIALITIES_TYPES: ['MAIN', 'SUB'],
    EXPERT_VERIFICATION_STATUS: ['PENDING', 'ACCEPTED', 'REJECTED'],
    EMAIL: {
        APP_MAIL: 'raayaeg@gmail.com',
        APP_MAIL_PASSWORD: process.env.APP_MAIL_PASSWORD,
        APP_MAIL_SERVICE: 'gmail'
    },
    SALT_ROUNDS: Number.parseInt(process.env.SALT_ROUNDS),
    SECRET_KEY: process.env.SECRET_KEY,
    NOTIFICATION_EMAIL: 'omarredaelsayedmohamed@gmail.com',
    LANGUAGES: ['en', 'ar'],
    VIDEO_PLATFORM: {
        BASE_URL: 'https://api.100ms.live',
        TEMPLATE_ID: '65a4f11370fd941909eb9c28'
    },
    WHATSAPP:{
        BASE_URL: 'https://graph.facebook.com/v17.0',
        TOKEN: process.env.WHATSAPP_TOKEN,
        LANGUAGES: ['en', 'ar'],
        PHONE_NUMBER_ID: 148470768360494,
        CREATE_PATIENT: 'create_patient',
        CREATE_PRESCRIPTION: 'create_prescription',
        SEND_APPOINTMENT_REMINDER: 'appointment_reminder',
        SEND_CLINIC_APPOINTMENT: 'new_appointment',
        CANCEL_APPOINTMENT: 'delete_appointment'
    },
    TIME_UNIT: ['day', 'week', 'month'],
    APPOINTMENT_STATUS: ['UPCOMING', 'ACTIVE', 'DONE', 'CANCELLED', 'WAITING', 'RESCHEDULED'],
    WEEK_DAYS: ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
}