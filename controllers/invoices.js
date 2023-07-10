const InvoiceModel = require('../models/InvoiceModel')
const InvoiceServiceModel = require('../models/InvoiceServiceModel')
const invoiceValidator = require('../validations/invoices')
const ClinicModel = require('../models/ClinicModel')
const PatientModel = require('../models/PatientModel')
const CounterModel = require('../models/CounterModel')
const ServiceModel = require('../models/ServiceModel')
const ClinicOwnerModel = require('../models/ClinicOwnerModel')
const ClinicPatientModel = require('../models/ClinicPatientModel')
const mongoose = require('mongoose')
const utils = require('../utils/utils')


const getInvoices = async (request, response) => {

    try {

        const invoices = await InvoiceModel
        .find()
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            invoices
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

const getInvoice = async (request, response) => {

    try {

        const { invoiceId } = request.params

        const invoiceListPromise = InvoiceModel.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(invoiceId) }
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
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $project: {
                    'patient.healthHistory': 0,
                    'patient.emergencyContacts': 0
                }
            }
        ])

        const invoiceServicesPromise = InvoiceServiceModel.aggregate([
            {
                $match: { invoiceId: mongoose.Types.ObjectId(invoiceId) }
            },
            {
                $lookup: {
                    from: 'services',
                    localField: 'serviceId',
                    foreignField: '_id',
                    as: 'service'
                }
            }
        ])

        const [invoiceList, invoiceServices] = await Promise.all([
            invoiceListPromise,
            invoiceServicesPromise
        ])

        invoiceList.forEach(invoice => {
            invoice.clinic = invoice.clinic[0]
            invoice.patient = invoice.patient[0]
        })

        invoiceServices.forEach(invoiceService => invoiceService.service = invoiceService.service[0])

        const invoice = invoiceList[0]
        invoice.invoiceServices = invoiceServices

        return response.status(200).json({
            accepted: true,
            invoice,
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

const getInvoicesByClinicId = async (request, response) => {

    try {

        const { clinicId } = request.params

        const invoices = await InvoiceModel.aggregate([
            {
                $match: { clinicId: mongoose.Types.ObjectId(clinicId) }
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    'patient.healthHistory': 0,
                    'patient.emergencyContacts': 0
                }
            }
        ])

        invoices.forEach(invoice => invoice.patient = invoice.patient[0])

        return response.status(200).json({
            accepted: true,
            invoices
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

const getInvoicesByOwnerId = async (request, response) => {

    try {

        const { userId } = request.params

        const ownerClinics = await ClinicOwnerModel.find({ ownerId: userId })

        const clinics = ownerClinics.map(clinic => clinic.clinicId)

        const invoices = await InvoiceModel.aggregate([
            {
                $match: { clinicId: { $in: clinics } }
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
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
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    'patient.healthHistory': 0,
                    'patient.emergencyContacts': 0
                }
            }
        ])

        invoices.forEach(invoice => {
            invoice.patient = invoice.patient[0]
            invoice.clinic = invoice.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            invoices
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

const getInvoicesByPatientId = async (request, response) => {

    try {

        const { patientId } = request.params

        const invoices = await InvoiceModel.aggregate([
            {
                $match: { patientId: mongoose.Types.ObjectId(patientId) }
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    'patient.healthHistory': 0,
                    'patient.emergencyContacts': 0
                }
            }
        ])

        invoices.forEach(invoice => invoice.patient = invoice.patient[0])

        return response.status(200).json({
            accepted: true,
            invoices
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

const addInvoice = async (request, response) => {

    try {

        const dataValidation = invoiceValidator.addInvoice(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }
        
        const { clinicId, cardId } = request.body

        const clinicPromise = ClinicModel.findById(clinicId)
        const patientListPromise = PatientModel.find({ cardId })

        const [clinic, patientList] = await Promise.all([
            clinicPromise,
            patientListPromise
        ])

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        if(patientList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Card Id does not exist',
                field: 'cardId'
            })
        }

        const patient = patientList[0]
        const patientId = patient._id

        const clinicPatientsList = await ClinicPatientModel.find({ clinicId: clinic._id, patientId })
        if(clinicPatientsList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'patient is not registered in the clinic',
                field: 'cardId'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: `${clinic._id}-invoice` },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const invoiceObj = new InvoiceModel({ invoiceId: counter.value, patientId, ...request.body })
        const newInvoice = await invoiceObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Added invoice successfully!',
            invoice: newInvoice
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

const addInvoiceCheckout = async (request, response) => {

    try {

        const dataValidation = invoiceValidator.addInvoiceCheckout(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { invoiceId } = request.params
        const { services, paymentMethod, invoiceDate, paidAmount, dueDate } = request.body

        const invoice = await InvoiceModel.findById(invoiceId)

        if(invoice.status != 'DRAFT') {
            return response.status(400).json({
                accepted: false,
                message: `Invoice is already checkedout`,
                field: 'invoiceId'
            })
        }

        const uniqueServicesSet = new Set(services)
        const uniqueServicesList = [...uniqueServicesSet]

        const servicesList = await ServiceModel.find({ _id: { $in: uniqueServicesList }, clinicId: invoice.clinicId })

        if(servicesList.length == 0 || servicesList.length != uniqueServicesList.length) {
            return response.status(400).json({
                accepted: false,
                message: 'service Id is not registered',
                field: 'services'
            })
        }

        const servicesIds = services
        const INVOICE_TOTAL_COST = utils.calculateServicesTotalCost(servicesList, servicesIds)

        let invoiceStatus

        if(INVOICE_TOTAL_COST <= paidAmount) {
            invoiceStatus = 'PAID'
        } else if(paidAmount == 0) {
            invoiceStatus = 'PENDING'
        } else if(INVOICE_TOTAL_COST > paidAmount) {
            invoiceStatus = 'PARTIALLY_PAID'
        }

        const invoiceServices = services.map(service => {
            return {
                invoiceId,
                clinicId: invoice.clinicId,
                patientId: invoice.patientId,
                serviceId: service,
                amount: servicesList.filter(targetService => targetService._id.equals(service))[0].cost
            }
        })

        const invoiceNewData = {
            status: invoiceStatus,
            totalCost: INVOICE_TOTAL_COST,
            paymentMethod,
            paid: paidAmount,
            invoiceDate: new Date(invoiceDate),
            dueDate
        }

        const updatedInvoicePromise = InvoiceModel
        .findByIdAndUpdate(invoiceId, invoiceNewData, { new: true })

        const newInvoiceServicesPromise = InvoiceServiceModel.insertMany(invoiceServices)

        const [updatedInvoice, newInvoiceServices] = await Promise.all([
            updatedInvoicePromise,
            newInvoiceServicesPromise
        ])

        return response.status(200).json({
            accepted: true,
            message: 'added invoice successfully!',
            invoice: updatedInvoice,
            invoiceServices: newInvoiceServices
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

const updateInvoiceStatus = async (request, response) => {

    try {

        const { invoiceId } = request.params
        const { status } = request.body

        const dataValidation = invoiceValidator.updateInvoiceStatus(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const invoice = await InvoiceModel.findById(invoiceId)

        if(status == 'REFUNDED' && ['REFUNDED', 'DRAFT', 'PENDING'].includes(invoice.status)) {
            return response.status(400).json({
                accepted: false,
                message: `invoice is already ${invoice.status.toLowerCase()}`,
                field: 'status'
            })
        }

        const updatedInvoice = await InvoiceModel
        .findByIdAndUpdate(invoiceId, { status }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'updated invoice successfully!',
            invoice: updatedInvoice
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

const updateInvoicePaid = async (request, response) => {

    try {

        const dataValidation = invoiceValidator.updateInvoicePaid(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { invoiceId } = request.params
        const { paid } = request.body

        const invoice = await InvoiceModel.findById(invoiceId)

        if(!['PARTIALLY_PAID', 'PENDING'].includes(invoice.status) || invoice.totalCost == invoice.paid) {
            return response.status(400).json({
                accepted: false,
                message: 'invoice is not partially paid',
                field: 'status'
            })
        }

        let invoiceStatus = invoice.status
        const NEW_PAID = invoice.paid + paid

        if(NEW_PAID > invoice.totalCost) {
            return response.status(400).json({
                accepted: false,
                message: 'paid amount is more than the required',
                field: 'paid'
            })
        }

        invoiceStatus = invoice.totalCost == NEW_PAID ? 'PAID' : 'PARTIALLY_PAID'

        const invoiceUpdateData = { paid: NEW_PAID, status: invoiceStatus }

        const updatedInvoice = await InvoiceModel
        .findByIdAndUpdate(invoice._id, invoiceUpdateData, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'added payment successfully!',
            invoice: updatedInvoice
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

const deleteInvoice = async (request, response) => {

    try {

        const { invoiceId } = request.params

        const deletedInvoicePromise = InvoiceModel.findByIdAndDelete(invoiceId)
        const deletedInvoiceServicesPromise = InvoiceServiceModel.deleteMany({ invoiceId })

        const [deletedInvoice, deletedInvoiceServices] = await Promise.all([
            deletedInvoicePromise,
            deletedInvoiceServicesPromise
        ])

        return response.status(200).json({
            accepted: true,
            message: 'deleted invoice successfully!',
            invoice: deletedInvoice,
            invoiceServices: deletedInvoiceServices.deletedCount
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

const updateInvoice = async (request, response) => {

    try {

        const { invoiceId } = request.params

        const dataValidation = invoiceValidator.updateInvoice(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        return response.status(200).json({
            accepted: true,
            message: 'updated invoice successfully!'
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
    getInvoices,
    getInvoice, 
    addInvoice, 
    updateInvoiceStatus,
    updateInvoicePaid,
    updateInvoice,
    deleteInvoice,
    getInvoicesByClinicId,
    getInvoicesByOwnerId,
    getInvoicesByPatientId,
    addInvoiceCheckout
}