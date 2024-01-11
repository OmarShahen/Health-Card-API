"use strict";

var config = require('../config/config');

var _require = require('../utils/utils'),
    concatenateHmacString = _require.concatenateHmacString;

var crypto = require('crypto');

var PaymentModel = require('../models/PaymentModel');

var CounterModel = require('../models/CounterModel');

var paymentValidation = require('../validations/payments');

var axios = require('axios');

var AppointmentModel = require('../models/AppointmentModel');

var UserModel = require('../models/UserModel');

var whatsappClinicAppointment = require('../APIs/whatsapp/send-clinic-appointment');

var whatsappCancelAppointment = require('../APIs/whatsapp/send-cancel-appointment');

var _require2 = require('date-fns'),
    format = _require2.format;

var utils = require('../utils/utils');

var processPayment = function processPayment(request, response) {
  var payment, paymobHmac, paymentHmacData, concatenatedString, hash, verifiedPaymentHmac, items, item, appointmentId, counter, paymentData, paymentObj, newPayment, updateAppointmentData, updatedAppointment, reservationDateTime, expert, seeker, targetPhone, messageBody, messageSent;
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
          if (payment.success) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'payment is not successful',
            field: 'payment.success'
          }));

        case 12:
          items = payment.order.items;

          if (!(items.length == 0)) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'no item is registered in the order',
            field: 'payment.order.items'
          }));

        case 15:
          item = items[0];
          appointmentId = item.description;
          _context.next = 19;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'payment'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 19:
          counter = _context.sent;
          paymentData = {
            paymentId: counter.value,
            appointmentId: appointmentId,
            transactionId: payment.id,
            success: payment.success,
            pending: payment.pending,
            gateway: 'PAYMOB',
            orderId: payment.order.id,
            amountCents: payment.amount_cents,
            currency: payment.currency,
            createdAt: payment.created_at,
            firstName: payment.payment_key_claims.billing_data.first_name,
            lastName: payment.payment_key_claims.billing_data.last_name,
            email: payment.payment_key_claims.billing_data.email,
            phoneNumber: payment.payment_key_claims.billing_data.phone_number
          };
          paymentObj = new PaymentModel(paymentData);
          _context.next = 24;
          return regeneratorRuntime.awrap(paymentObj.save());

        case 24:
          newPayment = _context.sent;
          updateAppointmentData = {
            paymentId: newPayment._id,
            isPaid: true
          };
          _context.next = 28;
          return regeneratorRuntime.awrap(AppointmentModel.findByIdAndUpdate(appointmentId, updateAppointmentData, {
            "new": true
          }));

        case 28:
          updatedAppointment = _context.sent;
          reservationDateTime = new Date(updatedAppointment.startTime);
          _context.next = 32;
          return regeneratorRuntime.awrap(UserModel.findById(updatedAppointment.expertId));

        case 32:
          expert = _context.sent;
          _context.next = 35;
          return regeneratorRuntime.awrap(UserModel.findById(updatedAppointment.seekerId));

        case 35:
          seeker = _context.sent;
          targetPhone = "".concat(expert.countryCode).concat(expert.phone);
          messageBody = {
            expertName: expert.firstName,
            appointmentId: "#".concat(updatedAppointment.appointmentId),
            appointmentDate: format(reservationDateTime, 'dd MMMM yyyy'),
            appointmentTime: format(reservationDateTime, 'hh:mm a'),
            duration: "".concat(updatedAppointment.duration, " minute"),
            seekerName: seeker.firstName
          };
          _context.next = 40;
          return regeneratorRuntime.awrap(whatsappClinicAppointment.sendClinicAppointment(targetPhone, 'en', messageBody));

        case 40:
          messageSent = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'processed payment successfully!',
            payment: newPayment,
            appointment: updatedAppointment
          }));

        case 44:
          _context.prev = 44;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 48:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 44]]);
};

