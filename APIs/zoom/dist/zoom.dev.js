"use strict";

var axios = require('axios');

var API_KEY = 'OvZxqGFrQBSut88Auz8LA';
var API_SECRET = 'rjt3yGcMuApG1UXg9llwkaXPCV40RO9S';
var MEETING_TOPIC = "The Meeting is created by RA'AYA";

function createZoomMeeting() {
  var response, _response$data, join_url, id;

  return regeneratorRuntime.async(function createZoomMeeting$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(axios.post('https://api.zoom.us/v2/users/me/meetings', {
            topic: MEETING_TOPIC,
            type: 1 // 1 for instant meeting

          }, {
            headers: {
              'Authorization': "Bearer f3NR6fk8ScKSypiNXeuzPA",
              'Content-Type': 'application/json'
            }
          }));

        case 3:
          response = _context.sent;
          _response$data = response.data, join_url = _response$data.join_url, id = _response$data.id;
          console.log('Zoom Meeting Link:', join_url);
          console.log('Meeting ID:', id);
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error('Error creating Zoom meeting:', _context.t0.response.data);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
}

function generateZoomJWT() {
  var payload = {
    iss: API_KEY,
    exp: Date.now() + 3600 // Token expiration time (1 hour from now)

  };
  return require('jsonwebtoken').sign(payload, API_SECRET);
}

createZoomMeeting();