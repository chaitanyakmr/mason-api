const { Router } = require("express");
const controller = require("../controllers/factory.controller");

const router = Router(); 

// router.post("/", controller.post);
 // Retrieve all factories
router.get("/", controller.get); 
// Retrieve a single Factory with id
router.get("/:id", controller.getById);
// // Update a Factory with id
// router.put("/:id", controller.put);
// // Delete a Factory with id
// router.delete("/:id", controller.delete); 

module.exports = router;
 
  