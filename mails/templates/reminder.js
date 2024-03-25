
const reminderTemplate = (details) => {

    const { receiverName, startTime, senderName } = details

    return `
    <p>
        Hi ${receiverName},
    </p>
    <p>
        Just a friendly reminder that you have an appointment scheduled on <strong>${startTime}</strong>. Please be ready to join the video call at the designated time.
    </p>
    <p>
        Thank you,<br />
        ${senderName}
    </p>
    `
}

module.exports = { reminderTemplate }