const authRout = require("express").Router();

// Joi Schema validation middleware
const { validate } = require("../middleware/validateSchema.middleware");
const {
  registerSchema,
  confirmOtpSchema,
} = require("../../utils/bodyData.validate");
const authController = require("../../controllers/auth.controllers");

authRout.post(
  "/register",
  validate(registerSchema),
  authController.registerUser
);

authRout.post("/login", authController.loginUser);

authRout.post(
  "/confirm-otp",
  validate(confirmOtpSchema),
  authController.confirmOTP
);

module.exports = authRout;
