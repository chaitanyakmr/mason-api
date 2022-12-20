const { Router } = require('express')
const controller = require('../controllers/product.controller')

const router = Router()

// Retrieve all products
router.get('/', controller.get)

module.exports = router
