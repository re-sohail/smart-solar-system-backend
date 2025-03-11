const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true,
      index: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
          index: true,
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
          max: [100, "Quantity must be at most 100"],
          default: 1,
          set: (value) => Math.floor(value),
        },

        price: {
          type: Number,
          required: [true, "Price is required"],
          min: [0, "Price cannot be negative"],
          default: 0,
          set: (value) => Math.round(value * 100),
          get: (value) => (value / 100).toFixed(2),
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
    collation: { locale: "en", strength: 2 }, // Case-insensitive sorting and searching
  }
);

// Compound Indexes
cartSchema.index({ user: 1 });

// Virtuals
cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});
cartSchema.virtual("subTotal").get(function () {
  return this.items.reduce(
    (total, item) => total(item.price * item.quantity),
    0
  );
});

// Query Helpers
cartSchema.query.byProduct = function (product) {
  return this.where({ "items.product": product });
};
cartSchema.query.byUser = function (user) {
  return this.where({ user });
};

// Instance Methods
cartSchema.methods.addItem = function (productId, quantity, price) {
  const existingItem = this.items.find((item) =>
    item.product.equals(productId)
  );
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({ product: productId, quantity, price });
  }
  return this.save();
};

cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter((item) => !item.product.equals(productId));
  return this.save();
};

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
