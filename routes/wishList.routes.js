const { Router } = require('express')
const controller = require('../controllers/wishList.controller')

const router = Router()

router.post('/', controller.post)
// Retrieve a single wishlist with id
router.get('/:id', controller.getById)
// Delete a wishlist with id
router.delete('/', controller.delete)

module.exports = router
