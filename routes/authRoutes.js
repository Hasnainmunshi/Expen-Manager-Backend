const express = require("express");
const {
  registerUser,
  loginUser,
  getUserInfo,
  verifyOTP,
  updateUserInfo,
  getSettings,
  updateSettings,
  getAllUsers,
  getUserDashboard,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const role = require("../middleware/roleMeddileware");

const router = express.Router();

router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login", loginUser);
// router.post("/verify-otp", verifyOTP);
router.get("/getUser", protect, getUserInfo);
router.get("/getUserDashboard", protect, getUserDashboard);
router.put(
  "/updateUser/:id",
  protect,
  upload.single("profileImageUrl"),
  updateUserInfo
);
router.get("/settings", protect, getSettings);
router.put(
  "/update-settings",
  protect,
  upload.single("profileImageUrl"),
  updateSettings
);
router.get("/getAllUsers-admin", protect, role(["admin"]), getAllUsers);

module.exports = router;
