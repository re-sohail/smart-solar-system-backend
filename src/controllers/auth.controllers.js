const User = require("../models/user.model");
const OTPConfirm = require("../models/otpConfirm");
const generateOTP = require("../utils/generateOTP");
const sendOTP = require("../utils/sendOTP");
const bcrypt = require("bcryptjs");
const e = require("express");

const registerUser = async (req, res) => {
  try {
    const userData = req.body;

    // Check existing user
    const [isEmailExist, isMobileNoExist] = await Promise.all([
      User.findByEmail(userData.email),
      User.findByMobileNo(userData.mobileNo),
    ]);

    if (isEmailExist) {
      return res.sendError({
        message: "User already exists with the given email address",
        statusCode: 400,
      });
    }

    if (isMobileNoExist) {
      return res.sendError({
        message: "Mobile number is already registered",
        statusCode: 400,
      });
    }

    // Create a new user
    const user = new User(userData);

    // Save the user to the database
    await user.save();

    // Generate OTP Function
    const otp = generateOTP();

    // Send the OTP to the user
    sendOTP(userData.email, otp);

    // Delete the existing OTP
    await OTPConfirm.findOneAndDelete({ email: userData.email });

    // Save the OTP and Email
    let otpConfirm = new OTPConfirm({
      email: userData.email,
      otp: otp,
    });

    await otpConfirm.save();

    // Return the success response
    res.sendSuccess({
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.sendError({
      message: "Server Issue Occurred",
      statusCode: 500,
      error: error.message,
    });
    console.error("An unexpected error occurred", error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const isEmailExist = await User.findByEmail(email);

    // Check if the email exists and its active status is true
    if (!isEmailExist || !isEmailExist.isActive) {
      return res.sendError({
        message: "Invalid Credentials",
        statusCode: 400,
      });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      isEmailExist.password
    );

    if (!isPasswordCorrect) {
      return res.sendError({
        message: "Invalid Credentials",
        statusCode: 400,
      });
    }

    // JWT Token
    const token = await isEmailExist.generateAuthToken();

    // set token in cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    // Return the success response
    res.sendSuccess({
      message: "User logged in successfully",
      data: {
        user: isEmailExist,
        token,
      },
    });
  } catch (error) {
    res.sendError({
      message: "Server Issue Occurred",
      statusCode: 500,
      error: error,
    });
  }
};

const confirmOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if the OTP exists
    const otpConfirm = await OTPConfirm.findOne({ email, otp });
    if (!otpConfirm) {
      return res.sendError({
        message: "Invalid OTP",
        statusCode: 400,
      });
    }

    // Check if the OTP is expired
    if (otpConfirm.expiresAt < new Date()) {
      await OTPConfirm.findOneAndDelete({ email });
      return res.sendError({
        message: "OTP has expired",
        statusCode: 400,
      });
    }

    // Delete the OTP
    await OTPConfirm.findOneAndDelete({ email });

    // Update the user status
    await User.findOneAndUpdate({ email }, { isActive: true }, { new: true });

    // Return the success response
    return res.sendSuccess({
      message: "OTP confirmed successfully",
    });
  } catch (error) {
    res.sendError({
      message: "Server Issue Occurred",
      statusCode: 500,
      error: error,
    });
    console.error("An unexpected error occurred", error);
  }
};

module.exports = {
  registerUser,
  confirmOTP,
  loginUser,
};
