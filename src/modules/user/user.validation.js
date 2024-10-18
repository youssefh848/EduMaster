import joi from "joi"
import { generalFields } from "../../middleware/vaildation.js"

export const forgotPasswordVal = joi.object({
  email: generalFields.email.required(),
});


export const resetPasswordVal = joi.object({
  email: generalFields.email.required(),
  otp: generalFields.otp.required(),
  newPassword: generalFields.password.required(),
});