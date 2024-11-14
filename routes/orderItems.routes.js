const { Router } = require('express')
const controller = require('../controllers/orderItems.controller')

const router = Router()

router.get('/:id', controller.getById)

router.get('/', controller.getAll)

module.exports = router
