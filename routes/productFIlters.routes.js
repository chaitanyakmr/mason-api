const { Router } = require('express')
const controller = require('../controllers/productFilters.controller')

const router = Router()

// Retrieve all product filters
router.get('/', controller.get)

module.exports = router
