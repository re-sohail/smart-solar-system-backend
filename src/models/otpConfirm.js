const mongoose = require("mongoose");
const validator = require("validator");

const otpConfirmSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      minLength: [6, "Email Address must be at least 6 characters"],
      maxLength: [255, "Email Address must be at most 255 characters"],
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address");
        }
      },
    },
    otp: {
      type: String,
      required: true,
      trim: true,
      minLength: [4, "OTP must be at least 4 characters"],
      maxLength: [6, "OTP must be at most 6 characters"],
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 2 * 60000),
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

const OTPConfirm = mongoose.model("OTPConfirm", otpConfirmSchema);
module.exports = OTPConfirm;
