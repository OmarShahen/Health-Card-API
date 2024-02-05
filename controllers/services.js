const ServiceModel = require('../models/ServiceModel')
const UserModel = require('../models/UserModel')
const AppointmentModel = require('../models/AppointmentModel')
const CounterModel = require('../models/CounterModel')
const serviceValidation = require('../validations/services')


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

const getServicesByExpertId = async (request, response) => {

    try {

        const { userId } = request.params
        const { status } = request.query

        let matchQuery = { expertId: userId } 

        if(status == 'ACTIVE') {
            matchQuery.isActive = true
        } else if(status == 'INACTIVE') {
            matchQuery.isActive = false
        }

        const services = await ServiceModel
        .find(matchQuery)
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

        const { expertId, title } = request.body

        const expert = await UserModel.findById(expertId)
        if(!expert) {
            return response.status(400).json({
                accepted: false,
                message: 'Expert ID is not registered',
                field: 'expertId'
            })
        }

        const expertServicesList = await ServiceModel.find({ expertId, title })
        if(expertServicesList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Title is already registered in a service',
                field: 'title'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'service' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        ) 

        const serviceData = { serviceId: counter.value, ...request.body }
        const serviceObj = new ServiceModel(serviceData)
        const newService = await serviceObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Added service successfully!',
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

const updateService = async (request, response) => {

    try {

        const { serviceId } = request.params
        const { title } = request.body

        const dataValidation = serviceValidation.updateService(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const service = await ServiceModel.findById(serviceId)

        if(title != service.title) {
            const expertServicesList = await ServiceModel
            .find({ expertId: service.expertId, title })

            if(expertServicesList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Title is already registered in a service',
                    field: 'title'
                })
            }
        }

        const updatedService = await ServiceModel
        .findByIdAndUpdate(serviceId, request.body, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated service successfully!',
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

const updateServiceActivity = async (request, response) => {

    try {

        const { serviceId } = request.params
        const { isActive } = request.body

        const dataValidation = serviceValidation.updateServiceActivity(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const updatedService = await ServiceModel
        .findByIdAndUpdate(serviceId, { isActive }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated service activity successfully!',
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

const deleteService = async (request, response) => {

    try {

        const { serviceId } = request.params

        const appointmentsList = await AppointmentModel.find({ serviceId })
        if(appointmentsList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Service is registered with appointments',
                field: 'serviceId'
            })
        }

        const deletedService = await ServiceModel.findByIdAndDelete(serviceId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted service successfully!',
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


module.exports = { 
    getServices,
    getServicesByExpertId, 
    addService, 
    updateService, 
    updateServiceActivity,
    deleteService 
}