import { Lesson } from "../../../db/models/lessonModel.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";

// add lesson 
export const addLesson = async (req, res, next) => {
    // get data from req 
    let { title, description, video, classLevel } = req.body;
    title = title.toLowerCase()
    // check existance
    const existLesson = await Lesson.findOne({ title });
    if (existLesson) {
        return next(new AppError(messages.lesson.alreadyExist, 400));
    }
    // prepare data
    const lesson = new Lesson({
        title,
        description,
        video,
        classLevel,
        createdBy: req.authUser._id
    })
    // add to db
    const addedLesson = await lesson.save()
    // handel fail
    if (!addedLesson) {
        return next(new AppError(messages.lesson.failToCreate, 500))

    }
    // send res
    return res.status(201).json({
        message: messages.lesson.created,
        success: true,
        data: addedLesson
    })
}

// update lesson
export const updateLesson = async (req, res, next) => {
    // get data from req
    const { lessonId } = req.params;
    let { title, description, video, classLevel } = req.body;
    title = title.toLowerCase()
    // check existance 
    const lessonExist = await Lesson.findById(lessonId)
    if (!lessonExist) {
        return next(new AppError(messages.lesson.notExist, 404))
    }
    // check name exist 
    const titleExist = await Lesson.findOne({ title, _id: { $ne: lessonId } });
    if (titleExist) {
        return next(new AppError(messages.lesson.alreadyExist, 400));
    }
    // update if provided
    if (title) lessonExist.title = title;
    if (description) lessonExist.description = description;
    if (video) lessonExist.video = video;
    if (classLevel) lessonExist.classLevel = classLevel;
    // save update 
    const lessonUpdated = await lessonExist.save()
    // handel fail 
    if (!lessonUpdated) {
        return next(new AppError(messages.lesson.failToUpdate, 500))
    }
    // send res
    return res.status(200).json({
        message: messages.lesson.updated,
        success: true,
        data: lessonUpdated
    })
}

// get lessons to spesefic classLevel
export const getLessons = async (req, res, next) => {
    // get data from req    
    const classLevel = req.authUser.classLevel
    // get lessons
    const lessons = await Lesson.find({ classLevel })
    // send res
    return res.status(200).json({
        message: messages.lesson.fetchedSuccessfully,
        success: true,
        data: lessons
    })
}

// get lesson by id
export const getLessonById = async (req, res, next) => {
    // get data from req
    const { lessonId } = req.params;
    const classLevel = req.authUser.classLevel
    // check existance
    const lessonExist = await Lesson.findById(lessonId)
    // handel fail
    if (!lessonExist) {
        return next(new AppError(messages.lesson.notExist, 404))
    }
    // check classLevel
    if (lessonExist.classLevel !== classLevel) {
        return next(new AppError(messages.user.unauthorized, 403))
    }
    // send res
    return res.status(200).json({
        message: messages.lesson.fetchedSuccessfully,
        success: true,
        data: lessonExist
    })
}

// delete lesson 
export const deleteLesson = async (req, res, next) => {
    // get data from req
    const { lessonId } = req.params;
    // check existance
    const lessonExist = await Lesson.findById(lessonId)
    if (!lessonExist) {
        return next(new AppError(messages.lesson.notExist, 404))
    }
    // delete lesson 
    const deleteLesson = await Lesson.findByIdAndDelete(lessonId)
    // handel fail
    if (!deleteLesson) {
        return next(new AppError(messages.lesson.failToDelete, 500))
    }
    // send res
    return res.status(200).json({
        message: messages.lesson.deleted,
        success: true
    })
}