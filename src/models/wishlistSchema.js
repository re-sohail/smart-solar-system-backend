const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true,
      index: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
          index: true,
        },
        addedAt: {
          type: Date,
          required: [true, "Added At is required"],
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
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
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ "items.product": 1 });
wishlistSchema.index({ "items.addedAt": -1 });

// Virtuals
wishlistSchema.virtual("totalProducts").get(function () {
  return this.products.length;
});

// Static Methods / Query Helpers
wishlistSchema.statics.findByUser = function (userId) {
  return this.findOne({ user: userId });
};

// Instance Methods
wishlistSchema.methods.addProduct = async function (productId) {
  if (this.items.some((item) => item.product.equals(productId))) {
    throw new Error("Product already in wishlist");
  }

  this.items.push({ product: productId });
  this.lastUpdated = Date.now();
  return this.save();
};

wishlistSchema.methods.removeProduct = function (productId) {
  const initialLength = this.items.length;
  this.items = this.items.filter((item) => !item.product.equals(productId));

  if (this.items.length !== initialLength) {
    this.lastUpdated = Date.now();
  }
  return this.save();
};

// Static Methods
wishlistSchema.statics.findByUserId = function (userId) {
  return this.findOne({ user: userId }).populate({
    path: "items.product",
    select: "name price images",
  });
};

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
