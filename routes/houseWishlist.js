const express = require("express");
const router = express.Router();
const passport = require("passport");

//Import controllers
const {
  getHouseWishlist,
  addHouseToWishlist,
  removeHouseFromWishlist,
  clearHouseWishlist,
  isHouseInWishlist
} = require("../controllers/houseWishlist");

// @route   GET /house-wishlist
// @desc    Get house wishlist for customer
// @access  Private
router.get("/", passport.authenticate("jwt", { session: false }), getHouseWishlist);

// @route   POST /house-wishlist/:houseId
// @desc    Add house to wishlist
// @access  Private
router.post(
  "/:houseId",
  passport.authenticate("jwt", { session: false }),
  addHouseToWishlist
);

// @route   DELETE /house-wishlist/:houseId
// @desc    Remove house from wishlist
// @access  Private
router.delete(
  "/:houseId",
  passport.authenticate("jwt", { session: false }),
  removeHouseFromWishlist
);

// @route   DELETE /house-wishlist
// @desc    Clear entire house wishlist
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  clearHouseWishlist
);

// @route   GET /house-wishlist/check/:houseId
// @desc    Check if house is in wishlist
// @access  Private
router.get(
  "/check/:houseId",
  passport.authenticate("jwt", { session: false }),
  isHouseInWishlist
);

module.exports = router;