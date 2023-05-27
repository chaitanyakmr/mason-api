const { Router } = require('express')
const controller = require('../controllers/product.controller')

const router = Router()

// Retrieve all products
router.get('/', controller.get)

// Retrieve all products where id is category level 2
router.get('/:id', controller.getById)

module.exports = router
