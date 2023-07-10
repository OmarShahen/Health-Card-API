const ClinicDoctorsModel = require('../models/ClinicDoctorModel')
const mongoose = require('mongoose')

const getClinicDoctors = async (request, response) => {

    try {

        const { clinicId } = request.params

        const doctors = await ClinicDoctorsModel.aggregate([
            {
                $match: { clinicId: mongoose.Types.ObjectId(clinicId) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    'doctor.password': 0
                }
            }
        ])

        doctors.forEach(doctor => {
            doctor.doctor = doctor.doctor[0]
        })

        return response.status(200).json({
            accepted: true,
            doctors
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

module.exports = { getClinicDoctors }