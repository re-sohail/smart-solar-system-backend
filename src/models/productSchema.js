const mongoose = require("mongoose");
// prevent XSS attacks
const { purify } = require("isomorphic-dompurify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      unique: true,
      maxLength: [100, "Product name must be at most 100 characters"],
      set: (value) => purify.sanitize(value).trim(),
      index: "text",
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxLength: [1000, "Product description must be at most 1000 characters"],
      set: (value) => purify.sanitize(value).trim(),
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [1, "Price must be at least 1"],
      //   these will give value in String
      //   set: (value) => parseFloat(value).toFixed(2),
      //   get: (value) => parseFloat(value).toFixed(2),

      set: (v) => Math.round(v * 100), // Store as cents
      get: (v) => (v / 100).toFixed(2), // Display as dollars
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },
    inventory: {
      stock: {
        type: Number,
        required: [true, "Product stock is required"],
        min: [0, "Stock cannot be negative"],
        default: 0,
      },
      reserved: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
    images: {
      type: [String],
      required: [true, "Product images are required"],
      validate: (value) => {
        if (!validator.isURL(value, { protocols: ["http", "https"] })) {
          throw new Error("Invalid image URL");
        }
      },
    },
    shipping: {
      type: String,
      enum: ["free", "standard", "express"],
      default: "standard",
    },
    deliveryOptions: {
      type: Map,
      of: new mongoose.Schema({
        price: {
          type: Number,
          required: [true, "Delivery price is required"],
          min: [0, "Price must be at least 0"],
          set: (value) => parseFloat(value).toFixed(2),
          get: (value) => parseFloat(value).toFixed(2),
        },
        estimatedDays: {
          type: Number,
          required: [true, "Estimated delivery days is required"],
          min: [1, "Estimated days must be at least 1"],
        },
      }),
    },
    status: {
      type: String,
      enum: ["draft", "active", "inactive"],
      default: "draft",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      getters: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.status;
        return ret;
      },
    },
    collation: { locale: "en", strength: 2 }, // Case-insensitive sorting and searching
  }
);

// Virtuals
productSchema.virtual("availableStock").get(function () {
  return this.inventory.stock - this.inventory.reserved;
});

// Compound Indexes
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1, "inventory.stock": 1 });
productSchema.index({ name: "text" });

// Query Helpers
productSchema.query.byCategory = function (category) {
  return this.where({ category });
};
productSchema.query.active = function () {
  return this.where({ status: "active" });
};
productSchema.query.inStock = function () {
  return this.where({ "inventory.stock": { $gt: 0 } });
};

// Instance Methods
productSchema.methods.reservedStock = function (quantity) {
  if (this.availableStock < quantity) {
    throw new Error("Insufficient stock");
  }
  this.inventory.reserved += quantity;
  return this.save();
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
