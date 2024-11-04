const { Router } = require('express')
const controller = require('../controllers/orderItems.controller')

const router = Router()

router.get('/:id', controller.getById)

module.exports = router
