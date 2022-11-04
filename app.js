const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const config = require('./config/config')

const morgan = require('morgan')
const db = require('./config/database')
const cors = require('cors')
const http = require('http').Server(app)
const webSocketInitializer = require('./socket-events/socket')
const { verifyLanguage } = require('./middlewares/language')

const io = require('socket.io')(http)

app.use(morgan('common'))
app.use(express.json())
app.use(cors())
app.use(verifyLanguage)


app.use('/api/v1/auth', require('./routes/auth'))
app.use('/api/v1', require('./routes/chainOwners'))
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
.then(data => console.log('Mongo is up and running... ;)'))
.catch(error => console.error(error))

webSocketInitializer(io)



app.get('/', (request, response) => {

    return response.status(200).json({
        message: 'welcome to our gym app'
    })
})


http.listen(config.PORT, () => console.log(`server started on port ${config.PORT} [GYM-APP]`))


