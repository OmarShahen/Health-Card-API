const ClinicModel = require('../models/ClinicModel')
const InvoiceModel = require('../models/InvoiceModel')
const ServiceModel = require('../models/ServiceModel')
const InvoiceServiceModel = require('../models/InvoiceServiceModel')
const invoiceServiceValidator = require('../validations/invoices-services')
const mongoose = require('mongoose')

const getInvoicesServices = async (request, response) => {

    try {

        const invoicesServices = await InvoiceServiceModel
        .find()
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            invoicesServices
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

const getInvoiceServices = async (request, response) => {

    try {

        const { invoiceId } = request.params

        const invoiceServices = await InvoiceServiceModel.aggregate([
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

        invoiceServices.forEach(invoiceService => invoiceService.service = invoiceService.service[0])

        return response.status(200).json({
            accepted: true,
            invoiceServices
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

const addInvoiceService = async (request, response) => {

    try {

        const dataValidation = invoiceServiceValidator.addInvoiceService(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { invoiceId, serviceId, amount } = request.body

        const invoicePromise = InvoiceModel.findById(invoiceId)
        const servicePromise = ServiceModel.findById(serviceId)

        const [invoice, service] = await Promise.all([invoicePromise, servicePromise])

        if(!invoice) {
            return response.status(400).json({
                accepted: false,
                message: 'invoice Id is does not exist',
                field: 'invoiceId'
            })
        }

        if(!service) {
            return response.status(400).json({
                accepted: false,
                message: 'service Id is does not exist',
                field: 'serviceId'
            })
        }

        if(!invoice.clinicId.equals(service.clinicId)) {
            return response.status(400).json({
                accepted: false,
                message: 'service is not registered in clinic',
                field: 'serviceId'
            })
        }

        const invoiceServiceData = {
            invoiceId,
            clinicId: invoice.clinicId,
            serviceId,
            patientId: invoice.patientId,
            amount: service.cost
        }

        const INVOICE_TOTAL_AMOUNT = invoice.totalCost + service.cost

        const invoiceServiceObj = new InvoiceServiceModel(invoiceServiceData)
        const newinvoiceServicePromise = invoiceServiceObj.save()

        const updatedInvoicePromise = InvoiceModel
        .findByIdAndUpdate(invoiceId, { totalCost: INVOICE_TOTAL_AMOUNT }, { new: true })

        const [newinvoiceService, updatedInvoice] = await Promise.all([newinvoiceServicePromise, updatedInvoicePromise])

        return response.status(200).json({
            accepted: true,
            message: 'Added service to the invoice successfully!',
            invoiceService: newinvoiceService,
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

const deleteInvoiceService = async (request, response) => {

    try {

        const { invoiceServiceId } = request.params

        const invoiceService = await InvoiceServiceModel.findById(invoiceServiceId)

        const { invoiceId } = invoiceService

        const invoice = await InvoiceModel.findById(invoiceId)

        const INVOICE_TOTAL_AMOUNT = invoice.totalCost - invoiceService.amount

        const deletedInvoiceServicePromise = InvoiceServiceModel.findByIdAndDelete(invoiceServiceId)

        const updatedInvoicePromise = InvoiceModel
        .findByIdAndUpdate(invoiceId, { totalCost: INVOICE_TOTAL_AMOUNT }, { new: true })

        const [deletedInvoiceService, updatedInvoice] = await Promise.all([deletedInvoiceServicePromise, updatedInvoicePromise])

        return response.status(200).json({
            accepted: true,
            message: 'Added service to the invoice successfully!',
            invoiceService: deletedInvoiceService,
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


module.exports = { 
    getInvoicesServices, 
    addInvoiceService, 
    deleteInvoiceService, 
    getInvoiceServices 
}