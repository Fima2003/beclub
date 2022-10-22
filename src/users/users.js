const express = require("express");
const router = express.Router();
const userControllers = require("./users.controllers");
const userMiddleware = require("../middleware/user.middleware");
const { adminsOnly } = require("../middleware/admin.middleware");

router.post("/sign_in", userControllers.sign_in);
router.get(
  "/find/:amount",
  userMiddleware.isAuthenticated,
  adminsOnly,
  userControllers.get_users
);
router.get("/self", userMiddleware.isAuthenticated, userControllers.get_user);
router.post("/create-user", userControllers.create_user);
router.put(
  "/:nick",
  userMiddleware.isAuthenticated,
  userMiddleware.userOnly,
  userControllers.update_user
);
router.delete(
  "/:nick",
  userMiddleware.isAuthenticated,
  userMiddleware.userOnly,
  userControllers.delete_user
);

module.exports = router;
