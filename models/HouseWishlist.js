const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HouseWishlistSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: true
    },
    houses: [
      {
        type: Schema.Types.ObjectId,
        ref: "houses"
      }
    ],
    date: {
      type: Date,
      default: Date.now
    }
  },
  { strict: false }
);

// Ensure one wishlist per customer
HouseWishlistSchema.index({ customerId: 1 }, { unique: true });

module.exports = HouseWishlist = mongoose.model(
  "houseWishlist",
  HouseWishlistSchema,
  "houseWishlist"
);