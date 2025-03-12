const authRout = require("express").Router();

// Joi Schema validation middleware
const { validate } = require("../middleware/validateSchema.middleware");
const {
  registerSchema,
  confirmOtpSchema,
  loginSchema,
} = require("../../utils/bodyData.validate");
const authController = require("../../controllers/auth.controllers");

// Routes
authRout.post(
  "/register",
  validate(registerSchema),
  authController.registerUser
);

authRout.post("/login", validate(loginSchema), authController.loginUser);

authRout.post(
  "/confirm-otp",
  validate(confirmOtpSchema),
  authController.confirmOTP
);

module.exports = authRout;
