import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/autheraization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/vaildation.js";
import { addExamVal, updateExamVal } from "./exam.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addExam, updateExam } from "./exam.controller.js";

const examRouter = Router();

// Add exam route
examRouter.post("/",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  isValid(addExamVal), 
  asyncHandler(addExam) 
);

// Update exam route
examRouter.put("/:examId",
  isAuthenticated(),  
  isAuthorized([roles.ADMIN]),  
  isValid(updateExamVal),  
  asyncHandler(updateExam)  
);


export default examRouter;