const config = require('../config/config')
const ClubModel = require('../models/ClubModel')
const CountryModel = require('../models/countryModel')
const clubValidation = require('../validations/clubs')

const addClub = async (request, response) => {

    try {

        const dataValidation = clubValidation.clubData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field:  dataValidation.field
            })
        }

        const { phone, phoneCountryCode } = request.body

        const phoneList = await ClubModel.find({ phone, phoneCountryCode })

        if(phoneList.length != 0) {
            return response.status(400).json({
                message: 'phone is already registered',
                field: 'phone'
            })
        }

        let { country, city } = request.body.location

        country = country.toUpperCase()
        city = city.toUpperCase()

        const countriesList = await CountryModel.find({ name: country })

        if(countriesList.length == 0) {
            return response.status(400).json({
                message: 'country is not registered',
                field: 'location.country'
            })
        }

        const cities = countriesList[0].cities

        if(!cities.includes(city)) {
            return response.status(400).json({
                message: 'city is not registered',
                field: 'location.city'
            })
        }

        const club = request.body

        const clubObj = new ClubModel(club)
        const newClub = await clubObj.save()


        return response.status(200).json({
            message: `${club.name} is added to our gyms network successfully`,
            club: newClub
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getClubs = async (request, response) => {

    try {

        const clubs = await ClubModel
        .find()
        .select({ _id: 1, name: 1 })

        return response.status(200).json({
            clubs
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}


module.exports = { addClub, getClubs }