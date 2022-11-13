const config = require('../config/config')
const transporter = require('./config/config')

const sendDailyReport = async (dailyStats) => {

    try {

        const { members, registrations, attendances } = dailyStats

        const mailOptions = {
            from: config.EMAIL.APP_MAIL,
            to: ['omarredaelsayedmohamed@gmail.com'],
            subject: 'Barbells Daily Report',
            html: `
                <div>
                    <h2>Barbells Daily Stats</h2>
                    <strong>Members:</strong><span>${members}</span><br>
                    <strong>Registrations:</strong><span>${registrations}</span><br>
                    <strong>Attendances:</strong><span>${attendances}</span><br>
                </div>
            `,
        }

        const success = await transporter.sendMail(mailOptions)

        return { isSent: true }

    } catch(error) {    
        console.error(error)
        return { isSent: false }
    }

}

module.exports = { sendDailyReport }