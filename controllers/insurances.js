const InsuranceModel = require('../models/InsuranceModel')
const InsurancePolicyModel = require('../models/InsurancePolicyModel')
const ClinicModel = require('../models/ClinicModel')
const InvoiceModel = require('../models/InvoiceModel')
const ClinicOwnerModel = require('../models/ClinicOwnerModel')
const insuranceValidator = require('../validations/insurances')
const translations = require('../i18n/index')
const mongoose = require('mongoose')

const getInsurances = async (request, response) => {

    try {

        const insurances = await InsuranceModel
        .find()
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            insurances
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

const getInsurance = async (request, response) => {

    try {

        const { insuranceId } = request.params

        const insurance = await InsuranceModel.findById(insuranceId)

        return response.status(200).json({
            accepted: true,
            insurance
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


const getInsurancesByClinicId = async (request, response) => {

    try {

        const { clinicId } = request.params

        const insurances = await InsuranceModel.aggregate([
            {
                $match: {
                    clinicId: mongoose.Types.ObjectId(clinicId)
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
            }
        ])

        insurances.forEach(insurance => insurance.clinic = insurance.clinic[0])

        return response.status(200).json({
            accepted: true,
            insurances
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

const getInsurancesByOwnerId = async (request, response) => {

    try {

        const { userId } = request.params

        const ownerClinics = await ClinicOwnerModel.find({ ownerId: userId })

        const clinics = ownerClinics.map(clinic => clinic.clinicId)

        const insurances = await InsuranceModel.aggregate([
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
            }
        ])

        insurances.forEach(insurance => insurance.clinic = insurance.clinic[0])

        return response.status(200).json({
            accepted: true,
            insurances
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

const addInsurance = async (request, response) => {

    try {

        const dataValidation = insuranceValidator.addInsurance(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { name, clinicId, startDate, endDate } = request.body
        
        const clinic = await ClinicModel.findById(clinicId)
        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'Clinic ID does not exists',
                field: 'clinicId'
            })
        }

        const insuranceList = await InsuranceModel.find({ name, clinicId })
        if(insuranceList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Name is already registered in the clinic'],
                field: 'name'
            })
        }

        const insuranceData = { name, clinicId, startDate, endDate }
        const insuranceObj = new InsuranceModel(insuranceData)
        const newInsurance = await insuranceObj.save()

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added new insurance successfully!'],
            insurance: newInsurance
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

const deleteInsurance = async (request, response) => {

    try {

        const { insuranceId } = request.params

        const invoicesList = await InvoiceModel.find({ insuranceCompanyId: insuranceId })
        if(invoicesList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['This insurance is registered with invoices'],
                field: 'insuranceId'
            })
        }

        const insurancePoliciesList = await InsurancePolicyModel.find({ insuranceCompanyId: insuranceId })
        if(insurancePoliciesList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['This insurance is registered with insurance policies'],
                field: 'insuranceId'
            })
        }

        const insurance = await InsuranceModel.findByIdAndDelete(insuranceId)

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Deleted insurance successfully!'],
            insurance
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

const updateInsurance = async (request, response) => {

    try {

        const dataValidation = insuranceValidator.updateInsurance(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { insuranceId } = request.params
        const { name, startDate, endDate } = request.body

        const insurance = await InsuranceModel.findById(insuranceId)

        if(name != insurance.name) {
            const nameList = await InsuranceModel.find({ clinicId: insurance.clinicId, name })
            if(nameList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: translations[request.query.lang]['Name is already registered in the clinic'],
                    field: 'name'
                })
            }
        }

        const insuranceStartDate = new Date(insurance.startDate).getTime()
        const insuranceEndDate = new Date(insurance.endDate).getTime()

        if(new Date(startDate).getTime() != insuranceStartDate || new Date(endDate).getTime() != insuranceEndDate) {
            const insurancePolicies = await InsurancePolicyModel.find({ insuranceCompanyId: insuranceId })
            if(insurancePolicies.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: translations[request.query.lang]['Cannot update dates and there is insurance policies registered with it'],
                    field: 'insuranceId'
                })
            }
        }

        const insuranceData = { name, startDate, endDate }
        const updatedInsurance = await InsuranceModel
        .findByIdAndUpdate(insuranceId, insuranceData, { new: true })


        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated insurance successfully!'],
            insurance: updatedInsurance
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

const updateInsuranceStatus = async (request, response) => {

    try {

        const { insuranceId } = request.params
        const { isActive } = request.body

        const dataValidation = insuranceValidator.updateInsuranceStatus(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const insurance = await InsuranceModel.findById(insuranceId)

        const todayDate = new Date()
        const insuranceEndDate = new Date(insurance.endDate)

        if(todayDate > insuranceEndDate) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Insurance passed expiry date'],
                field: 'insuranceId'
            })
        }

        const updateData = { isActive }
        const updatedInsurance = await InsuranceModel
        .findByIdAndUpdate(insuranceId, updateData, { new: true })


        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated insurance company status successfully!'],
            insurance: updatedInsurance
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
    getInsurances,
    getInsurance,
    getInsurancesByClinicId,
    getInsurancesByOwnerId,
    addInsurance, 
    deleteInsurance,
    updateInsurance,
    updateInsuranceStatus
}