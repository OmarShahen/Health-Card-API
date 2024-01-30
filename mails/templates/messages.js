const config = require('../../config/config')

const getExpertVerificationRejectionMessage = ({ expertName }) => {

    return `
    <p>Dear ${expertName},</p>
    <p>
        Thank you for your interest in becoming an expert on our platform and for submitting your verification request. We appreciate the time and effort you have invested in the application process.
    </p>
    <p>
        After careful consideration and review, we regret to inform you that your verification request has been rejected. While we value the expertise and skills you possess, we have determined that your profile does not align with the requirements and standards we maintain on our platform.
    </p>
    <p>
        We understand that this decision may be disappointing, and we want to assure you that it is not a reflection of your professional capabilities. Our platform aims to curate a specific set of experts who meet our criteria and can cater to the needs of our users effectively.
    </p>
    <p>
        We appreciate your understanding and wish you the best in your professional endeavors. Should you have any questions or need further clarification, please don't hesitate to contact us at <strong>${config.SUPPORT_NUMBER}</strong>. We are here to assist you.
    </p>
    <p>
        Thank you for considering our platform, and we wish you continued success in your future endeavors.
    </p>
    <p>
        Best regards,
    </p>
    <p>
        ${config.APP_NAME} Team
    </p>
    `
}

const getExpertVerificationAcceptanceMessage = ({ expertName, signupLink }) => {

    return `
    <p>
        Dear ${expertName},
    </p
    <p>
        We are thrilled to inform you that your verification request to become an expert on our platform has been accepted! We appreciate your interest in joining our community of knowledgeable experts.
    </p>
    <p>
        To get started, please follow the link below to create your expert account:
    </p>
    <p>
        <a href='${signupLink}'>${signupLink}</a>
    </p>
    <p>
        By creating your account, you will gain access to a wide range of features and tools that will allow you to offer your expertise to seekers from around the world. We are excited to have you onboard and look forward to seeing the valuable contributions you will make.
    </p>
    <p>
        If you have any questions or encounter any issues during the signup process, please don't hesitate to reach out to our support team at <strong>${config.SUPPORT_NUMBER}</strong>. We are here to assist you every step of the way.
    </p>
    <p>
        Once again, congratulations on becoming a verified expert on our platform. We are confident that your expertise will greatly benefit our community, and we wish you continued success in your professional journey.
    </p>
    <p>
        Best regards,
    </p>
    <p>
        ${config.APP_NAME} Team
    </p>
    `
}

module.exports = { getExpertVerificationRejectionMessage, getExpertVerificationAcceptanceMessage }