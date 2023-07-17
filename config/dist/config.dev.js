"use strict";

module.exports = {
  WEB_FORGOT_PASSWORD_URL: "https://barbels-f6774.web.app/reset-password",
  PORT: process.env.PORT,
  //DB_URL: process.env.PROD_DB_URL,
  DB_URL: process.env.DB_URL,
  PAYMOB_HMAC: process.env.PAYMOB_HMAC,
  GENDER: ['MALE', 'FEMALE'],
  BLOOD_GROUPS: ['A', 'B', 'O', 'AB', 'A-', 'A+', 'B-', 'B+', 'O+', 'O-', 'AB+', 'AB-'],
  ROLES: ['OWNER', 'DOCTOR', 'STAFF'],
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
  WHATSAPP: {
    BASE_URL: 'https://graph.facebook.com/v13.0',
    TOKEN: process.env.WHATSAPP_TOKEN,
    LANGUAGES: ['en', 'ar'],
    PHONE_NUMBER_ID: 100238229498518,
    MEMBER_QR_CODE_VERIFICATION_TEMPLATE: 'member_identity_verification_qr_code',
    MEMBER_QR_CODE_RESET_TEMPLATE: 'reset_member_qr_code',
    OFFER_MESSAGE_TEMPLATE: 'offers'
  },
  RATES: ['LIKE', 'DISLIKE', 'LOVE'],
  DOSGAE_TYPES: ['tablet', 'capsule', 'powder', 'lotion', 'gargle', 'drops', 'ointment', 'cream', 'injections', 'suppository', 'transdermal patch', 'inhaler', 'pessary', 'enema', 'sachet'],
  TIME_UNIT: ['day', 'week', 'month'],
  APPOINTMENT_STATUS: ['UPCOMING', 'ACTIVE', 'DONE', 'CANCELLED', 'WAITING'],
  INVOICE_STATUS: ['DRAFT', 'PENDING', 'PAID', 'PARTIALLY_PAID', 'OVER_DUE', 'VOID', 'REFUNDED'],
  PAYMENT_METHOD: ['CASH', 'CHECK', 'CREDIT_OR_DEBIT', 'ONLINE', 'MOBILE']
};