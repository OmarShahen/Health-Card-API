"use strict";

var axios = require('axios');

var config = require('../../config/config');

var whatsappRequest = axios.create({
  baseURL: config.WHATSAPP.BASE_URL,
  headers: {
    Authorization: config.WHATSAPP.TOKEN
  }
});

var sendPrescription = function sendPrescription(phone, languageCode, doctorName, prescriptionURL) {
  var requestBody, sendMessage;
  return regeneratorRuntime.async(function sendPrescription$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          requestBody = {
            messaging_product: "whatsapp",
            to: phone,
            type: "template",
            template: {
              name: config.WHATSAPP.CREATE_PRESCRIPTION,
              language: {
                code: languageCode
              },
              components: [{
                type: "body",
                parameters: [{
                  type: "text",
                  text: doctorName
                }]
              }, {
                type: "button",
                sub_type: "url",
                index: "0",
                parameters: [{
                  type: "text",
                  text: prescriptionURL
                }]
              }]
            }
          };
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(whatsappRequest.post("/".concat(config.WHATSAPP.PHONE_NUMBER_ID, "/messages"), requestBody));

        case 4:
          sendMessage = _context.sent;
          return _context.abrupt("return", {
            isSent: true
          });

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          console.error(_context.t0.response);
          return _context.abrupt("return", {
            isSent: false
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

module.exports = {
  sendPrescription: sendPrescription
};