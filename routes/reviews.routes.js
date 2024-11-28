const { Router } = require('express')
const controller = require('../controllers/reviews.controller')

const router = Router()

router.post('/', controller.post)
router.put('/', controller.update)
// Retrieve a single wishlist with id
//router.get('/:id', controller.getById)
router.get('/', controller.getAll)
router.get('/:id', controller.getById)

module.exports = router
