const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minLength: [8, "Password must be at least 8 characters"],
      maxLength: [255, "Password must be at most 255 characters"],
      validate: (value) => {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Use a stronger password");
        }
      },
    },
    mobileNo: {
      type: String,
      required: [true, "Mobile Number is required"],
      trim: true,
      unique: false,
      maxLength: [20, "Mobile Number must be at most 15 characters"],
      // validate: (value) => {
      //   if (!validator.isMobilePhone(value, "any")) {
      //     throw new Error("Invalid Mobile Number");
      //   }
      // },
    },
    address: {
      type: String,
      trim: true,
      required: [true, "Address is required"],
      maxLength: [255, "Address must be at most 255 characters"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      maxLength: [50, "City must be at most 50 characters"],
    },
    postalCode: {
      type: String,
      default: "",
      // required: [true, "Postal Code is required"],
      trim: true,
      maxLength: [10, "Postal Code must be at most 10 characters"],
      // validate: (value) => {
      //   if (!validator.isPostalCode(value, "any")) {
      //     throw new Error("Invalid Postal Code");
      //   }
      // },
    },
    state: {
      type: String,
      trim: true,
      default: "",
      // required: [true, "State is required"],
      uppercase: true,
      maxLength: [50, "State must be at most 50 characters"],
    },
    country: {
      type: String,
      // required: [true, "Country is required"],
      default: "",
      trim: true,
      uppercase: true,
      maxLength: [50, "Country must be at most 50 characters"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["admin", "user", "vender", "guest"],
        message: "Role must be either guest, user, or admin",
      },
      default: "guest",
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "Status must be either pending, approved, or rejected",
      },
      default: "pending",
    },
    isActive: {
      type: Boolean,
      default: false,
      required: true,
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
        delete ret.password;
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
});

// Virtuals
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Static Methods / Query Helpers
userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

userSchema.statics.findByMobileNo = async function (mobileNo) {
  return this.findOne({ mobileNo });
};

userSchema.query.byRole = function (role) {
  return this.where({ role });
};
userSchema.query.byStatus = function (status) {
  return this.where({ status });
};

// Generate JWT Token
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  return token;
};

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
