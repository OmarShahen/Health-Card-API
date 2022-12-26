const SupplierModel = require('../models/SupplierModel')
const supplierValidator = require('../validations/suppliers')
const PaymentModel = require('../models/paymentModel')
const translations = require('../i18n/index')

const addSupplier = async (request, response) => {

    try {

        const { clubId } = request.params
        const { lang } = request.query
        const { name, phone, countryCode, description } = request.body

        const dataValidation = supplierValidator.addSupplier(request.body, lang)
        
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const suppliersList = await SupplierModel.find({ clubId, countryCode, phone })

        if(suppliersList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Supplier phone is registered in the club'],
                field: 'phone'
            })
        }

        const supplierData = { clubId, name, phone, countryCode, description }

        const supplierObj = new SupplierModel(supplierData)
        const newSupplier = await supplierObj.save()

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Added supplier successfully'],
            supplier: newSupplier
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

const getClubSuppliers = async (request, response) => {

    try {

        const { clubId } = request.params

        const suppliers = await SupplierModel
        .find({ clubId })
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            suppliers
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

const deleteSupplier = async (request, response) => {

    try {

        const { supplierId } = request.params
        const { lang } = request.query

        const paymentsList = await PaymentModel.find({ supplierId })

        if(paymentsList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['There is payments registered with the supplier'],
                field: 'supplierId'
            })
        }

        const deletedSupplier = await SupplierModel.findByIdAndDelete(supplierId)

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Supplier deleted successfully'],
            supplier: deletedSupplier
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

const updateSupplier = async (request, response) => {

    try {

        const { lang } = request.query
        const { supplierId } = request.params
        const { name, description, countryCode, phone } = request.body


        const dataValidation = supplierValidator.updateSupplier(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const supplier = await SupplierModel.findById(supplierId)

        if(countryCode == supplier.countryCode && supplier.phone != phone) {

            const phoneList = await SupplierModel
            .find({ clubId: supplier.clubId, phone, countryCode })

            if(phoneList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: translations[lang]['Supplier phone is registered in the club'],
                    field: 'phone'
                })
            }
        }

        const supplierData = { name, description, phone, countryCode }

        const updatedSupplier = await SupplierModel
        .findByIdAndUpdate(
            supplierId,
            supplierData,
            { new: true }
        )
        

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Updated supplier successfully'],
            supplier: updatedSupplier
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}
 
module.exports = { addSupplier, getClubSuppliers, deleteSupplier, updateSupplier }