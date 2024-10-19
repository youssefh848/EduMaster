import { Question, Exam } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";

// Add a new question
export const addQuestion = async (req, res, next) => {
// Extract data from req.body
    let { text, type, options, correctAnswer, exam, points } = req.body;

// Check if the question already exists for the exam
    const existQuestion = await Question.findOne({ text, exam });
if (existQuestion) {
    return next(new AppError(messages.question.alreadyExist, 400));
    }

// Create the new question
const question = new Question({
    text,
    type,
    options: options || [],
    correctAnswer,
    exam,
    points,
    createdBy: req.authUser._id,
    });

// Save the question to the database
const addedQuestion = await question.save();

// Handle failure
if (!addedQuestion) {
    return next(new AppError(messages.question.failToCreate, 500));
    }

// Update the exam to include the new question
await Exam.findByIdAndUpdate(
    exam,
    { $addToSet: { questions: addedQuestion._id } },
    { new: true }
    );

// Send response
return res.status(201).json({
    message: messages.question.created,
    success: true,
    data: addedQuestion,
    });
};
