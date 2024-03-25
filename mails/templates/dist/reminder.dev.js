"use strict";

var reminderTemplate = function reminderTemplate(details) {
  var receiverName = details.receiverName,
      startTime = details.startTime,
      senderName = details.senderName;
  return "\n    <p>\n        Hi ".concat(receiverName, ",\n    </p>\n    <p>\n        Just a friendly reminder that you have an appointment scheduled on <strong>").concat(startTime, "</strong>. Please be ready to join the video call at the designated time.\n    </p>\n    <p>\n        Thank you,<br />\n        ").concat(senderName, "\n    </p>\n    ");
};

module.exports = {
  reminderTemplate: reminderTemplate
};