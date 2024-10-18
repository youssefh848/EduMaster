import { Lesson } from "../../../db/models/lessonModel.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";

// add lesson 
export const addLesson = async (req, res, next) => {
    // get data from req 
    const { tittle, description, video } = req.body;
    // prepare data
    const lesson = new Lesson({
        tittle,
        description,
        video,
        // createdBy:req.authUser._id  todo
    })
    // add to db
    const addedLesson = await lesson.save()
    // handel fail
    if (!addedLesson) {
        return next(new AppError(messages.lesson.failToCreate, 500))

    }
    // send res
    res.status(201).json({
        message: messages.lesson.created,
        success: true,
        data: addedLesson
    })
}