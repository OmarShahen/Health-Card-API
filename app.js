const express = require('express')
const app = express()
const http = require('http')
const dotenv = require('dotenv').config()
const config = require('./config/config')
const functions = require('firebase-functions')

//const Bree = require('bree')

const morgan = require('morgan')
const db = require('./config/database')
const cors = require('cors')
//const http = require('http').Server(app)
const { verifyLanguage } = require('./middlewares/language')

const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(verifyLanguage)

/*const bree = new Bree({ jobs: [{ name: 'mail-report', interval: 'at 11:24pm' }]})
bree.start()*/


app.use('/api', require('./routes/auth'))
app.use('/api', require('./routes/appointments'))
app.use('/api', require('./routes/users'))
app.use('/api', require('./routes/specialities'))
app.use('/api', require('./routes/experts'))
app.use('/api', require('./routes/seekers'))
app.use('/api', require('./routes/payments'))
app.use('/api', require('./routes/opening-times'))
app.use('/api', require('./routes/reviews'))



db()
.then(data => console.log('Mongo is up and running... ;)'))
.catch(error => console.error(error))


app.get('/', (request, response) => {

    return response.status(200).json({
        message: `welcome to RA'AYA`
    })
})

io.on('connection', socket => {
    console.log('Connected Successfully!')

    socket.emit('me', socket.id)

    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded')
    })

    socket.on('rooms:join', data => {
        socket.join(data.appointmentId)
    })

    socket.on('calling', data => {
        socket.to(data.appointmentId).emit('calling', data)
    })

    socket.on('signal', (data) => {
		socket.to(data.appointmentId).emit('signal', { signal: data.signalData, callerName: data.callerName })
	})

	socket.on('answerCall', (data) => {
		socket.to(data.appointmentId).emit('callAccepted', data.signal)
	})

})


server.listen(config.PORT, () => console.log(`server started on port ${config.PORT} [RA'AYA APP]`))

exports.app = functions.https.onRequest(app)