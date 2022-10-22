var express = require("express");
var router = express.Router();
const userMiddleware = require("../middleware/user.middleware");
const indexControllers = require("./indexControllers");

router.get("/", indexControllers.index);

module.exports = router;
