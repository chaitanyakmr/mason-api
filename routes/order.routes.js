const { Router } = require('express')
const controller = require('../controllers/order.controller')

const router = Router()

router.post('/', controller.post)
// Retrieve all orders
//  router.get("/", controller.get);
// // Retrieve a single Order with id
router.get('/:id', controller.getById)
// // Update a Order with id
// router.put("/:id", controller.put);
// // Delete a Order with id
// router.delete("/:id", controller.delete);
//Get All orders of userid
router.get('/user/:id', controller.getAll)
module.exports = router
