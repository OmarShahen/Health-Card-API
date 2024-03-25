"use strict";

var meetingLinkTemplate = function meetingLinkTemplate(details) {
  var receiverName = details.receiverName,
      startTime = details.startTime,
      meetingLink = details.meetingLink,
      senderName = details.senderName;
  return "\n    <p>\n        Hi ".concat(receiverName, ",\n    </p>\n    <p>\n        Your meeting is scheduled for ").concat(startTime, ". Below is your meeting link:    \n    </p>\n    <p>\n        <a href='").concat(meetingLink, "'>").concat(meetingLink, "</a>\n    </p>\n    <p>\n        Please be sure to join the meeting on time.\n    </p>\n    <p>\n        Thank you,<br />\n        ").concat(senderName, "\n    </p>\n    ");
};

module.exports = {
  meetingLinkTemplate: meetingLinkTemplate
};