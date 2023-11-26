const { Router } = require("express");
const controller = require("../controllers/login.controller");

const router = Router();

router.post("/", controller.post); 

module.exports = router;
