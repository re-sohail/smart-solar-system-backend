const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
      minLength: [3, "First Name must be at least 3 characters"],
      maxLength: [50, "First Name must be at most 50 characters"],
      match: [/^[a-zA-Z\-'\s]+$/, "First Name must contain only letters"],
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: [50, "Last Name must be at most 50 characters"],
      default: "",
    },
    email: {
      type: String,
      required: [true, "Email Address is required"],
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
    mobileNo: {
      type: String,
      required: [true, "Mobile Number is required"],
      trim: true,
      unique: [true, "Mobile Number is already registered"],
      maxLength: [15, "Mobile Number must be at most 15 characters"],
      validate: (value) => {
        if (!validator.isMobilePhone(value, "any")) {
          throw new Error("Invalid Mobile Number");
        }
      },
    },
    address: {
      type: String,
      trim: true,
      maxLength: [255, "Address must be at most 255 characters"],
    },
    city: {
      type: String,
      required: false,
      trim: true,
      maxLength: [50, "City must be at most 50 characters"],
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
    state: {
      type: String,
      trim: true,
      required: [true, "State is required"],
      uppercase: true,
      maxLength: [50, "State must be at most 50 characters"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      uppercase: true,
      maxLength: [50, "Country must be at most 50 characters"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["admin", "user", "guest"],
        message: "Role must be either guest, user, or admin",
      },
      default: "guest",
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["pending", "active", "inactive"],
        message: "Status must be either pending, active, or inactive",
      },
      default: "pending",
    },
    isApproved: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    accountLockedUntil: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    // send virtuals and remove version key when object is converted to JSON (means when sending response)
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.fullName = doc.fullName;
        delete ret._id;
        delete ret.firstName;
        delete ret.lastName;
        delete ret.__v;
        delete ret.loginAttempts;
        delete ret.accountLockedUntil;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
    collation: { locale: "en", strength: 2 }, // Case-insensitive sorting and searching
  }
);

// Compound Indexes
userSchema.index({
  role: 1,
  status: 1,
  isActive: 1,
  isApproved: 1,
  email: 1,
  mobileNo: 1,
});

// Virtuals
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Static Methods / Query Helpers
userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

userSchema.statics.findByMobileNo = async function (mobileno) {
  return this.findOne({ mobileno });
};

userSchema.query.byRole = function (role) {
  return this.where({ role });
};
userSchema.query.byStatus = function (status) {
  return this.where({ status });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
