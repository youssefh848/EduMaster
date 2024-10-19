import joi from "joi";
import { generalFields } from "../../middleware/vaildation.js";

// add Exam validation
export const addExamVal = joi.object({
  title: generalFields.title.trim().min(5).required(),
  description: generalFields.description.optional(),
  duration: generalFields.duration,
  questions: generalFields.questions,
  classLevel: generalFields.classLevel.required(),
  isPublished: generalFields.isPublished,
  startDate: generalFields.startDate.required(),
  endDate: generalFields.endDate.required(),
});
