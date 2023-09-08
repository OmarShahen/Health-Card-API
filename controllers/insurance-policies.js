const InsurancePolicyModel = require('../models/InsurancePolicyModel')
const InsuranceModel = require('../models/InsuranceModel')
const InvoiceModel = require('../models/InvoiceModel')
const ClinicModel = require('../models/ClinicModel')
const ClinicOwnerModel = require('../models/ClinicOwnerModel')
const ClinicPatientModel = require('../models/ClinicPatientModel')
const PatientModel = require('../models/PatientModel')
const insurancePolicyValidator = require('../validations/insurance-policies')
const mongoose = require('mongoose')
const utils = require('../utils/utils')
const translations = require('../i18n/index')


const getInsurancePolicies = async (request, response) => {

    try {

        const insurancePolicies = await InsurancePolicyModel
        .find()
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            insurancePolicies
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

const getInsurancePoliciesByClinicId = async (request, response) => {

    try {

        const { clinicId } = request.params

        const { searchQuery } = utils.statsQueryGenerator('clinicId', clinicId, request.query)

        const insurancePolicies = await InsurancePolicyModel.aggregate([
            {
                $match: searchQuery
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
                $sort: {
                    createdAt: -1
                }
            }
        ])

        insurancePolicies.forEach(insurancePolicy => {
            insurancePolicy.insuranceCompany = insurancePolicy.insuranceCompany[0]
            insurancePolicy.clinic = insurancePolicy.clinic[0]
            insurancePolicy.patient = insurancePolicy.patient[0]
        })

        return response.status(200).json({
            accepted: true,
            insurancePolicies
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

const getInsurancePoliciesByPatientId = async (request, response) => {

    try {

        const { patientId } = request.params

        const insurancePolicies = await InsurancePolicyModel.aggregate([
            {
                $match: { patientId: mongoose.Types.ObjectId(patientId) }
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
                $sort: {
                    createdAt: -1
                }
            }
        ])

        insurancePolicies.forEach(insurancePolicy => {
            insurancePolicy.insuranceCompany = insurancePolicy.insuranceCompany[0]
            insurancePolicy.clinic = insurancePolicy.clinic[0]
            insurancePolicy.patient = insurancePolicy.patient[0]
        })

        return response.status(200).json({
            accepted: true,
            insurancePolicies
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

const getClinicPatientActiveInsurancePolicy = async (request, response) => {

    try {

        const { patientId, clinicId } = request.params

        const insurancePolicyList = await InsurancePolicyModel
        .find({ patientId, clinicId, status: 'ACTIVE', endDate: { $gt: Date.now() } })

        if(insurancePolicyList.length != 0) {
            const insurancePolicy = insurancePolicyList[0]
            const insuranceCompany = await InsuranceModel.findById(insurancePolicy.insuranceCompanyId)

            if(!insuranceCompany.isActive) {
                return response.status(200).json({
                    accepted: true,
                    insurancePolicy: []
                })
            }

        }

        return response.status(200).json({
            accepted: true,
            insurancePolicy: insurancePolicyList
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

const getInsurancePoliciesByInsuranceCompanyId = async (request, response) => {

    try {

        const { insuranceId } = request.params

        const insurancePolicies = await InsurancePolicyModel.aggregate([
            {
                $match: { insuranceCompanyId: mongoose.Types.ObjectId(insuranceId)}
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
                $sort: {
                    createdAt: -1
                }
            }
        ])

        insurancePolicies.forEach(insurancePolicy => {
            insurancePolicy.insuranceCompany = insurancePolicy.insuranceCompany[0]
            insurancePolicy.clinic = insurancePolicy.clinic[0]
            insurancePolicy.patient = insurancePolicy.patient[0]
        })

        return response.status(200).json({
            accepted: true,
            insurancePolicies
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

const getInsurancePoliciesByOwnerId = async (request, response) => {

    try {

        const { userId } = request.params

        const ownerClinics = await ClinicOwnerModel.find({ ownerId: userId })

        const clinics = ownerClinics.map(clinic => clinic.clinicId)

        let { searchQuery } = utils.statsQueryGenerator('temp', userId, request.query)

        delete searchQuery.temp
        searchQuery.clinicId = { $in: clinics }

        const insurancePolicies = await InsurancePolicyModel.aggregate([
            {
                $match: searchQuery
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
                $sort: {
                    createdAt: -1
                }
            }
        ])

        insurancePolicies.forEach(insurancePolicy => {
            insurancePolicy.insuranceCompany = insurancePolicy.insuranceCompany[0]
            insurancePolicy.clinic = insurancePolicy.clinic[0]
            insurancePolicy.patient = insurancePolicy.patient[0]
        })

        return response.status(200).json({
            accepted: true,
            insurancePolicies
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

const addInsurancePolicy = async (request, response) => {

    try {

        const dataValidation = insurancePolicyValidator.addInsurancePolicy(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { insuranceCompanyId, clinicId, patientId, type, status, coveragePercentage, startDate, endDate } = request.body

        const insuranceCompanyPromise = InsuranceModel.findById(insuranceCompanyId)
        const clinicPromise = ClinicModel.findById(clinicId)
        const patientPromise = PatientModel.findById(patientId)

        const [insuranceCompany, clinic, patient] = await Promise.all([
            insuranceCompanyPromise,
            clinicPromise,
            patientPromise
        ])

        if(!insuranceCompany) {
            return response.status(400).json({
                accepted: false, 
                message: 'Insurance company ID is not registered',
                field: 'insuranceCompanyId'
            })
        }

        if(!insuranceCompany.isActive) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Insurance company is blocked'],
                field: 'insuranceCompanyId'
            })
        }

        if(!clinic) {
            return response.status(400).json({
                accepted: false, 
                message: 'Clinic ID is not registered',
                field: 'clinic'
            })
        }

        if(!patient) {
            return response.status(400).json({
                accepted: false,
                message: 'Patient ID is not registered',
                field: 'patientId'
            })
        }

        const clinicPatientList = await ClinicPatientModel.find({ patientId })

        if(clinicPatientList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Patient is not registered in clinic'],
                field: 'patientId'
            })
        }

        const todayDate = new Date()
        const insuranceCompanyStartDate = new Date(insuranceCompany.startDate)
        const insuranceCompanyEndDate = new Date(insuranceCompany.endDate)

        if(insuranceCompanyEndDate < todayDate) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Insurance company contract has expired'],
                field: 'insuranceCompanyId'
            })
        }

        const insurancePolicyStartDate = new Date(startDate)
        const insurancePolicyEndDate = new Date(endDate)

        if(insuranceCompanyStartDate > insurancePolicyStartDate) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Insurance company contract is not active yet'],
                field: 'startDate'
            })
        }

        if(insuranceCompanyEndDate < insurancePolicyEndDate) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Insurance company contract has expired'],
                field: 'endDate'
            })
        }

        const patientInsurancePolicy = await InsurancePolicyModel
        .find({ patientId, clinicId, status: 'ACTIVE', endDate: { $gt: Date.now() } })

        if(patientInsurancePolicy.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Patient is already registered with active insurance policy in clinic'],
                field: 'patientId'
            })
        }

        const insurancePolicyData = {
            insuranceCompanyId,
            clinicId,
            patientId,
            type,
            status,
            coveragePercentage,
            startDate,
            endDate
        }

        const insurancePolicyObj = new InsurancePolicyModel(insurancePolicyData)
        const newInsurancePolicy = await insurancePolicyObj.save()

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added new insurance policy successfully!'],
            insurancePolicy: newInsurancePolicy
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

const deleteInsurancePolicy = async (request, response) => {

    try {

        const { insurancePolicyId } = request.params

        const invoices = await InvoiceModel.find({ insurancePolicyId })
        
        if(invoices.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Insurance policy is registered with invoices'],
                field: 'insurancePolicyId'
            })
        }

        const deletedInsurancePolicy = await InsurancePolicyModel.findByIdAndDelete(insurancePolicyId)

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Deleted insurance policy successfully!'],
            insurancePolicy: deletedInsurancePolicy
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

const updateInsurancePolicyStatus = async (request, response) => {

    try {

        const { insurancePolicyId } = request.params

        const dataValidation = insurancePolicyValidator.updateInsurancePolicyStatus(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { status } = request.body

        const insurancePolicy = await InsurancePolicyModel.findById(insurancePolicyId)

        const todayDate = new Date()
        const insurancePolicyEndDate = new Date(insurancePolicy.endDate)

        if(todayDate > insurancePolicyEndDate) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Insurance end date has passed'],
                field: 'endDate'
            })
        }

        if(status == insurancePolicy.status) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Insurance policy is already in this status'],
                field: 'status'
            })
        }

        if(status == 'ACTIVE') {

            const { patientId, clinicId } = insurancePolicy

            const patientInsurancePolicy = await InsurancePolicyModel
            .find({ patientId, clinicId, status: 'ACTIVE', endDate: { $gt: Date.now() } })

            if(patientInsurancePolicy.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: translations[request.query.lang]['Patient is already registered with active insurance policy in clinic'],
                    field: 'patientId'
                })
            }
        }

        const updatedInsurancePolicy = await InsurancePolicyModel
        .findByIdAndUpdate(insurancePolicyId, { status }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated insurance policy status successfully!'],
            insurancePolicy: updatedInsurancePolicy
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

const updateInsurancePolicy = async (request, response) => {

    try {

        const { insurancePolicyId } = request.params

        const dataValidation = insurancePolicyValidator.updateInsurancePolicy(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const invoicesList = await InvoiceModel.find({ insurancePolicyId })
        if(invoicesList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Insurance policy is registered with invoices'],
                field: 'insurancePolicyId'
            })
        }

        const insurancePolicy = await InsurancePolicyModel.findById(insurancePolicyId)

        if(insurancePolicy.status == 'INACTIVE') {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Insurance policy is inactive'],
                field: 'insurancePolicyId'
            })
        }

        const todayDate = new Date()
        const insurancePolicyEndDate = new Date(insurancePolicy.endDate)

        if(todayDate > insurancePolicyEndDate) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Insurance end date has passed'],
                field: 'insurancePolicyId'
            })
        }

        const { type, coveragePercentage, startDate, endDate } = request.body

        const updateInsurancePolicyData = { type, coveragePercentage, startDate, endDate }
        const updatedInsurancePolicy = await InsurancePolicyModel
        .findByIdAndUpdate(insurancePolicyId, updateInsurancePolicyData, { new: true })


        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated insurance policy successfully!'],
            insurancePolicy: updatedInsurancePolicy
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
    getInsurancePolicies, 
    addInsurancePolicy, 
    getInsurancePoliciesByClinicId, 
    getInsurancePoliciesByOwnerId,
    getInsurancePoliciesByPatientId,
    getInsurancePoliciesByInsuranceCompanyId,
    deleteInsurancePolicy,
    updateInsurancePolicyStatus,
    updateInsurancePolicy,
    getClinicPatientActiveInsurancePolicy
}