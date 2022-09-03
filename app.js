const express = require('express')
const dotenv = require('dotenv').config()
const config = require('./config/config')
const morgan = require('morgan')
const db = require('./config/database')


const app = express()

app.use(morgan('dev'))
app.use(express.json())

app.use('/api/v1/auth', require('./routes/auth'))
app.use('/api/v1', require('./routes/admins'))
app.use('/api/v1', require('./routes/clubs'))
app.use('/api/v1', require('./routes/countries'))
app.use('/api/v1', require('./routes/staffs'))
app.use('/api/v1', require('./routes/members'))
app.use('/api/v1', require('./routes/packages'))
app.use('/api/v1', require('./routes/registrations'))
app.use('/api/v1', require('./routes/attendances'))
app.use('/api/v1', require('./routes/cancelledAttendances'))
app.use('/api/v1', require('./routes/cancelledRegistrations'))
app.use('/api/v1', require('./routes/freezedRegistrations'))

db()

app.get('/', (request, response) => {

    return response.status(200).json({
        message: 'welcome to our gym app'
    })
})


app.listen(config.PORT, () => console.log(`server started on port ${config.PORT} [GYM-APP]`))


