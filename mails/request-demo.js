const config = require('../config/config')
const transporter = require('./config/config')

const sendRequestDemo = async (requestDemoData) => {

    try {

        const { name, email, clubName, phone, country } = requestDemoData

        const mailOptions = {
            from: config.EMAIL.APP_MAIL,
            to: [config.EMAIL.APP_MAIL, 'omarredaelsayedmohamed@gmail.com'],
            subject: 'Request Demo',
            html: `
                <div>
                    <h2>Demo Request</h2>
                    <strong>Name: </strong><span>${name}</span><br>
                    <strong>Email: </strong><span>${email}</span><br>
                    <strong>Club: </strong><span>${clubName}</span><br>
                    <strong>Phone: </strong><span>${phone}</span><br>
                    <strong>Country: </strong><span>${country}</span><br>
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

module.exports = { sendRequestDemo }