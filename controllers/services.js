const ServiceModel = require('../models/ServiceModel')
const serviceValidation = require('../validations/services')
const AppointmentModel = require('../models/AppointmentModel')
const ClinicModel = require('../models/ClinicModel')
const UserModel = require('../models/UserModel')
const InvoiceServiceModel = require('../models/InvoiceServiceModel')
const ClinicOwnerModel = require('../models/ClinicOwnerModel')
const mongoose = require('mongoose')
const translations = require('../i18n/index')

const getServices = async (request, response) => {

    try {

        const services = await ServiceModel
        .find()
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            services
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

const getServicesByClinicId = async (request, response) => {

    try {

        const { clinicId } = request.params

        const services = await ServiceModel.aggregate([
            {
                $match: { clinicId: mongoose.Types.ObjectId(clinicId) }
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
            }
        ])

        services.forEach(service => service.clinic = service.clinic[0])

        return response.status(200).json({
            accepted: true,
            services
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

const getServicesByUserId = async (request, response) => {

    try {

        const { userId } = request.params

        const ownerClinics = await ClinicOwnerModel.find({ ownerId: userId })

        const clinics = ownerClinics.map(clinic => clinic.clinicId)

        const services = await ServiceModel.aggregate([
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
                $sort: { createdAt: -1 }
            }
        ])

        services.forEach(service => service.clinic = service.clinic[0])

        return response.status(200).json({
            accepted: true,
            services
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

const addService = async (request, response) => {

    try {

        const dataValidation = serviceValidation.addService(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clinicId, name } = request.body

        const clinic = await ClinicModel.findById(clinicId)
        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'clinic Id is not registered',
                field: 'clinicId'
            })
        }

        const serviceList = await ServiceModel.find({ clinicId, name })
        if(serviceList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Service name is already registered'],
                field: 'name'
            })
        }

        const serviceObj = new ServiceModel(request.body)
        const newService = await serviceObj.save()

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added service successfully!'],
            service: newService
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

const deleteService = async (request, response) => {

    try {

        const { serviceId } = request.params

        const invoiceList = await InvoiceServiceModel.find({ serviceId })

        if(invoiceList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['The service is already registered with invoices'],
                field: 'serviceId'
            })
        }

        const appointmentsList = await AppointmentModel.find({ serviceId })

        if(appointmentsList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['The service is already registered with appointments'],
                field: 'serviceId'
            })
        }
        
        const deletedService = await ServiceModel.findByIdAndDelete(serviceId)

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Deleted service successfully!'],
            service: deletedService
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

const updateService = async (request, response) => {

    try {

        const dataValidation = serviceValidation.updateService(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { serviceId } = request.params
        const { name, cost } = request.body

        const service = await ServiceModel.findById(serviceId)

        if(name != service.name) {

            const nameList = await ServiceModel.find({ clinicId: service.clinicId, name })
            if(nameList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: translations[request.query.lang]['Service name is already registered'],
                    field: 'name'
                })
            }
        }

        const serviceData = { name, cost }
        const updatedService = await ServiceModel
        .findByIdAndUpdate(serviceId, serviceData, { new: true })

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated service successfully!'],
            service: updatedService
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
    getServices,
    getServicesByClinicId,
    getServicesByUserId,
    addService,
    deleteService,
    updateService
}