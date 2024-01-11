module.exports = {

    WEB_FORGOT_PASSWORD_URL: `https://barbels-f6774.web.app/reset-password`,
    PORT: process.env.APP_PORT,
    //DB_URL: process.env.PROD_DB_URL,
    DB_URL: process.env.DB_URL,
    PAYMOB_HMAC: process.env.PAYMOB_HMAC,
    PAYMOB_API_KEYS: process.env.PAYMOB_API_KEYS,
    MAX_FILE_SIZE: 25 * 1000000, // bytes
    GENDER: ['MALE', 'FEMALE'],
    BLOOD_GROUPS: ['A', 'B', 'O', 'AB', 'A-', 'A+', 'B-', 'B+', 'O+', 'O-', 'AB+', 'AB-'],
    ALLOWED_FILE_EXTENSIONS: ['doc', 'docx', 'xls', 'xlsx', 'pdf', 'png', 'jpeg', 'jpg'],
    ROLES: ['OWNER', 'DOCTOR', 'STAFF'],
    TYPES: ['EXPERT', 'SEEKER'],
    SPECIALITIES_TYPES: ['MAIN', 'SUB'],
    DOCTORS_TITLES: ['PROFESSOR', 'LECTURER', 'CONSULTANT', 'SPECIALIST'],
    CLINIC_MODES: ['TEST', 'PRODUCTION'],
    TEST_MODE_LIMIT: 3,
    EMAIL: {
        APP_MAIL: 'raayaeg@gmail.com',
        APP_MAIL_PASSWORD: process.env.APP_MAIL_PASSWORD,
        APP_MAIL_SERVICE: 'gmail'
    },
    SALT_ROUNDS: Number.parseInt(process.env.SALT_ROUNDS),
    SECRET_KEY: process.env.SECRET_KEY,
    LANGUAGES: ['en', 'ar'],
    SCHEDULING_WAYS: ['PHONE-CALL', 'IN-PERSON', 'ONLINE'],
    MEDICATION_CHALLENGES_CATEGORY: ['TAKE', 'OBTAIN'],
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
    RATES: ['LIKE', 'DISLIKE', 'LOVE'],
    DOSGAE_TYPES: [
        'tablet', 'capsule', 'powder', 'lotion', 'gargle', 'drops', 'ointment', 'cream',
        'injections', 'suppository', 'transdermal patch', 'inhaler', 'pessary', 'enema',
        'sachet'
    ],
    TIME_UNIT: ['day', 'week', 'month'],
    APPOINTMENT_STATUS: ['UPCOMING', 'ACTIVE', 'DONE', 'CANCELLED', 'WAITING', 'RESCHEDULED'],
    INVOICE_STATUS: ['DRAFT', 'PENDING', 'PAID', 'PARTIALLY_PAID', 'OVER_DUE', 'VOID', 'REFUNDED'],
    PAYMENT_METHOD: ['CASH', 'CHECK', 'CREDIT_OR_DEBIT', 'ONLINE', 'MOBILE'],
    INSURANCE_POLICY_TYPE: ['HEALTH', 'LIFE', 'AUTO'],
    INSURANCE_POLICY_STATUS: ['ACTIVE', 'INACTIVE'],
    COMMENT_TYPES: ['COMPLIMENT', 'ISSUE'],
    VALUES_ENTITY: ['LEADS', 'STAGES', 'MESSAGES'],
    MESSAGE_SENT_PLATFORMS: ['REALLIFE', 'WHATSAPP', 'FACEBOOK', 'INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'OTHERS'],
    WEEK_DAYS: ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
}