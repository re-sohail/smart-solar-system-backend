const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      maxLength: [32, "Category name must be at most 32 characters"],
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
      trim: true,
      maxLength: [255, "Category description must be at most 255 characters"],
    },
    image: {
      type: String,
      required: false,
      default: "no-image.jpg",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
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

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
