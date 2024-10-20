import { Router } from 'express';
import { isAuthenticated } from '../../middleware/authentication.js';
import { isAuthorized } from '../../middleware/autheraization.js';
import { roles } from '../../utils/constant/enums.js';
import { isValid } from '../../middleware/vaildation.js';
import { addQuestionVal } from './question.vaildation.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { addQuestion } from './question.controller.js';


const questionRouter = Router();

// Add question
questionRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    isValid(addQuestionVal),
    asyncHandler(addQuestion) 
);

export default questionRouter;
