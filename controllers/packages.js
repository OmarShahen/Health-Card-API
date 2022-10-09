const packageValidation = require('../validations/packages')
const statsValidation = require('../validations/stats')
const PackageModel = require('../models/PackageModel')
const ClubModel = require('../models/ClubModel')
const RegistrationModel = require('../models/RegistrationModel')
const ChainOwnerModel = require('../models/ChainOwnerModel')
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
        .sort({ createdAt: -1 })

        const packagesStatsPromise = RegistrationModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'packages',
                    localField: 'packageId',
                    foreignField: '_id',
                    as: 'package'
                }
            },
            {
                $group: {
                    _id: '$package.title',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ])


        const [packages, packagesStats] = await Promise.all([
            packagesPromise,
            packagesStatsPromise,
        ])

        const totalPackages = packages.length

        const openedPackages = packages.filter(package => package.isOpen)
        const closedPackages = packages.filter(package => !package.isOpen)

        const totalOpenedPackages = openedPackages.length
        const totalClosedPackages = closedPackages.length

        packagesStats.forEach(stat => stat._id = stat._id[0])

        return response.status(200).json({
            totalPackages,
            totalOpenedPackages,
            totalClosedPackages,
            packagesStats,
            packages,
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
        const { specific, until, to } = request.query

        const packageSearchQuery = utils.statsQueryGenerator('packageId', packageId, request.query)

        const growthUntilDate = utils.growthDatePicker(until, to, specific)
        const growthQuery = utils.statsQueryGenerator('packageId', packageId, { until: growthUntilDate })

        const clubPackage = await PackageModel.findById(packageId)

        const clubId = clubPackage.clubId.toString()

        const clubPackagesSearchQuery = utils.statsQueryGenerator('clubId', clubId, request.query)

        const packageRegistrationsPromise = RegistrationModel.aggregate([
            {
                $match: packageSearchQuery.searchQuery
            },
            {
                $lookup: {
                    from: 'members',
                    localField: 'memberId',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $lookup: {
                    from: 'staffs',
                    localField: 'staffId',
                    foreignField: '_id',
                    as: 'staff'
                }
            },
            {
                $lookup: {
                    from: 'packages',
                    localField: 'packageId',
                    foreignField: '_id',
                    as: 'package'
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    'member.canAuthenticate': 0,
                    'member.QRCodeURL': 0,
                    'member.updatedAt': 0,
                    'member.__v': 0,
                    'staff.password': 0,
                    'staff.updatedAt': 0,
                    'staff.__v': 0,
                    'package.updatedAt': 0,
                    'package.__v': 0
                }
        }])

        const packagesRegistrationsStatsPromise = RegistrationModel.aggregate([
            {
                $match: clubPackagesSearchQuery.searchQuery
            },
            {
                $group: {
                    _id: '$packageId',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'packages',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'package'
                }
            }
        ])

        const packageGenderStatsPromise = RegistrationModel.aggregate([
            {
                $match: packageSearchQuery.searchQuery
            },
            {
                $lookup: {
                    from: 'members',
                    localField: 'memberId',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $group: {
                    _id: '$member.gender',
                    count: { $sum: 1 }
                }
            }
        ])

        const packageAgeStatsPromise = RegistrationModel.aggregate([
            {
                $match: packageSearchQuery.searchQuery
            },
            {
                $lookup: {
                    from: 'members',
                    localField: 'memberId',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $group: {
                    _id: '$member.birthYear',
                    count: { $sum: 1 }
                }
            }
        ])

        const packageRegistrationsStatsGrowthPromise = RegistrationModel.aggregate([
            {
                $match: growthQuery.searchQuery
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            }
        ])

        let [
            packageRegistrations, 
            packagesRegistrationsStats, 
            packageGenderStats, 
            packageAgeStats,
            packageRegistrationsStatsGrowth
        ] = await Promise.all([
            packageRegistrationsPromise,
            packagesRegistrationsStatsPromise,
            packageGenderStatsPromise,
            packageAgeStatsPromise,
            packageRegistrationsStatsGrowthPromise
        ])

        packageGenderStats.forEach(stat => stat._id = stat._id[0])

        packageAgeStats.forEach(stat => {
            stat._id = stat._id[0]
            stat._id = new Date().getFullYear() - new Date(stat._id).getFullYear()
        })

        packageRegistrationsStatsGrowth
        .sort((month1, month2) => new Date(month1._id) - new Date(month2._id))

        packagesRegistrationsStats.forEach(stat => stat.package = stat.package[0])

        packageRegistrations.forEach(registration => {
            if(registration.expiresAt <= packageSearchQuery.toDate) {
                registration.isActive = false
            }
        })

        const totalPackageRegistrations = packageRegistrations.length

        packageRegistrations.forEach(registration => {
            registration.staff = registration.staff[0]
            registration.member = registration.member[0]
            registration.package = registration.package[0]
        })

        const activePackageRegistrations = packageRegistrations
        .filter(registration => registration.expiresAt > packageSearchQuery.toDate || registration.isActive == true)
        const totalActiveRegistrations = activePackageRegistrations.length

        const expiredPackageRegistrations = packageRegistrations
        .filter(registration => registration.expiresAt <= packageSearchQuery.toDate || registration.isActive == false)
        const totalExpiredRegistrations = expiredPackageRegistrations.length


        const packageStats = utils.calculatePackagePercentage(packageId, packagesRegistrationsStats)

        const packageCompletion = utils.calculateCompletedPackageAttendances(expiredPackageRegistrations)

        packageStats.packagePercentage = String(packageStats.packagePercentage) != 'NaN' 
        ? Math.round(Number.parseFloat(packageStats.packagePercentage)) : 0
        
        packageStats.otherPackagesPercentage = String(packageStats.otherPackagesPercentage) != 'NaN'
        ? Math.round(Number.parseFloat(packageStats.otherPackagesPercentage)) : 0

        let completedPackageAttendance = ((packageCompletion.completedAttendance / packageCompletion.total) * 100).toFixed(2)
        let incompletedPackageAttendance = ((packageCompletion.incompletedAttendance/ packageCompletion.total) * 100).toFixed(2)


        const packageCompletionStat = {
            completedPackageAttendancePercentage: String(completedPackageAttendance) != 'NaN' ? Math.round(Number.parseFloat(completedPackageAttendance)) : 0,
            completedPackageAttendance: packageCompletion.completedAttendance,
            incompletedPackageAttendancePercentage: String(incompletedPackageAttendance) != 'NaN' ? Math.round(Number.parseFloat(incompletedPackageAttendance)) : 0,
            incompletedPackageAttendance: packageCompletion.incompletedAttendance,
            total: packageCompletion.total
        }

        const members = packageRegistrations.map(registration => registration.member)
        const packageGenderPercentageStat = utils.calculateGenderPercentages(members)



        return response.status(200).json({
            packageGenderPercentageStat,
            packageRegistrationsStatsGrowth,
            packageAgeStats,
            packageGenderStats,
            package: clubPackage,
            packageStats,
            packageCompletionStat,
            totalPackageRegistrations,
            totalActiveRegistrations,
            totalExpiredRegistrations,
            packageRegistrations,
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getPackagesByOwner = async (request, response) => {

    try {

        const { ownerId } = request.params

        const owner = await ChainOwnerModel.findById(ownerId)

        const clubs = owner.clubs

        const packages = await PackageModel.aggregate([
            {
                $match: {
                    clubId: { $in: clubs },
                }
            },
            {
                $lookup: {
                    from: 'clubs',
                    localField: 'clubId',
                    foreignField: '_id',
                    as: 'club'
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    password: 0,
                    updatedAt: 0,
                    __v: 0,
                    'club.updatedAt': 0,
                    'club.__v': 0
                }
            }
        ])

        packages.forEach(package => package.club = package.club[0])

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

const getChainOwnerPackagesStatsByDate = async (request, response) => {

    try {

        const dataValidation = statsValidation.statsDates(request.query)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { ownerId } = request.params

        const owner = await ChainOwnerModel.findById(ownerId)

        const clubs = owner.clubs

        const { searchQuery } = utils.statsQueryGenerator('clubId', clubs, request.query)

        const packagesPromise = PackageModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'clubs',
                    localField: 'clubId',
                    foreignField: '_id',
                    as: 'club'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        const packagesStatsPromise = RegistrationModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'packages',
                    localField: 'packageId',
                    foreignField: '_id',
                    as: 'package'
                }
            },
            {
                $group: {
                    _id: '$package.title',
                    count: { $sum: 1 }
                }
            }
        ])


        const [packages, packagesStats] = await Promise.all([
            packagesPromise,
            packagesStatsPromise,
        ])

        const totalPackages = packages.length

        const openedPackages = packages.filter(package => package.isOpen)
        const closedPackages = packages.filter(package => !package.isOpen)

        const totalOpenedPackages = openedPackages.length
        const totalClosedPackages = closedPackages.length

        packagesStats.forEach(stat => stat._id = stat._id[0])

        packages.forEach(packageObj => packageObj.club = packageObj.club[0])

        return response.status(200).json({
            totalPackages,
            totalOpenedPackages,
            totalClosedPackages,
            packagesStats,
            packages,
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
    getClubPackageStatsByDate,
    getPackagesByOwner,
    getChainOwnerPackagesStatsByDate
}