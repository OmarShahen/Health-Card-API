const SportModel = require('../models/sportModel')
const util = require('../utils/utils')

const addSport = async (request, response) => {

    try {

        const { sport } = request.body

        if(!sport || !util.isNameValid(sport)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid sport name formate',
                field: 'sport'
            })
        }

        const sportList = await SportModel.find({ sport })

        if(sportList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Sport is already registered',
                field: 'sport'
            })
        }

        const sportObj = new SportModel({ sport })
        const newSport = await sportObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Added sport successfully',
            sport: newSport
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

const getSports = async (request, response) => {

    try {

        const sports = await SportModel.find()

        return response.status(200).json({
            accepted: true,
            sports
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

const deleteSport = async (request, response) => {

    try {

        const { sport } = request.params

        const deletedSport = await SportModel.deleteOne({ sport })

        const responseMessage = deletedSport.deletedCount ? 'Deleted Successfully' : 'No record found'

        return response.status(200).json({
            accepted: true,
            message: responseMessage,
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

module.exports = { addSport, getSports, deleteSport }