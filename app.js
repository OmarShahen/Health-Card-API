const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const config = require('./config/config')
//const Bree = require('bree')

const morgan = require('morgan')
const db = require('./config/database')
const cors = require('cors')
const http = require('http').Server(app)
const { verifyLanguage } = require('./middlewares/language')


app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(verifyLanguage)

/*const bree = new Bree({ jobs: [{ name: 'mail-report', interval: 'at 11:24pm' }]})
bree.start()*/


app.use('/api', require('./routes/auth'))
app.use('/api', require('./routes/patients'))
app.use('/api', require('./routes/clinics'))
app.use('/api', require('./routes/encounters'))
app.use('/api', require('./routes/prescriptions'))
app.use('/api', require('./routes/appointments'))
app.use('/api', require('./routes/users'))
app.use('/api', require('./routes/clinics-patients'))
app.use('/api', require('./routes/visit-reasons'))
app.use('/api', require('./routes/specialities'))
app.use('/api', require('./routes/clinics-owners'))
app.use('/api', require('./routes/clinics-doctors'))
app.use('/api', require('./routes/doctors'))
app.use('/api', require('./routes/clinics-patients-doctors'))
app.use('/api', require('./routes/clinics-requests'))
app.use('/api', require('./routes/services'))
app.use('/api', require('./routes/invoices'))
app.use('/api', require('./routes/invoices-services'))
app.use('/api', require('./routes/staffs'))
app.use('/api', require('./routes/cards'))
app.use('/api', require('./routes/payments'))
app.use('/api', require('./routes/subscriptions'))
app.use('/api', require('./routes/insurances'))
app.use('/api', require('./routes/insurancePolicies'))


db()
.then(data => console.log('Mongo is up and running... ;)'))
.catch(error => console.error(error))


app.get('/', (request, response) => {

    return response.status(200).json({
        message: 'welcome to our doctor app'
    })
})


http.listen(config.PORT, () => console.log(`server started on port ${config.PORT} [HEALTH CARD-APP]`))

