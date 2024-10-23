import joi from "joi";
import { generalFields } from "../../middleware/vaildation.js";

export const addLessonVal = joi.object({
    title: generalFields.title.required(),
    description: generalFields.description.required(),
    video: generalFields.video.required(),
    classLevel: generalFields.classLevel.required()
})

export const updateLessonVal = joi.object({
    lessonId: generalFields.objectId.required(),
    title: generalFields.title.optional(),
    description: generalFields.description.optional(),
    video: generalFields.video.optional(),
    classLevel: generalFields.classLevel.optional()
})

export const getLessonByIdVal = joi.object({
    lessonId: generalFields.objectId.required()
})

export const deleteLessonVal = joi.object({
    lessonId: generalFields.objectId.required()
})