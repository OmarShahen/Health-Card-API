"use strict";

var config = require('../config/config');

var _require = require('../utils/utils'),
    concatenateHmacString = _require.concatenateHmacString;

var crypto = require('crypto');

var processPayment = function processPayment(request, response) {
  var payment, paymobHmac, paymentHmacData, concatenatedString, hash, verifiedPaymentHmac;
  return regeneratorRuntime.async(function processPayment$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          payment = request.body.obj;
          paymobHmac = request.query.hmac;
          paymentHmacData = {
            amount_cents: payment.amount_cents,
            created_at: payment.created_at,
            currency: payment.currency,
            error_occured: payment.error_occured,
            has_parent_transaction: payment.has_parent_transaction,
            id: payment.id,
            integration_id: payment.integration_id,
            is_3d_secure: payment.is_3d_secure,
            is_auth: payment.is_auth,
            is_capture: payment.is_capture,
            is_refunded: payment.is_refunded,
            is_standalone_payment: payment.is_standalone_payment,
            is_voided: payment.is_voided,
            order: {
              id: payment.order.id
            },
            owner: payment.owner,
            pending: payment.pending,
            source_data: {
              pan: payment.source_data.pan,
              sub_type: payment.source_data.sub_type,
              type: payment.source_data.type
            },
            success: payment.success
          };
          concatenatedString = concatenateHmacString(paymentHmacData);
          hash = crypto.createHmac('sha512', config.PAYMOB_HMAC);
          hash.update(concatenatedString);
          verifiedPaymentHmac = hash.digest('hex');

          if (!(paymobHmac != verifiedPaymentHmac)) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid payment hmac',
            field: 'hmac'
          }));

        case 10:
          console.log('payment is successfull!');
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'processed payment successfully!'
          }));

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

module.exports = {
  processPayment: processPayment
};