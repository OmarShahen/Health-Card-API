"use strict";

var config = require('../config/config');

var _require = require('../utils/utils'),
    concatenateHmacString = _require.concatenateHmacString;

var crypto = require('crypto');

var UserModel = require('../models/UserModel');

var SubscriptionModel = require('../models/SubscriptionModel');

var ClinicModel = require('../models/ClinicModel');

var PaymentModel = require('../models/PaymentModel');

var processPayment = function processPayment(request, response) {
  var payment, paymobHmac, paymentHmacData, concatenatedString, hash, verifiedPaymentHmac, billingData, items, userList, user, item, subscriptionStartDate, tempDate, subscriptionEndDate, subscriptionData, subscriptionObj, newSubscription, paymentData, paymentObj, newPayment, updatedClinic;
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
          /*if(paymobHmac != verifiedPaymentHmac) {
              console.log('payment is denied')
              return response.status(400).json({
                  accepted: false,
                  message: 'invalid payment hmac',
                  field: 'hmac'
              })
          }*/

          if (payment.success) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'payment is not successful',
            field: 'payment.success'
          }));

        case 10:
          billingData = payment.payment_key_claims.billing_data;
          items = payment.order.items;
          _context.next = 14;
          return regeneratorRuntime.awrap(UserModel.find({
            email: billingData.email,
            isVerified: true
          }));

        case 14:
          userList = _context.sent;
          user = userList[0];

          if (!(items.length == 0)) {
            _context.next = 18;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'no item is registered in the order',
            field: 'payment.order.items'
          }));

        case 18:
          item = items[0];
          subscriptionStartDate = new Date();
          tempDate = new Date();
          subscriptionEndDate = new Date(tempDate.setDate(tempDate.getDate() + item.quantity));
          subscriptionData = {
            startDate: subscriptionStartDate,
            endDate: subscriptionEndDate,
            clinicId: item.description,
            planName: item.name,
            planDurationInDays: item.quantity
          };
          subscriptionObj = new SubscriptionModel(subscriptionData);
          _context.next = 26;
          return regeneratorRuntime.awrap(subscriptionObj.save());

        case 26:
          newSubscription = _context.sent;
          paymentData = {
            subscriptionId: newSubscription._id,
            transactionId: payment.id,
            success: payment.success,
            pending: payment.pending,
            gateway: 'PAYMOB',
            orderId: payment.order.id,
            amountCents: payment.amount_cents,
            currency: payment.currency,
            userId: user._id,
            createdAt: payment.created_at,
            firstName: payment.payment_key_claims.billing_data.first_name,
            lastName: payment.payment_key_claims.billing_data.last_name,
            email: payment.payment_key_claims.billing_data.email,
            phoneNumber: payment.payment_key_claims.billing_data.phone_number
          };
          paymentObj = new PaymentModel(paymentData);
          _context.next = 31;
          return regeneratorRuntime.awrap(paymentObj.save());

        case 31:
          newPayment = _context.sent;
          _context.next = 34;
          return regeneratorRuntime.awrap(ClinicModel.findByIdAndUpdate(newSubscription.clinicId, {
            activeUntilDate: newSubscription.endDate
          }, {
            "new": true
          }));

        case 34:
          updatedClinic = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'processed payment successfully!',
            payment: newPayment,
            clinic: updatedClinic,
            subscription: newSubscription
          }));

        case 38:
          _context.prev = 38;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 42:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 38]]);
};

module.exports = {
  processPayment: processPayment
};