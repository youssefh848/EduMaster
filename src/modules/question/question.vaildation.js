import joi from 'joi';
import { generalFields } from '../../middleware/vaildation.js';


//  add question validation
export const addQuestionVal = joi.object({
    text: generalFields.title.required(),
    type: generalFields.type.required(),
    options: generalFields.options, 
    correctAnswer: generalFields.correctAnswer.required(),
    exam: generalFields.objectId.required(),
    points: generalFields.points.required(),
});
