const { Router } = require("express");
const controller = require("../controllers/category.controller");

const router = Router();

// Retrieve all Categories
router.get("/:categoryLevel", controller.get);
// // Retrieve a single Category with id
// router.get("/:id", controller.getById);
// // Delete a Category with id
// router.delete("/:id", controller.delete);

module.exports = router;
