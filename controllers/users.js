const config = require('../config/config')
const UserModel = require('../models/UserModel')
const ClinicModel = require('../models/ClinicModel')
const ClinicOwnerModel = require('../models/ClinicOwnerModel')
const userValidation = require('../validations/users')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const SpecialityModel = require('../models/SpecialityModel')


const getUser = async (request, response) => {

    try {

        const { userId } = request.params

        const user = await UserModel
        .findById(userId)
        .select({ password: 0 })

        return response.status(200).json({
            accepted: true,
            user
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

const getUserSpeciality = async (request, response) => {

    try {

        const { userId } = request.params

        const user = await UserModel
        .findById(userId)
        .select({ password: 0 })

        const { speciality } = user

        const specialities = await SpecialityModel.find({ _id: { $in: speciality } })

        user.speciality = specialities

        return response.status(200).json({
            accepted: true,
            user
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

const updateUser = async (request, response) => {

    try {

        const { userId } = request.params

        const dataValidation = userValidation.updateUser(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { firstName, lastName, gender, dateOfBirth } = request.body

        const newUserData = { firstName, lastName, gender, dateOfBirth }

        const updatedUser = await UserModel
        .findByIdAndUpdate(userId, newUserData, { new: true })

        updatedUser.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'Updated user successfully!',
            user: updatedUser
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

const updateUserSpeciality = async (request, response) => {

    try {

        const { userId } = request.params

        const dataValidation = userValidation.updateUserSpeciality(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { speciality } = request.body

        const specialities = await SpecialityModel.find({ _id: { $in: speciality }})

        if(specialities.length != speciality.length) {
            return response.status(400).json({
                accepted: false,
                message: 'speciality Id is not registered',
                field: 'speciality'
            })
        }

        const newUserData = { 
            speciality: specialities.map(special => special._id) 
        }

        const updatedUser = await UserModel
        .findByIdAndUpdate(userId, newUserData, { new: true })

        updatedUser.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'Updated user successfully!',
            user: updatedUser
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

const updateUserEmail = async (request, response) => {

    try {

        const { userId } = request.params

        const dataValidation = userValidation.updateUserEmail(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { email } = request.body

        const emailList = await UserModel.find({ email })
        if(emailList.length != 0 && !emailList[0]._id.equals(userId)) {
            return response.status(400).json({
                accepted: false,
                message: 'email is already registered',
                field: 'email'
            })
        }


        const updatedUser = await UserModel
        .findByIdAndUpdate(userId, { email }, { new: true })

        updatedUser.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'updated user email successfully!',
            user: updatedUser
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

const updateUserPassword = async (request, response) => {

    try {

        const { userId } = request.params

        const dataValidation = userValidation.updateUserPassword(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { password } = request.body

        const user = await UserModel.findById(userId)

        if(bcrypt.compareSync(password, user.password)) {
            return response.status(400).json({
                accepted: false,
                message: 'new password must be diffrent from old password',
                field: 'password'
            })
        }

        const newPassword = bcrypt.hashSync(password, config.SALT_ROUNDS)

        const updatedUser = await UserModel
        .findByIdAndUpdate(userId, { password: newPassword }, { new: true })

        updatedUser.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'updated user password successfully!',
            user: updatedUser
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

const verifyAndUpdateUserPassword = async (request, response) => {

    try {

        const { userId } = request.params

        const dataValidation = userValidation.verifyAndUpdateUserPassword(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { newPassword, currentPassword } = request.body

        if(newPassword == currentPassword) {
            return response.status(400).json({
                accepted: false,
                message: 'new password must be diffrent from current password',
                field: 'newPassword'
            })
        }

        const user = await UserModel.findById(userId)

        if(!bcrypt.compareSync(currentPassword, user.password)) {
            return response.status(400).json({
                accepted: false,
                message: 'current password entered is invalid',
                field: 'currentPassword'
            })
        }

        const newUserPassword = bcrypt.hashSync(newPassword, config.SALT_ROUNDS)

        const updatedUser = await UserModel
        .findByIdAndUpdate(userId, { password: newUserPassword }, { new: true })

        updatedUser.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'updated user password successfully!',
            user: updatedUser
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

const deleteUser = async (request, response) => {

    try {

        const { userId } = request.params

        const user = await UserModel.findById(userId)

        if(user.roles.includes('DOCTOR') || user.roles.includes('OWNER')) {
            return response.status(400).json({
                accepted: false,
                message: `This user type cannot be deleted`,
                field: 'userId'
            })
        }

        const deleteUser = await UserModel.findByIdAndDelete(userId)

        return response.status(200).json({
            accepted: true,
            message: 'user deleted successfully!',
            user: deleteUser
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

const registerStaffToClinic = async (request, response) => {

    try {

        const { userId } = request.params

        const dataValidation = userValidation.registerStaffToClinic(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }   

        const { clinicId } = request.body

        const clinicList = await ClinicModel.find({ clinicId })
        if(clinicList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'No clinic is registered with that ID',
                field: 'clinicId'
            })
        }

        const user = await UserModel.findById(userId)

        if(!user.roles.includes('STAFF')) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid user role type to perform this operation',
                field: 'userId'
            })
        }

        if(user.clinicId) {
            return response.status(400).json({
                accepted: false,
                message: 'user is already registered with a clinic',
                field: 'userId'
            })
        }


        const clinic = clinicList[0]

        const updatedUser = await UserModel
        .findByIdAndUpdate(userId, { clinicId: clinic._id }, { new: true }) 

        updatedUser.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'Registered with a clinic successfully!',
            user: updatedUser
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

const getUserMode = async (request, response) => {

    try {

        const { userId } = request.params

        const user = await UserModel.findById(userId)

        if(!user.roles.includes('OWNER')) {
            return response.status(400).json({
                accepted: false,
                message: 'user must be owner',
                field: 'userId'
            })            
        }

        const testClinicsOwned = await ClinicOwnerModel.aggregate([
            {
                $match: { ownerId: mongoose.Types.ObjectId(userId) }
            },
            {
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $match: { 'clinic.mode': 'TEST' }
            }
        ])

        let mode = 'PRODUCTION'

        if(testClinicsOwned.length > 0) {
            mode = 'TEST'
        }

        return response.status(200).json({
            accepted: true,
            mode
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

module.exports = { 
    getUser,
    getUserSpeciality,
    updateUser, 
    updateUserSpeciality,
    updateUserEmail, 
    updateUserPassword,
    verifyAndUpdateUserPassword,
    deleteUser,
    registerStaffToClinic,
    getUserMode
}