const express = require("express");
const router = express.Router();
const passport = require('passport');
const { registerUser, loginUser, getUserProfile } = require("../controllers/users");

// @route   POST /users/register
// @desc    Register new user
// @access  Public
router.post("/register", registerUser);

// @route   POST /users/login
// @desc    Login user / Returning JWT Token
// @access  Public
router.post("/login", loginUser);

// @route   GET /users/profile
// @desc    Get user profile
// @access  Private
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  getUserProfile
);

module.exports = router;