var createPaymentURL = function createPaymentURL(request, response) {
  var dataValidation, _request$body, appointmentId, firstName, lastName, phone, email, planName, planPrice, appointment, authData, authResponse, orderData, orderResponse, token, orderId, paymentData, paymentRequest, paymentToken;

  return regeneratorRuntime.async(function createPaymentURL$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = paymentValidation.createPaymentURL(request.body);

          if (dataValidation.isAccepted) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body = request.body, appointmentId = _request$body.appointmentId, firstName = _request$body.firstName, lastName = _request$body.lastName, phone = _request$body.phone, email = _request$body.email, planName = _request$body.planName, planPrice = _request$body.planPrice;
          _context2.next = 7;
          return regeneratorRuntime.awrap(AppointmentModel.findById(appointmentId));

        case 7:
          appointment = _context2.sent;

          if (appointment) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'appointment ID is not registered',
            field: 'appointmentId'
          }));

        case 10:
          authData = {
            api_key: config.PAYMOB_API_KEYS
          };
          _context2.next = 13;
          return regeneratorRuntime.awrap(axios.post('https://accept.paymob.com/api/auth/tokens', authData));

        case 13:
          authResponse = _context2.sent;
          orderData = {
            auth_token: authResponse.data.token,
            delivery_needed: "false",
            amount_cents: "".concat(planPrice),
            currency: "EGP",
            items: [{
              name: planName,
              description: appointmentId,
              quantity: 1,
              amount_cents: planPrice
            }]
          };
          _context2.next = 17;
          return regeneratorRuntime.awrap(axios.post('https://accept.paymob.com/api/ecommerce/orders', orderData));

        case 17:
          orderResponse = _context2.sent;
          token = authResponse.data.token;
          orderId = orderResponse.data.id;
          paymentData = {
            auth_token: token,
            amount_cents: "".concat(planPrice),
            expiration: 3600,
            order_id: orderId,
            billing_data: {
              apartment: "NA",
              email: email,
              floor: "NA",
              first_name: firstName,
              street: "NA",
              building: "NA",
              phone_number: phone,
              shipping_method: "NA",
              postal_code: "NA",
              city: "NA",
              country: "EGYPT",
              last_name: lastName,
              state: "NA"
            },
            currency: "EGP",
            integration_id: 3931768
          };
          _context2.next = 23;
          return regeneratorRuntime.awrap(axios.post('https://accept.paymob.com/api/acceptance/payment_keys', paymentData));

        case 23:
          paymentRequest = _context2.sent;
          paymentToken = paymentRequest.data.token;
          iFrameURL = "https://accept.paymob.com/api/acceptance/iframes/767779?payment_token=".concat(paymentToken);
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            iFrameURL: iFrameURL
          }));

        case 29:
          _context2.prev = 29;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 33:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 29]]);
};

var getPayments = function getPayments(request, response) {
  var payments;
  return regeneratorRuntime.async(function getPayments$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(PaymentModel.find().sort({
            createdAt: -1
          }));

        case 3:
          payments = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            payments: payments
          }));

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var refundPayment = function refundPayment(request, response) {
  var appointmentId, appointment, payment, todayTime, startTime, hoursDifference, REFUND_PERCENTAGE, REFUND_AMOUNT, authData, authResponse, authToken, refundBodyData, refundResponse;
  return regeneratorRuntime.async(function refundPayment$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          appointmentId = request.params.appointmentId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(AppointmentModel.findById(appointmentId));

        case 4:
          appointment = _context4.sent;

          if (appointment.isPaid) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Appointment is not paid',
            field: 'appointmentId'
          }));

        case 7:
          if (appointment.paymentId) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Appointment has not payment',
            field: 'appointmentId'
          }));

        case 9:
          _context4.next = 11;
          return regeneratorRuntime.awrap(PaymentModel.findById(appointment.paymentId));

        case 11:
          payment = _context4.sent;

          if (!payment.isRefunded) {
            _context4.next = 14;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Payment is already refunded',
            field: 'appointmentId'
          }));

        case 14:
          todayTime = new Date();
          startTime = new Date(appointment.startTime);

          if (!(todayTime >= startTime)) {
            _context4.next = 18;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Appointment time has passed',
            field: 'appointmentId'
          }));

        case 18:
          hoursDifference = utils.getHoursDifference(startTime, todayTime);

          if (!(hoursDifference < 3)) {
            _context4.next = 21;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Cannot refund before the session with 3 hours',
            field: 'appointmentId'
          }));

        case 21:
          REFUND_PERCENTAGE = hoursDifference <= 24 && hoursDifference >= 3 ? 0.5 : 1;
          REFUND_AMOUNT = payment.amountCents * REFUND_PERCENTAGE;
          authData = {
            api_key: config.PAYMOB_API_KEYS
          };
          _context4.next = 26;
          return regeneratorRuntime.awrap(axios.post('https://accept.paymob.com/api/auth/tokens', authData));

        case 26:
          authResponse = _context4.sent;
          authToken = authResponse.data.token;
          refundBodyData = {
            auth_token: authToken,
            amount_cents: REFUND_AMOUNT,
            transaction_id: payment.transactionId
          };
          _context4.next = 31;
          return regeneratorRuntime.awrap(axios.post('https://accept.paymob.com/api/acceptance/void_refund/refund', refundBodyData));

        case 31:
          refundResponse = _context4.sent;
          console.log(refundResponse.data);
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            appointment: appointment
          }));

        case 36:
          _context4.prev = 36;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 40:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 36]]);
};

module.exports = {
  processPayment: processPayment,
  createPaymentURL: createPaymentURL,
  getPayments: getPayments,
  refundPayment: refundPayment
};