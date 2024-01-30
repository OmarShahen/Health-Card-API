"use strict";

var config = require('../../config/config');

var getExpertVerificationRejectionMessage = function getExpertVerificationRejectionMessage(_ref) {
  var expertName = _ref.expertName;
  return "\n    <p>Dear ".concat(expertName, ",</p>\n    <p>\n        Thank you for your interest in becoming an expert on our platform and for submitting your verification request. We appreciate the time and effort you have invested in the application process.\n    </p>\n    <p>\n        After careful consideration and review, we regret to inform you that your verification request has been rejected. While we value the expertise and skills you possess, we have determined that your profile does not align with the requirements and standards we maintain on our platform.\n    </p>\n    <p>\n        We understand that this decision may be disappointing, and we want to assure you that it is not a reflection of your professional capabilities. Our platform aims to curate a specific set of experts who meet our criteria and can cater to the needs of our users effectively.\n    </p>\n    <p>\n        We appreciate your understanding and wish you the best in your professional endeavors. Should you have any questions or need further clarification, please don't hesitate to contact us at <strong>").concat(config.SUPPORT_NUMBER, "</strong>. We are here to assist you.\n    </p>\n    <p>\n        Thank you for considering our platform, and we wish you continued success in your future endeavors.\n    </p>\n    <p>\n        Best regards,\n    </p>\n    <p>\n        ").concat(config.APP_NAME, " Team\n    </p>\n    ");
};

var getExpertVerificationAcceptanceMessage = function getExpertVerificationAcceptanceMessage(_ref2) {
  var expertName = _ref2.expertName,
      signupLink = _ref2.signupLink;
  return "\n    <p>\n        Dear ".concat(expertName, ",\n    </p\n    <p>\n        We are thrilled to inform you that your verification request to become an expert on our platform has been accepted! We appreciate your interest in joining our community of knowledgeable experts.\n    </p>\n    <p>\n        To get started, please follow the link below to create your expert account:\n    </p>\n    <p>\n        <a href='").concat(signupLink, "'>").concat(signupLink, "</a>\n    </p>\n    <p>\n        By creating your account, you will gain access to a wide range of features and tools that will allow you to offer your expertise to seekers from around the world. We are excited to have you onboard and look forward to seeing the valuable contributions you will make.\n    </p>\n    <p>\n        If you have any questions or encounter any issues during the signup process, please don't hesitate to reach out to our support team at <strong>").concat(config.SUPPORT_NUMBER, "</strong>. We are here to assist you every step of the way.\n    </p>\n    <p>\n        Once again, congratulations on becoming a verified expert on our platform. We are confident that your expertise will greatly benefit our community, and we wish you continued success in your professional journey.\n    </p>\n    <p>\n        Best regards,\n    </p>\n    <p>\n        ").concat(config.APP_NAME, " Team\n    </p>\n    ");
};

module.exports = {
  getExpertVerificationRejectionMessage: getExpertVerificationRejectionMessage,
  getExpertVerificationAcceptanceMessage: getExpertVerificationAcceptanceMessage
};