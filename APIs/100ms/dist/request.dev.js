"use strict";

var axios = require('axios');

var config = require('../../config/config');

var videoPlatformRequest = axios.create({
  baseURL: config.VIDEO_PLATFORM.BASE_URL,
  headers: {
    Authorization: "Bearer ".concat(process.env.VIDEO_PLATFORM_ACCESS_TOKEN)
  }
});
module.exports = {
  videoPlatformRequest: videoPlatformRequest
};