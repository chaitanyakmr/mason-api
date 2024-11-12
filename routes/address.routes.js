const { Router } = require('express')
const controller = require('../controllers/address.controller')

const router = Router()

router.post('/', controller.post)
router.put('/', controller.put)
// Retrieve all products
router.get('/:id', controller.get)
// // Retrieve a single Product with id
router.get('/:id', controller.getById)
// // Update a Product with id
// router.put('/:id', controller.put)
// // Delete a Product with id
router.delete('/:id', controller.delete)

module.exports = router
