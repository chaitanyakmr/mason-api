const { Router } = require('express')
const controller = require('../controllers/payment.controller')

const router = Router()

router.post('/validate', controller.postres)

router.post('/', controller.postByPaymentId)

module.exports = router
