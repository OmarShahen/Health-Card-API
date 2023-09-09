const InvoiceModel = require('../models/InvoiceModel')
const InvoiceServiceModel = require('../models/InvoiceServiceModel')
const invoiceValidator = require('../validations/invoices')
const ClinicModel = require('../models/ClinicModel')
const InsuranceModel = require('../models/InsuranceModel')
const PatientModel = require('../models/PatientModel')
const CounterModel = require('../models/CounterModel')
const ServiceModel = require('../models/ServiceModel')
const ClinicOwnerModel = require('../models/ClinicOwnerModel')
const ClinicPatientModel = require('../models/ClinicPatientModel')
const InsurancePolicyModel = require('../models/InsurancePolicyModel')
const InsuranceCompanyModel = require('../models/InsuranceModel')
const UserModel = require('../models/UserModel')
const mongoose = require('mongoose')
const utils = require('../utils/utils')
const translations = require('../i18n/index')


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
                $lookup: {
                    from: 'insurances',
                    localField: 'insuranceCompanyId',
                    foreignField: '_id',
                    as: 'insuranceCompany'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'creatorId',
                    foreignField: '_id',
                    as: 'creator'
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
            invoice.creator = invoice.creator[0]
            invoice.insuranceCompany = invoice.insuranceCompany[0]
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

        const { searchQuery } = utils.statsQueryGenerator('clinicId', clinicId, request.query)

        const invoices = await InvoiceModel.aggregate([
            {
                $match: searchQuery
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
                    from: 'insurances',
                    localField: 'insuranceCompanyId',
                    foreignField: '_id',
                    as: 'insuranceCompany'
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
            invoice.insuranceCompany = invoice.insuranceCompany.length != 0 ? invoice.insuranceCompany[0] : null
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

const getInvoicesByInsuranceCompanyId = async (request, response) => {

    try {

        const { insuranceId } = request.params

        const { searchQuery } = utils.statsQueryGenerator('insuranceCompanyId', insuranceId, request.query)

        const invoices = await InvoiceModel.aggregate([
            {
                $match: searchQuery
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
                    from: 'insurances',
                    localField: 'insuranceCompanyId',
                    foreignField: '_id',
                    as: 'insuranceCompany'
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
            invoice.insuranceCompany = invoice.insuranceCompany.length != 0 ? invoice.insuranceCompany[0] : null
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


const getInvoicesByOwnerId = async (request, response) => {

    try {

        const { userId } = request.params

        const ownerClinics = await ClinicOwnerModel.find({ ownerId: userId })

        const clinics = ownerClinics.map(clinic => clinic.clinicId)

        let { searchQuery } = utils.statsQueryGenerator('temp', userId, request.query)
        
        delete searchQuery.temp
        searchQuery.clinicId = { $in: clinics }

        const invoices = await InvoiceModel.aggregate([
            {
                $match: searchQuery
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
                $lookup: {
                    from: 'insurances',
                    localField: 'insuranceCompanyId',
                    foreignField: '_id',
                    as: 'insuranceCompany'
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
            invoice.insuranceCompany = invoice.insuranceCompany.length != 0 ? invoice.insuranceCompany[0] : null
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

        const { searchQuery } = utils.statsQueryGenerator('patientId', patientId, request.query)

        const invoices = await InvoiceModel.aggregate([
            {
                $match: searchQuery
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
                    from: 'insurances',
                    localField: 'insuranceCompanyId',
                    foreignField: '_id',
                    as: 'insuranceCompany'
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
            invoice.insuranceCompany = invoice.insuranceCompany.length != 0 ? invoice.insuranceCompany[0] : null
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

const getClinicInvoicesByPatientId = async (request, response) => {

    try {

        const { clinicId, patientId } = request.params

        const { searchQuery } = utils.statsQueryGenerator('patientId', patientId, request.query)
        searchQuery.clinicId = mongoose.Types.ObjectId(clinicId)

        const invoices = await InvoiceModel.aggregate([
            {
                $match: searchQuery
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
                    from: 'insurances',
                    localField: 'insuranceCompanyId',
                    foreignField: '_id',
                    as: 'insuranceCompany'
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
            invoice.insuranceCompany = invoice.insuranceCompany.length != 0 ? invoice.insuranceCompany[0] : null
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

        const { clinicId, patientId, creatorId, services, paymentMethod, invoiceDate, paidAmount, dueDate } = request.body

        const clinicPromise = ClinicModel.findById(clinicId)
        const patientPromise = PatientModel.findById(patientId)
        const creatorPromise = UserModel.findById(creatorId)

        const [clinic, patient, creator] = await Promise.all([
            clinicPromise,
            patientPromise,
            creatorPromise
        ])

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic Id does not exist',
                field: 'clinicId'
            })
        }

        if(!patient) {
            return response.status(400).json({
                accepted: false,
                message: 'Patient Id does not exist',
                field: 'patientId'
            })
        }

        if(!creator) {
            return response.status(400).json({
                accepted: false,
                message: 'Creator Id does not exist',
                field: 'creatorId'
            })
        }

        const clinicPatientsList = await ClinicPatientModel.find({ clinicId, patientId })
        if(clinicPatientsList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Patient is not registered with the clinic'],
                field: 'patientId'
            })
        }

        const uniqueServicesSet = new Set(services)
        const uniqueServicesList = [...uniqueServicesSet]

        const servicesList = await ServiceModel.find({ _id: { $in: uniqueServicesList }, clinicId: clinicId })

        if(servicesList.length == 0 || servicesList.length != uniqueServicesList.length) {
            return response.status(400).json({
                accepted: false,
                message: 'service Id is not registered',
                field: 'services'
            })
        }

        const insurancePolicyList = await InsurancePolicyModel
        .find({ patientId, clinicId, status: 'ACTIVE', endDate: { $gt: Date.now() } })

        const servicesIds = services
        const invoiceServicesTotalCost = utils.calculateServicesTotalCost(servicesList, servicesIds)

        let invoiceFinalTotalCost = invoiceServicesTotalCost

        let isInsuranceCompanyActive

        if(insurancePolicyList.length != 0) {
            const insurancePolicy = insurancePolicyList[0]
            const insuranceCompany = await InsuranceModel.findById(insurancePolicy.insuranceCompanyId)
            isInsuranceCompanyActive = insuranceCompany.isActive

            if(insuranceCompany.isActive) {
                const insuranceCoverageAmount = invoiceServicesTotalCost * (insurancePolicy.coveragePercentage / 100)
                invoiceFinalTotalCost = invoiceServicesTotalCost - insuranceCoverageAmount
            }
        }

        if(invoiceFinalTotalCost < paidAmount) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Amount paid is more than the required'],
                field: 'paidAmount'
            })
        }

        let invoiceStatus

        if(invoiceFinalTotalCost == paidAmount) {
            invoiceStatus = 'PAID'
        } else if(paidAmount == 0) {
            invoiceStatus = 'PENDING'
        } else if(invoiceFinalTotalCost > paidAmount) {
            invoiceStatus = 'PARTIALLY_PAID'
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: `${clinic._id}-invoice` },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        let newInvoiceData = {
            invoiceId: counter.value,
            patientId,
            clinicId,
            creatorId,
            status: invoiceStatus,
            totalCost: invoiceServicesTotalCost,
            paymentMethod,
            paid: paidAmount,
            invoiceDate: new Date(invoiceDate),
            dueDate
        }

        if(insurancePolicyList.length != 0 && isInsuranceCompanyActive) {
            const insurancePolicy = insurancePolicyList[0]
            newInvoiceData.insuranceCompanyId = insurancePolicy.insuranceCompanyId
            newInvoiceData.insurancePolicyId = insurancePolicy._id
            newInvoiceData.insuranceCoveragePercentage = insurancePolicy.coveragePercentage
        } 

        const invoiceObj = new InvoiceModel(newInvoiceData)
        const newInvoice = await invoiceObj.save()

        let formattedInvoice = { ...newInvoice._doc, clinic } 
        
        if(insurancePolicyList.length != 0) {
            const insurancePolicy = insurancePolicyList[0]
            const insuranceCompany = await InsuranceCompanyModel.findById(insurancePolicy.insuranceCompanyId)

            formattedInvoice.insurancePolicy = insurancePolicy
            formattedInvoice.insuranceCompany = { ...insuranceCompany._doc }
        }   

        const invoiceServices = services.map(service => {
            return {
                invoiceId: newInvoice._id,
                clinicId: newInvoice.clinicId,
                patientId: newInvoice.patientId,
                serviceId: service,
                amount: servicesList.filter(targetService => targetService._id.equals(service))[0].cost
            }
        })

        const newInvoiceServices = await InvoiceServiceModel.insertMany(invoiceServices)

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added invoice successfully!'],
            invoice: formattedInvoice,
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
            message: translations[request.query.lang]['Updated invoice successfully!'],
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
                message: translations[request.query.lang]['Invoice is not partially paid'],
                field: 'status'
            })
        }

        let invoiceStatus = invoice.status
        const NEW_PAID = invoice.paid + paid
        let amountRemaining = invoice.totalCost - invoice.paid

        if(invoice.insuranceCoveragePercentage) {
            const insuranceCoverageAmount = invoice.totalCost * (invoice.insuranceCoveragePercentage / 100)
            amountRemaining = (invoice.totalCost - insuranceCoverageAmount) - invoice.paid
        }

        if(paid > amountRemaining) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Paid amount is more than the required'],
                field: 'paid'
            })
        }

        invoiceStatus = amountRemaining == paid ? 'PAID' : 'PARTIALLY_PAID'

        const invoiceUpdateData = { paid: NEW_PAID, status: invoiceStatus }

        const updatedInvoice = await InvoiceModel
        .findByIdAndUpdate(invoice._id, invoiceUpdateData, { new: true })
        
        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added payment successfully!'],
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
            message: translations[request.query.lang]['Deleted invoice successfully!'],
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
            message: translations[request.query.lang]['Updated invoice successfully!']
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
    getClinicInvoicesByPatientId,
    getInvoicesByInsuranceCompanyId,
    getInvoicesByOwnerId,
    getInvoicesByPatientId,
}