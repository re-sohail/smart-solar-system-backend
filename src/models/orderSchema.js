const mongoose = require("mongoose");
const validator = require("validator");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
      validate: {
        validator: async function (value) {
          return await mongoose.model("User").exists({ _id: value });
        },
        message: "Invalid user reference",
      },
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product reference is required"],
          validate: {
            validator: async function (value) {
              return await mongoose.model("Product").exists({ _id: value });
            },
            message: "Invalid product reference",
          },
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
          max: [100, "Quantity must not be more than 10"],
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
          min: [1, "Price must be at least 1"],
          set: (v) => Math.round(v * 100),
          get: (v) => (v / 100).toFixed(2),
        },
        deliveryOption: {
          type: String,
          enum: ["free", "standard", "express"],
          required: [true, "Delivery option is required"],
        },
      },
    ],
    shippingAddress: {
      address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
        maxLength: [255, "Address must be at most 255 characters"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
        maxLength: [50, "City must be at most 50 characters"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
        maxLength: [50, "Country must be at most 50 characters"],
      },
      postalCode: {
        type: String,
        required: [true, "Postal Code is required"],
        trim: true,
        maxLength: [10, "Postal Code must be at most 10 characters"],
        validate: (value) => {
          if (!validator.isPostalCode(value, "any")) {
            throw new Error("Invalid Postal Code");
          }
        },
      },
    },
    statusHistory: [
      {
        status: {
          type: String,
          required: [true, "Status is required"],
          enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        },
        changedAt: {
          type: Date,
          required: [true, "Changed At is required"],
          default: Date.now,
        },
        note: {
          type: String,
          trim: true,
          maxLength: [255, "Note must be at most 255 characters"],
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.updatedAt;
        return ret;
      },
    },
    collation: { locale: "en", strength: 2 },
  }
);

// Indexes
orderSchema.index({ "items.product": 1 });

// Virtuals
orderSchema.virtual("totalPrice").get(function () {
  let totalCents = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return (totalCents / 100).toFixed(2);
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
