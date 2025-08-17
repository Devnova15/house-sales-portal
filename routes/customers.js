const express = require("express");
const router = express.Router();
const passport = require("passport");
const rateLimit = require("express-rate-limit");

// Configure stricter rate limiter for admin login attempts
// const adminLoginLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 3, // limit each IP to 3 login attempts per hour
//   message: {
//     message: "Too many admin login attempts from this IP, please try again after an hour"
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 10, // максимум 10 попыток с одного IP за 15 минут
  message: {
    message: "Too many admin login attempts from this IP, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//Import controllers
const {
  loginAdmin,
  getCustomer,
  registerCustomer,
  loginCustomer
} = require("../controllers/customers");

// @route   POST /customers/admin/login
// @desc    Login Admin / Returning JWT Token with admin privileges
// @access  Public
router.post("/admin/login", adminLoginLimiter, loginAdmin);

// @route   POST /customers/register
// @desc    Register new customer
// @access  Public
router.post("/register", registerCustomer);

// @route   POST /customers/login
// @desc    Login customer / Returning JWT Token
// @access  Public
router.post("/login", loginCustomer);

// @route   GET /
// @desc    Return current customer
// @access  Private
router.get(
  "/customer",
  passport.authenticate("jwt", { session: false }),
  getCustomer
);

module.exports = router;
