const packageValidation = require('../validations/packages')
const PackageModel = require('../models/PackageModel')
const ClubModel = require('../models/ClubModel')
const RegistrationModel = require('../models/RegistrationModel')


const addPackage = async (request, response) => {

    try {

        const dataValidation = packageValidation.packageData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId, title, attendance, expiresIn, price } = request.body

        const club = await ClubModel.findById(clubId)

        if(!club) {
            return response.status(404).json({
                message: 'club Id does not exist',
                field: 'clubId'
            })
        }

        const packagesNameList = await PackageModel
        .find({ clubId, title })

        if(packagesNameList.length != 0) {
            return response.status(400).json({
                message: 'package title is already registered',
                field: 'title'
            })
        }

        const packageData = { clubId, title, attendance, expiresIn, price }

        const packageObj = new PackageModel(packageData)
        const newPackage = await packageObj.save()

        return response.status(200).json({
            message: 'package is added successfully',
            newPackage
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getPackages = async (request, response) => {

    try {

        const { clubId } = request.params
        const { status } = request.query

        let packages

        if(status == 'active') {

            packages = await PackageModel
            .find({ clubId, isOpen: true })

        } else if(status == 'removed') {

            packages = await PackageModel
            .find({ clubId, isOpen: false })

        } else if(status == 'all') {

            packages = await PackageModel
            .find({ clubId })

        } else {

            packages = await PackageModel
            .find({ clubId, isOpen: true })

        }


        return response.status(200).json({
            packages
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const updatePackage = async (request, response) => {

    try {

        const dataValidation = packageValidation.updatePackageData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { packageId } = request.params
        const { title, attendance, expiresIn, price } = request.body

        const package = await PackageModel.findById(packageId)

        if(package.title != title) {

            const titleList = await PackageModel
            .find({ clubId: package.clubId, title })

            if(titleList.length != 0) {
                return response.status(400).json({
                    message: 'title is already registered',
                    field: 'title'
                })
            }
        }

        const newPackage = { title, attendance, expiresIn, price }

        const updatedPackage = await PackageModel
        .findByIdAndUpdate(
            packageId,
            newPackage,
            { new: true }
        )

        return response.status(200).json({
            message: 'club package is updated successfully',
            package: updatedPackage
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const deletePackage = async (request, response) => {

    try {

        const { packageId } = request.params

        const registrationList = await RegistrationModel
        .find({ packageId })

        if(registrationList.length != 0) {
            return response.status(400).json({
                message: 'this package is registered in some members registrations',
                field: 'packageId'
            })
        }

        const deletedPackage = await PackageModel
        .findByIdAndDelete(packageId)

        return response.status(200).json({
            message: 'package is deleted successfully',
            package: deletedPackage
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const updatePackageStatus = async (request, response) => {

    try {

        const { packageId } = request.params
        const { isOpen } = request.body


        if(typeof isOpen != 'boolean') {
            return response.status(400).json({
                message: 'package status must be boolean',
                field: 'isOpen'
            })
        }

        const updatedPackage = await PackageModel
        .findByIdAndUpdate(
            packageId,
            { isOpen },
            { new: true }
        )

        return response.status(200).json({
            message: 'package status is updated successfully',
            package: updatedPackage
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const deletedPackageAndRelated = async (request, response) => {

    try {

        const { packageId } = request.params

        const deletedRegistrations = await RegistrationModel
        .deleteMany({ packageId })

        const deletedPackage = await PackageModel
        .findByIdAndDelete(packageId)

        return response.status(200).json({
            message: 'package deleted successfully and all related data',
            package: deletedPackage,
            deletedRegistrations: deletedRegistrations.deletedCount
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { 
    addPackage, 
    getPackages, 
    updatePackage, 
    deletePackage,
    updatePackageStatus,
    deletedPackageAndRelated
}