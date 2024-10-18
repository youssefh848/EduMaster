import crypto from "crypto";
import bcrypt from "bcrypt";
import { User } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { sendEmail } from "../../utils/email.js";

// Forgot password - generate OTP and send to email
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError(messages.user.notFound, 404));
  }

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiration
  await user.save();

  // Send OTP via email
  await sendEmail({
    to: email,
    subject: "Reset Your Password",
    html: `<p>Your OTP code for resetting your password is: <strong>${otp}</strong></p>`,
  });

  // Send response
  return res.status(200).json({
    message: messages.user.otpSent,
    success: true,
  });
};

// Verify OTP and reset password
export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  // Find user by email and verify OTP
  const user = await User.findOne({
    email,
    otp,
    otpExpires: { $gt: Date.now() }, // Check if OTP is still valid
  });

  if (!user) {
    return next(new AppError(messages.user.invalidOTP, 400));
  }

  // Hash the new password and update
  user.password = bcrypt.hashSync(newPassword, 8);
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  // Send success response
  return res.status(200).json({
    message: messages.user.passwordUpdated,
    success: true,
  });
};