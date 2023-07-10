const UserModel = require('../models/UserModel')

const getClinicStaffs = async (request, response) => {

    try {

        const { clinicId } = request.params

        const staffs = await UserModel
        .find({ clinicId })       
        .select({ password: 0 }) 

        return response.status(200).json({
            accepted: true,
            staffs
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { getClinicStaffs }