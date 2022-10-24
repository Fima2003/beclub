const express = require("express");
const router = express.Router();
const adminController = require("./admin.controller");
router.get("/get_api", adminController.getApi);

module.exports = router;
