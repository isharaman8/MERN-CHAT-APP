const express = require("express");
const router = express.Router();
const {
	registerUser,
	authUser,
	allusers,
} = require("../controllers/user.controller");
const { protect } = require("../middlewares/authMiddleware");

router.route("/").post(registerUser).get(protect, allusers);
router.route("/login").post(authUser);

module.exports = router;
