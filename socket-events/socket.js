const offlineHandlers = require('../socket-handlers/offlineHandlers')

const webSocketInitializer = (io) => {

    io.on('connection', socket => {
        console.log('connected')

        offlineHandlers(io, socket)
    })
}

module.exports = webSocketInitializer