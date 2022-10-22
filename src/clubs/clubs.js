const express = require("express");
const router = express.Router();
const clubControllers = require("./clubs.controllers");
const clubMiddleware = require("../middleware/club.middleware");
const userMiddleware = require("../middleware/user.middleware");
const verifyControllers = require("./verify_clubs.controller");
const adminMiddleware = require("../middleware/admin.middleware");
const apiExtr = require("../../utils/decorators");

router.post("/sign_in", clubControllers.sign_in);

router.get(
  "/get_clubs",
  userMiddleware.isAuthenticated,
  clubControllers.get_clubs_from_search
);

router.post("/create_verification", verifyControllers.create);
router.post(
  "/verify",
  userMiddleware.isAuthenticated,
  adminMiddleware.adminsOnly,
  verifyControllers.verify
);
router.post(
  "/reject",
  userMiddleware.isAuthenticated,
  adminMiddleware.adminsOnly,
  verifyControllers.reject
);
router.get(
  "/get_all_unverified_clubs",
  userMiddleware.isAuthenticated,
  adminMiddleware.adminsOnly,
  verifyControllers.getAllClubsForVerification
);

router.get("/:nick", clubMiddleware.authenticate, clubControllers.get_club);
router.put(
  "/:nick",
  clubMiddleware.isAuthenticated,
  clubMiddleware.clubOnly,
  clubControllers.update_club
);
router.delete(
  "/:nick",
  clubMiddleware.isAuthenticated,
  clubMiddleware.clubOnly,
  clubControllers.delete_club
);

router.get(
  "/find/:amount",
  userMiddleware.isAuthenticated,
  adminMiddleware.adminsOnly,
  clubControllers.get_clubs
);

module.exports = router;
