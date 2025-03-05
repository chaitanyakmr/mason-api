const { Router } = require('express')
const controller = require('../controllers/services/servicesCategory.controller')

const router = Router()

router.get('/', controller.get)
router.get('/:category_id', controller.getById)

module.exports = router
