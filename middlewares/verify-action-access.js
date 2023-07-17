const mongoose = require('mongoose')

const verifyDoctorActionAccess = async (request, response, next) => {

    try {

        if(!mongoose.Types.ObjectId(request.user._id).equals(request.doctorId)) {
            return response.status(400).json({
                accepted: false,
                message: 'unauthorized access to perform this action',
                field: 'doctorId'
            })
        }
        
        next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { verifyDoctorActionAccess }