const express = require("express");
const router = express.Router();
const {
	registerUser,
	authUser,
	allusers,
	resetPassword,
	redirectUrl,
	setNewPassword,
} = require("../controllers/user.controller");
const { protect } = require("../middlewares/authMiddleware");

router.route("/").post(registerUser).get(protect, allusers);
router.route("/login").post(authUser);
router.route("/resetpassword").post(resetPassword);
router.route("/resetpassword/:tokenid").get(redirectUrl);
router.route("/login/setnewpassword").patch(setNewPassword);

module.exports = router;
