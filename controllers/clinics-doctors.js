const ClinicDoctorModel = require('../models/ClinicDoctorModel')
const UserModel = require('../models/UserModel')
const ClinicModel = require('../models/ClinicModel')
const clinicDoctorValidation = require('../validations/clinics-doctors')


const getClinicsDoctors = async (request, response) => {

    try {

        const clinicsDoctors = await ClinicDoctorModel.find()

        return response.status(200).json({
            accepted: true,
            clinicsDoctors
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

const addClinicDoctor = async (request, response) => {

    try {

        const dataValidation = clinicDoctorValidation.addClinicDoctor(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { doctorId, clinicId } = request.body

        const doctorPromise = UserModel.findById(doctorId)
        const clinicPromise = ClinicModel.findById(clinicId)

        const [doctor, clinic] = await Promise.all([doctorPromise, clinicPromise])

        if(!doctor) {
            return response.status(400).json({
                accepted: false,
                message: 'doctor Id does not exists',
                field: 'doctorId'
            })
        }

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'clinic Id does not exists',
                field: 'clinicId'
            })
        } 

        const registeredClinicDoctorList = await ClinicDoctorModel.find({ doctorId, clinicId })
        if(registeredClinicDoctorList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'doctor already registered with clinic',
                field: 'clinicId'
            })
        }

        const clinicDoctorData = { doctorId, clinicId }
        const clinicDoctorObj = new ClinicDoctorModel(clinicDoctorData)
        const newClinicDoctor = await clinicDoctorObj.save()


        return response.status(200).json({
            accepted: true,
            message: 'registered doctor to clinic successfully!',
            clinicDoctor: newClinicDoctor
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

const deleteClinicDoctor = async (request, response) => {

    try {

        const { clinicDoctorId } = request.params

        const deletedClinicDoctor = await ClinicDoctorModel
        .findByIdAndDelete(clinicDoctorId)

        return response.status(200).json({
            accepted: true,
            message: 'deleted clinic doctor access successfully!',
            clinicDoctor: deletedClinicDoctor
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

module.exports = { getClinicsDoctors, addClinicDoctor, deleteClinicDoctor }