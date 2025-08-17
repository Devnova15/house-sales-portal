const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    userNo: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    login: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    telephone: {
      type: String
    },
    birthdate: {
      type: String
    },
    gender: {
      type: String
    },
    avatarUrl: {
      type: String
    },
    enabled: {
      type: Boolean,
      required: true,
      default: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { strict: false }
);

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = User = mongoose.model("users", UserSchema);