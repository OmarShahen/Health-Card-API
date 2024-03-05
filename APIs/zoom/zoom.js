const axios = require('axios');

const API_KEY = 'OvZxqGFrQBSut88Auz8LA';
const API_SECRET = 'rjt3yGcMuApG1UXg9llwkaXPCV40RO9S';
const MEETING_TOPIC = `The Meeting is created by RA'AYA`;

async function createZoomMeeting() {
  try {
    const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
      topic: MEETING_TOPIC,
      type: 1, // 1 for instant meeting
    }, {
      headers: {
        'Authorization': `Bearer f3NR6fk8ScKSypiNXeuzPA`,
        'Content-Type': 'application/json',
      },
    });

    const { join_url, id } = response.data;

    console.log('Zoom Meeting Link:', join_url);
    console.log('Meeting ID:', id);
  } catch (error) {
    console.error('Error creating Zoom meeting:', error.response.data);
  }
}

function generateZoomJWT() {
  const payload = {
    iss: API_KEY,
    exp: Date.now() + 3600, // Token expiration time (1 hour from now)
  };

  return require('jsonwebtoken').sign(payload, API_SECRET);
}

createZoomMeeting();