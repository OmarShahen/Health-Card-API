const router = require('express').Router()
const clinicsController = require('../controllers/clinics')
const tokenMiddleware = require('../middlewares/verify-permission')

router.post('/v1/clinics', (request, response) => clinicsController.addClinic(request, response))

router.get('/v1/clinics', (request, response) => clinicsController.getClinics(request, response))


module.exports = router