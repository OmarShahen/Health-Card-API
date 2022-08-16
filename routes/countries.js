const router = require('express').Router()
const tokenMiddleware = require('../middlewares/verify-permission')
const countriesController = require('../controllers/countries')

router.post('/countries', (request, response) => countriesController.addCountry(request, response))

router.post('/countries/:country/cities', (request, response) => countriesController.addCity(request, response))

module.exports = router