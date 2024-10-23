import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/autheraization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/vaildation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { getRemainingTime, startExam, submitExam } from "./StudentExam.controller.js";
import { startExamVal, submitExamVal } from "./StudentExam.vaildation.js";

const studentExamRouter = Router();

// Route to start an exam
studentExamRouter.post('/start/:examId',
  isAuthenticated(),
  isAuthorized([roles.USER, roles.ADMIN]),
  isValid(startExamVal),
  asyncHandler(startExam)
);

// Route to submit answers for an exam
studentExamRouter.post('/submit/:examId',
  isAuthenticated(),
  isAuthorized([roles.USER , roles.ADMIN]),
  isValid(submitExamVal),
  asyncHandler(submitExam)
);

// remaining time 
studentExamRouter.get('/exams/:examId/remaining-time',
  isAuthenticated(),
  isAuthorized([roles.USER , roles.ADMIN]),
  asyncHandler(getRemainingTime)
)

export default studentExamRouter;