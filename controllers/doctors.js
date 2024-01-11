const ClinicDoctorsModel = require('../models/ClinicDoctorModel')
const UserModel = require('../models/UserModel')
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

const searchExperts = async (request, response) => {

    try {

        const { specialityId } = request.params
        let { gender, sortBy, subSpecialityId, page, limit } = request.query

        page = page ? page : 1
        limit = limit ? limit : 10

        const skip = (page - 1) * limit

        const matchQuery = {
            speciality: { $in: [mongoose.Types.ObjectId(specialityId)] },
            isVerified: true,
            isShow: true,
            type: 'EXPERT'
        }

        let sortQuery = { createdAt: -1 }

        if(gender) {
            matchQuery.gender = gender
        }

        if(subSpecialityId) {
            matchQuery.subSpeciality = { $in: [mongoose.Types.ObjectId(subSpecialityId)] }
        }

        if(sortBy == 'HIGH-RATING') {
            sortQuery.rating = -1
        } else if(sortBy == 'HIGH-PRICE') {
            sortQuery['pricing.price'] = -1
        } else if(sortBy == 'LOW-PRICE') {
            sortQuery['pricing.price'] = 1
        }


        const experts = await UserModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $sort: { rating: -1, createdAt: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: Number.parseInt(limit)
            },
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'speciality',
                    foreignField: '_id',
                    as: 'speciality'
                }
            },
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'subSpeciality',
                    foreignField: '_id',
                    as: 'subSpeciality'
                }
            },
            {
                $project: {
                    password: 0
                }
            }
        ])

        let totalExperts = await UserModel.countDocuments(matchQuery)

        return response.status(200).json({
            accepted: true,
            totalExperts,
            experts
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


const searchExpertsByNameAndSpeciality = async (request, response) => {

    try {

        const { specialityId, name } = request.params

        const matchQuery = {
            speciality: { $in: [mongoose.Types.ObjectId(specialityId)] },
            isVerified: true,
            isShow: true,
            type: 'EXPERT',
            firstName: { $regex: name, $options: 'i' }
        }

        const experts = await UserModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'speciality',
                    foreignField: '_id',
                    as: 'speciality'
                }
            },
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'subSpeciality',
                    foreignField: '_id',
                    as: 'subSpeciality'
                }
            },
            {
                $project: {
                    password: 0
                }
            }
        ])

        const totalExperts = await UserModel.countDocuments(matchQuery)

        return response.status(200).json({
            accepted: true,
            totalExperts,
            experts
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


module.exports = { getClinicDoctors, searchExperts, searchExpertsByNameAndSpeciality }