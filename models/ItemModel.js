const mongoose = require('mongoose')
const ItemSchema = new mongoose.Schema({

    clubId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String },
    inStock: { type: Number, default: 0 },
    price: { type: Number, required: true },
    initialStock: { type: Number, required: true },
}, { timestamps: true })

module.exports = mongoose.model('Item', ItemSchema)