const { Router } = require('express')
const controller = require('../controllers/reviews.controller')

const router = Router()

router.post('/', controller.post)
// Retrieve a single wishlist with id
//router.get('/:id', controller.getById)
router.get('/', controller.getAll)
module.exports = router
