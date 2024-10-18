import joi from "joi";
import { generalFields } from "../../middleware/vaildation.js";

export const addLessonVal = joi.object({
    tittle: generalFields.tittle.required(),
    description: generalFields.description.required(),
    video: generalFields.video.required(),
})