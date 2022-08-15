const packageValidation = require('../validations/packages')
const PackageModel = require('../models/PackageModel')
const ClubModel = require('../models/ClubModel')


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

        const packagesList = await PackageModel
        .find({ clubId })

        return response.status(200).json({
            packages: packagesList
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { addPackage, getPackages }