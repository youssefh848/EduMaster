import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/autheraization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/vaildation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { createAdminVal } from "./admin.validation.js";
import { createAdmin } from "./admin.controller.js";

const adminRouter = Router();

// create admin via superAdmin
adminRouter.post('/create-admin',
    isAuthenticated(),
    isAuthorized([roles.SUPER_ADMIN]),
    isValid(createAdminVal),
    asyncHandler(createAdmin)
)

export default adminRouter;