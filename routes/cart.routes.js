const { Router } = require('express')
const controller = require('../controllers/cart.controller')

const router = Router()

router.post('/', controller.post)
router.put('/', controller.post)
// Retrieve a single cart with id
router.get('/:id', controller.getById)
// Delete a cart with id
router.delete('/', controller.delete)
router.delete('/:id', controller.deleteall)
module.exports = router
