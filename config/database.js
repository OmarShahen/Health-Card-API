const config = require('./config')
const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect(config.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
}

module.exports = connectDB