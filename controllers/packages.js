const packageValidation = require('../validations/packages')
const statsValidation = require('../validations/stats')
const PackageModel = require('../models/PackageModel')
const ClubModel = require('../models/ClubModel')
const RegistrationModel = require('../models/RegistrationModel')
const utils = require('../utils/utils')


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

const getClubPackagesStatsByDate = async (request, response) => {

    try {

        const dataValidation = statsValidation.statsDates(request.query)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId } = request.params
        const { searchQuery } = utils.statsQueryGenerator('clubId', clubId, request.query)

        const packagesPromise = PackageModel
        .find(searchQuery)
        .select({ updatedAt: 0, __v: 0 })

        const packagesRegistrationsPromise = RegistrationModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$packageId',
                    count: { $sum: 1 }
                }
            }
        ])

        let [packages, packagesRegistrations] = await Promise.all([
            packagesPromise,
            packagesRegistrationsPromise
        ])

        packagesRegistrations = utils.joinPackages(packages, packagesRegistrations)

        const numberOfPackages = packages.length

        const closedPackages = packages.filter(package => package.isOpen == false)
        const numberOfClosedPackages = closedPackages.length

        const openedPackages = packages.filter(package => package.isOpen == true)
        const numberOfOpenedPackages = openedPackages.length

        return response.status(200).json({
            packagesRegistrations,
            numberOfPackages,
            numberOfClosedPackages,
            numberOfOpenedPackages,
            packages,
            closedPackages,
            openedPackages
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getClubPackageStatsByDate = async (request, response) => {

    try {

        const dataValidation = statsValidation.statsDates(request.query)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { packageId } = request.params
        const { searchQuery, toDate } = utils.statsQueryGenerator('packageId', packageId, request.query)

        const packageRegistrations = await RegistrationModel
        .find(searchQuery)

        const numberOfPackageRegistrations = packageRegistrations.length

        const activePackageRegistrations = packageRegistrations.filter(registration => registration.isActive == true)
        const numberOfActiveRegistrations = activePackageRegistrations.length

        const expiredPackageRegistrations = packageRegistrations
        .filter(registration => registration.expiresAt <= toDate || registration.isActive == false)
        const numberOfExpiredRegistrations = expiredPackageRegistrations.length

        return response.status(200).json({
            numberOfPackageRegistrations,
            numberOfActiveRegistrations,
            numberOfExpiredRegistrations,
            packageRegistrations,
            activePackageRegistrations,
            expiredPackageRegistrations
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
    deletedPackageAndRelated,
    getClubPackagesStatsByDate,
    getClubPackageStatsByDate
}