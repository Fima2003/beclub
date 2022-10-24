const express = require("express");
const router = express.Router();
const apiControllers = require("./api.controllers");
const userRouter = require("../users/users");
const clubRouter = require("../clubs/clubs");
const adminRouter = require("../admin/admin");
const subscriptionsRouter = require("../subscriptions/subscriptions");
const userMiddleware = require("../middleware/user.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
/* GET users listing. */
router.get("/", apiControllers.index);
router.get(
  "/docs",
  userMiddleware.isAuthenticated,
  adminMiddleware.adminsOnly,
  apiControllers.docs
);
router.use("/users", userRouter);
router.use("/clubs", clubRouter);
router.use("/subscriptions", subscriptionsRouter);
router.use("/admin", adminRouter);

module.exports = router;
