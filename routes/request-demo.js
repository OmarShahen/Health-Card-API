const router = require('express').Router()
const requestDemoController = require('../controllers/request-demo')

router.post('/request-demo', (request, response) => requestDemoController.addRequestDemo(request, response))

router.get('/request-demo', (request, response) => requestDemoController.getRequestDemo(request, response))

module.exports = router