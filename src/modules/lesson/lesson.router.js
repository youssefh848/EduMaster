import { Router } from "express";
import { isValid } from "../../middleware/vaildation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addLessonVal } from "./lesson.validation.js";


const lessonRouter = Router();

// add lesson   todo auth
lessonRouter.post('/', 
    isValid(addLessonVal),
    asyncHandler()
)


export default lessonRouter;