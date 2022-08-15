const mongoose = require('mongoose')

const isObjectId = (objectId) => {

    if(Number.isFinite(objectId)) return false

    return mongoose.Types.ObjectId.isValid(objectId)
}

module.exports =  { isObjectId }