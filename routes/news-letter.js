const router = require('express').Router()
const newsLetterController = require('../controllers/news-letter')

router.post('/news-letter', (request, response) => newsLetterController.addEmailToNewsLetter(request, response))

module.exports = router