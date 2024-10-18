import { Router } from "express";
import { isValid } from "../../middleware/vaildation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addLessonVal, deleteLessonVal, getLessonByIdVal, updateLessonVal } from "./lesson.validation.js";
import { addLesson, deleteLesson, getLessonById, getLessons, updateLesson } from "./lesson.controller.js";


const lessonRouter = Router();

// add lesson   todo auth
lessonRouter.post('/',
    isValid(addLessonVal),
    asyncHandler(addLesson)
)

// update lesson todo auth
lessonRouter.put('/:lessonId',
    isValid(updateLessonVal),
    asyncHandler(updateLesson)
)

// get lessons todo auth
lessonRouter.get('/',
    asyncHandler(getLessons)
)

// get lesson by id  todo auth
lessonRouter.get('/:lessonId',
    isValid(getLessonByIdVal),
    asyncHandler(getLessonById)
)

// delete lesson  todo aut
lessonRouter.delete('/:lessonId',
    isValid(deleteLessonVal),
    asyncHandler(deleteLesson)
)


export default lessonRouter;