const joi = require("joi");

// Register Schema
const registerSchema = joi.object({
  firstName: joi
    .string()
    .required()
    .trim()
    .min(3)
    .max(50)
    .pattern(new RegExp("^[a-zA-Z\\-'s]+$"))
    .messages({
      "string.base": "First Name must be a string",
      "string.empty": "First Name is required",
      "string.min": "First Name must be at least {#limit} characters",
      "string.max": "First Name must be at most {#limit} characters",
      "string.pattern.base": "First Name must contain only letters",
      "any.required": "First Name is required",
    }),
  lastName: joi.string().optional().trim().max(50).default("").messages({
    "string.base": "Last Name must be a string",
    "string.max": "Last Name must be at most {#limit} characters",
  }),
  email: joi.string().required().trim().email().messages({
    "string.base": "Email Address must be a string",
    "string.empty": "Email Address is required",
    "string.email": "Invalid Email Address",
    "any.required": "Email Address is required",
  }),
  password: joi.string().required().trim().min(8).max(255).messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "string.min": "Password must be at least {#limit} characters",
    "string.max": "Password must be at most {#limit} characters",
    "any.required": "Password is required",
  }),
  mobileNo: joi.string().required().trim().max(15).messages({
    "string.base": "Mobile Number must be a string",
    "string.empty": "Mobile Number is required",
    "string.max": "Mobile Number must be at most {#limit} characters",
    "any.required": "Mobile Number is required",
  }),
  address: joi.string().optional().trim().max(255).messages({
    "string.base": "Address must be a string",
    "string.max": "Address must be at most {#limit} characters",
  }),
  city: joi.string().optional().trim().max(50).messages({
    "string.base": "City must be a string",
    "string.max": "City must be at most {#limit} characters",
  }),
  postalCode: joi.string().required().trim().messages({
    "string.base": "Postal Code must be a string",
    "string.empty": "Postal Code is required",
    "any.required": "Postal Code is required",
  }),
  state: joi.string().optional().trim().max(50).messages({
    "string.base": "State must be a string",
    "string.max": "State must be at most {#limit} characters",
  }),
  country: joi.string().optional().trim().max(50).messages({
    "string.base": "Country must be a string",
    "string.max": "Country must be at most {#limit} characters",
  }),
});

// Login Schema
const loginSchema = joi.object({
  email: joi.string().required().trim().email().messages({
    "string.base": "Email Address must be a string",
    "string.empty": "Email Address is required",
    "string.email": "Invalid Email Address",
    "any.required": "Email Address is required",
  }),
  password: joi.string().required().trim().min(8).max(255).messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "string.min": "Password must be at least {#limit} characters",
    "string.max": "Password must be at most {#limit} characters",
    "any.required": "Password is required",
  }),
});

// confirm OTP schema
const confirmOtpSchema = joi.object({
  email: joi.string().required().trim().email().messages({
    "string.base": "Email Address must be a string",
    "string.empty": "Email Address is required",
    "string.email": "Invalid Email Address",
    "any.required": "Email Address is required",
  }),
  otp: joi.string().required().trim().min(4).max(6).messages({
    "string.base": "OTP must be a string",
    "string.empty": "OTP is required",
    "string.min": "OTP must be at least {#limit} characters",
    "string.max": "OTP must be at most {#limit} characters",
    "any.required": "OTP is required",
  }),
});

// admin approve user schema
const approveUserSchema = joi.object({
  status: joi.string().required().valid("approved", "rejected").messages({
    "string.base": "Status must be a string",
    "string.empty": "Status is required",
    "any.only": "Status must be either approved or rejected",
    "any.required": "Status is required",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  confirmOtpSchema,
  approveUserSchema,
};
