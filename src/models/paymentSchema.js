const mongoose = require("mongoose");
const { translateAliases } = require("./orderSchema");

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order is required"],
      index: true,
      validate: {
        validator: async function (value) {
          return await mongoose.model("Order").exists({ _id: value });
        },
        message: "Invalid order reference",
      },
    },
    method: {
      type: String,
      enum: ["cash", "card"],
      required: [true, "Payment method is required"],
    },
    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
      trim: true,
      maxLength: [255, "Transaction ID must be at most 255 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be at least 1"],
      set: (v) => Math.round(v * 100),
      get: (v) => (v / 100).toFixed(2),
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["pending", "completed", "failed", "refunded"],
          required: [true, "Status is required"],
        },
        changeAt: {
          type: Date,
          default: Date.now,
        },
        notes: {
          type: String,
          trim: true,
          maxLength: [255, "Notes must be at most 255 characters"],
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
