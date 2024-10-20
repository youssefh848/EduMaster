import { Exam } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";

// add exam
export const addExam = async (req, res, next) => {
  // Get data from the request
  const { title, description, duration, questions, classLevel, isPublished } =
    req.body;

  // Check if exam with the same title already exists
  const existingExam = await Exam.findOne({ title });
  if (existingExam) {
    return next(new AppError(messages.exam.alreadyExist, 400));
  }

  // Set the start date to the current time
  const startDate = new Date();

  // Calculate endDate based on startDate and duration (in minutes)
  const endDate = new Date(new Date(startDate).getTime() + duration * 60000);

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

  // Populate the questions field
  const populatedExam = await createdExam.populate([{path: 'Question'}]);

  // Send response
  return res.status(201).json({
    message: messages.exam.created,
    success: true,
    data: populatedExam,
  });
};

// update exam
export const updateExam = async (req, res, next) => {
  const { examId } = req.params; // Get exam ID from params
  let {
    title,
    description,
    duration,
    questions,
    classLevel,
    isPublished,
    endDate,
  } = req.body; // Get exam data from request body

  title = title ? title.toLowerCase() : null;

  // Check if the exam exists
  const examExist = await Exam.findById(examId);
  if (!examExist) {
    return next(new AppError(messages.exam.notExist, 404)); 
  }

  // Check if the title is already in use by another exam
  if (title) {
    const titleExist = await Exam.findOne({ title, _id: { $ne: examId } });
    if (titleExist) {
      return next(new AppError(messages.exam.alreadyExist, 400)); 
    }
  }

  // Update fields if they are provided in the request
  if (title) examExist.title = title;
  if (description) examExist.description = description;
  if (duration) examExist.duration = duration;
  if (questions) examExist.questions = questions;
  if (classLevel) examExist.classLevel = classLevel;
  if (typeof isPublished !== "undefined") examExist.isPublished = isPublished;
  if (endDate) examExist.endDate = endDate;

  // Save the updated exam
  const examUpdated = await examExist.save();
  if (!examUpdated) {
    return next(new AppError(messages.exam.failToUpdate, 500)); // Handle save failure
  }

  // Send response with the updated exam
  return res.status(200).json({
    message: messages.exam.updated,
    success: true,
    data: examUpdated,
  });
};
