const { Router } = require('express')
const controller = require('../controllers/productFilters.controller')

const router = Router()

// Retrieve all product filters
router.get('/', controller.get)
// Retrieve a single Order with id
router.get("/:id", controller.getById);

module.exports = router
