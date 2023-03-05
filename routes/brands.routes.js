const { Router } = require("express");
const controller = require("../controllers/brands.controller");

const router = Router();

// router.post("/", controller.post);
// Retrieve all products
router.get("/", controller.get);
// Retrieve a single Product with id
router.get("/:id", controller.getById);
// // Update a Product with id
// router.put("/:id", controller.put);
// // Delete a Product with id
// router.delete("/:id", controller.delete);

module.exports = router;
