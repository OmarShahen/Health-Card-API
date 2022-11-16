const config = require('./config')
const mongoose = require('mongoose')

const connectDB = async () => {

    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }

    await mongoose.connect(config.DB_URL, connectionParams)
}

module.exports = connectDB