const InvoiceModel = require('../models/InvoiceModel')
const InvoiceServiceModel = require('../models/InvoiceServiceModel')
const invoiceValidator = require('../validations/invoices')
const ClinicModel = require('../models/ClinicModel')
const PatientModel = require('../models/PatientModel')
const CounterModel = require('../models/CounterModel')
const config = require('../config/config')
const mongoose = require('mongoose')


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

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'invoice' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const patient = patientList[0]
        const patientId = patient._id

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

        const invoice = await InvoiceModel
        .findByIdAndUpdate(invoiceId, { status }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'updated invoice successfully!',
            invoice
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

module.exports = { 
    getInvoices,
    getInvoice, 
    addInvoice, 
    updateInvoiceStatus,
    deleteInvoice,
    getInvoicesByClinicId,
    getInvoicesByPatientId
}