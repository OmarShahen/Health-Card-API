const ClinicModel = require('../models/ClinicModel')
const ClinicOwnerModel = require('../models/ClinicOwnerModel')
const UserModel = require('../models/UserModel')
const SpecialityModel = require('../models/SpecialityModel')
const CounterModel = require('../models/CounterModel')
const clinicValidation = require('../validations/clinics')
const mongoose = require('mongoose')
const ClinicDoctorModel = require('../models/ClinicDoctorModel')
const ClinicPatientModel = require('../models/ClinicPatientModel')
const ClinicPatientDoctorModel = require('../models/ClinicPatientDoctorModel')
const PatientModel = require('../models/PatientModel')


const isClinicsInTestMode = (clinics) => {

    for(let i=0;i<clinics.length;i++) {
        if(clinics[i].clinic.mode == 'TEST') {
            return true
        }
    }

    return false
}

const getTestModePatients = async (clinicId) => {

    const patients = await PatientModel.find({ cardId: { $in: [18101851, 18101852, 18101853] }})

    const clinicPatients =  patients.map(patient => {
        return { clinicId, patientId: patient._id }
    })   

    return clinicPatients
}

const addClinic = async (request, response) => {

    try {

        const dataValidation = clinicValidation.addClinic(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { ownerId, name, speciality, city, country } = request.body

        const owner = await UserModel.findById(ownerId)
        if(!owner) {
            return response.status(400).json({
                accepted: false,
                message: 'Owner Id does not exist',
                field: 'ownerId'
            })
        }

        const specialitiesList = await SpecialityModel.find({ _id: { $in: speciality } })
        if(specialitiesList.length != speciality.length) {
            return response.status(400).json({
                accepted: false,
                message: 'not registered specialities',
                field: 'speciality'
            })
        }

        const ownerClinics = await ClinicOwnerModel.aggregate([
            {
                $match: { ownerId: mongoose.Types.ObjectId(ownerId) }
            },
            {
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            }
        ])

        ownerClinics.forEach(ownerClinic => ownerClinic.clinic = ownerClinic.clinic[0])

        if(isClinicsInTestMode(ownerClinics)) {
            return response.status(400).json({
                accepted: false,
                message: `cannot create clinic in test mode`,
                field: 'ownerId'
            })
        }

        let mode = 'PRODUCTION'

        if(ownerClinics.length == 0) {
            mode = 'TEST'  
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'clinic' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const clinicData = {
            clinicId: counter.value,
            mode,
            ownerId,
            speciality,
            name,
            city,
            country,
        }
        
        const clinicObj = new ClinicModel(clinicData)
        const newClinic = await clinicObj.save()

        const clinicOwnerData = { ownerId, clinicId: newClinic._id }
        const clinicOwnerObj = new ClinicOwnerModel(clinicOwnerData)
        const newClinicOwner = await clinicOwnerObj.save()

        let newClinicDoctor = {}
        if(owner.roles.includes('DOCTOR')) {
            const clinicDoctorData = { doctorId: ownerId, clinicId: newClinic._id }
            const clinicDoctorcObj = new ClinicDoctorModel(clinicDoctorData)
            newClinicDoctor = await clinicDoctorcObj.save() 
        }

        if(ownerClinics.length == 0 || !owner.roles.includes('OWNER')) {
            await UserModel.findByIdAndUpdate(ownerId, { $push: { roles: 'OWNER' } }, { new: true })
        }

        if(mode == 'TEST') {
            const testPatients = await getTestModePatients(newClinic._id)
            await ClinicPatientModel.insertMany(testPatients)

            if(owner.roles.includes('DOCTOR')) {
                testPatients.forEach(patient => patient.doctorId = owner._id)
                await ClinicPatientDoctorModel.insertMany(testPatients)
            }
        }
        
        return response.status(200).json({
            accepted: true,
            message: 'Added clinic successfully!',
            clinic: newClinic,
            clinicDoctor: newClinicDoctor,
            clinicOwner: newClinicOwner
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

const updateClinic = async (request, response) => {

    try {

        const dataValidation = clinicValidation.updateClinic(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clinicId } = request.params
        const { name, speciality, city, country } = request.body

        const specialitiesList = await SpecialityModel.find({ _id: { $in: speciality } })

        if(specialitiesList.length != speciality.length) {
            return response.status(400).json({
                accepted: false,
                message: 'not registered specialities',
                field: 'speciality'
            })
        }

        const clinicData = {
            speciality: specialitiesList.map(special => special._id),
            name,
            city,
            country,
        }

        const updatedClinic = await ClinicModel
        .findByIdAndUpdate(clinicId, clinicData, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated clinic successfully!',
            clinic: updatedClinic,
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

const getClinics = async (request, response) => {

    try {

        const clinics = await ClinicModel.aggregate([
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'speciality',
                    foreignField: '_id',
                    as: 'specialitiesTest'
                }
            }
        ])

        return response.status(200).json({
            accepted: true,
            clinics
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

const getClinicsStaffsByOwnerId = async (request, response) => {

    try {

        const { userId } = request.params

        const ownerClinics = await ClinicOwnerModel.find({ ownerId: userId })

        const clinics = ownerClinics.map(clinic => clinic.clinicId)

        const staffs = await UserModel.aggregate([
            {
                $match: { clinicId: { $in: clinics } }
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
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    password: 0,
                    speciality: 0
                }
            }
        ])

        staffs.forEach(staff => staff.clinic = staff.clinic[0])

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

const getClinic = async (request, response) => {

    try {

        const { clinicId } = request.params 

        const clinic = await ClinicModel.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(clinicId) }
            },
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'speciality',
                    foreignField: '_id',
                    as: 'specialities'
                }
            }
        ])

        return response.status(200).json({
            accepted: true,
            clinic: clinic[0]
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

const getClinicsByDoctorId = async (request, response) => {

    try {

        const { doctorId } = request.params

        const clinics = await ClinicDoctorModel.aggregate([
            {
                $match: {
                    doctorId: mongoose.Types.ObjectId(doctorId)
                }
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
                $sort: { createdAt: -1 }
            }
        ])

        clinics.forEach(clinic => {
            clinic.clinic = clinic.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            clinics
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

const getClinicsByPatientId = async (request, response) => {

    try {

        const { patientId } = request.params

        const clinics = await ClinicPatientModel.aggregate([
            {
                $match: {
                    patientId: mongoose.Types.ObjectId(patientId)
                }
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
                $sort: { createdAt: -1 }
            }
        ])

        clinics.forEach(clinic => {
            clinic.clinic = clinic.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            clinics
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
    addClinic, 
    updateClinic,
    getClinics, 
    getClinicsByDoctorId, 
    getClinicsByPatientId,
    getClinic,
    getClinicsStaffsByOwnerId
}