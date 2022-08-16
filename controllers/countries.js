const utils = require('../utils/utils')
const CountryModel = require('../models/countryModel')
const addCountry = async (request, response) => {

    try {

        let { name, code } = request.body

        if(!name) {
            return response.status(400).json({
                message: 'country name is required',
                field: 'name'
            })
        }

        if(!utils.isNameValid(name)) {
            return response.status(400).json({
                message: 'invalid country name formate',
                field: 'name'
            })
        }

        if(!code) {
            return response.status(400).json({
                message: 'country code is required',
                field: 'code'
            })
        }

        if(!Number.isInteger(code)) {
            return response.status(400).json({
                message: 'country code must be a number',
                field: 'code'
            })
        }

        name = name.toUpperCase()

        const countriesList = await CountryModel.find({ name })

        if(countriesList.length != 0) {
            return response.status(400).json({
                message: 'country name is already registered',
                field: 'name'
            })
        }

        const codesList = await CountryModel.find({ code })

        if(codesList.length != 0) {
            return response.status(400).json({
                message: 'country code is already registered',
                field: 'code'
            })
        }

        const countryObj = new CountryModel({ name, code })
        const newCountry = await countryObj.save() 

        return response.status(200).json({
            message: `${name} +${code} is added successfully`,
            country: newCountry
        })


    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const addCity = async (request, response) => {

    try {

        let { country } = request.params
        let { name } = request.body

        if(!name) {
            return response.status(400).json({
                message: 'city name is required',
                field: 'name'
            })
        }

        if(!utils.isNameValid(name)) {
            return response.status(400).json({
                message: 'invalid city name formate',
                field: 'name'
            })
        }

        country = country.toUpperCase()
        name = name.toUpperCase()

        const countriesList = await CountryModel.find({ name: country })

        if(countriesList.length == 0) {
            return response.status(400).json({
                message: 'country is not registered',
                field: 'country'
            })
        }

        const cities = countriesList[0].cities

        if(cities.includes(name)) {
            return response.status(400).json({
                message: 'city is already registered',
                field: 'name'
            })
        }

        const newCity = await CountryModel
        .findOneAndUpdate(
            { name: country },
            { $push: { cities: name } },
            { new: true }
        )

        return response.status(200).json({
            message: `${name} is added successfully to ${country}`,
            country: newCity
        })


    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { addCountry, addCity }