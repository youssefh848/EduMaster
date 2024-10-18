import { Router } from "express";
import { isValid } from "../../middleware/vaildation.js";
import { forgotPasswordVal, resetPasswordVal } from "./user.validation.js";
import { forgotPassword, resetPassword } from "./user.controller.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";


const userRouter = Router()

// forgot password
userRouter.post('/forgot-password', isValid(forgotPasswordVal), asyncHandler(forgotPassword));
// reset password
userRouter.post('/reset-password', isValid(resetPasswordVal), asyncHandler(resetPassword));

export default userRouter