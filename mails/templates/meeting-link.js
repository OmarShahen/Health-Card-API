
const meetingLinkTemplate = (details) => {

    const { receiverName, startTime, meetingLink, senderName } = details

    return `
    <p>
        Hi ${receiverName},
    </p>
    <p>
        Your meeting is scheduled for ${startTime}. Below is your meeting link:    
    </p>
    <p>
        <a href='${meetingLink}'>${meetingLink}</a>
    </p>
    <p>
        Please be sure to join the meeting on time.
    </p>
    <p>
        Thank you,<br />
        ${senderName}
    </p>
    `
}

module.exports = { meetingLinkTemplate }