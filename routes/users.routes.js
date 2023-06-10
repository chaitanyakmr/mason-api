const { Router } = require("express");
const controller = require("../controllers/users.controller");

const router = Router();

router.post("/", controller.post);
// Retrieve all orders
 router.get("/", controller.get);
// // Retrieve a single Order with id
 router.get("/:id", controller.getById);
// Update a Order with id
router.put("/:id", controller.put);
// Delete a Order with id
router.delete("/:id", controller.delete);

module.exports = router;
