const express = require("express");
const router = express.Router();

const { signup, login, getMe, updateProfile, forgotPassword, resetPassword } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", require("../middlewares/auth"), getMe);
router.put("/me", require("../middlewares/auth"), updateProfile);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;
