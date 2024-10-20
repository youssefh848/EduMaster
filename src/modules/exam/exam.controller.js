import { Exam } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";

// add exam
export const addExam = async (req, res, next) => {
  // Get data from the request
  const {
    title,
    description,
    duration,
    questions,
    classLevel,
    isPublished,
    startDate,
    endDate,
  } = req.body;

  // Check if exam with the same title already exists
  const existingExam = await Exam.findOne({ title });
  if (existingExam) {
    return next(new AppError(messages.exam.alreadyExist, 400));
  }

  // Prepare data for the new exam
  const exam = new Exam({
    title,
    description,
    duration,
    questions,
    createdBy: req.authUser._id,
    classLevel,
    isPublished,
    startDate,
    endDate,
  });

  // Save the exam to the database
  const createdExam = await exam.save();
  if (!createdExam) {
    return next(new AppError(messages.exam.failToCreate, 500));
  }

  // Send response
  return res.status(201).json({
    message: messages.exam.created,
    success: true,
    data: createdExam,
  });
};