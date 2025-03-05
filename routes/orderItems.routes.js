const { Router } = require('express')
const controller = require('../controllers/orderItems.controller')

const router = Router()
//orders with product data list of an user
router.get('/:id', controller.getById)
//get all orders of all users(people also Ordered)
router.get('/user/:id', controller.getAll)

module.exports = router
