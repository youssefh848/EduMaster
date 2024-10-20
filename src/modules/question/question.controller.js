import { Question, Exam } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";

// Add a new question
export const addQuestion = async (req, res, next) => {
  // Extract data from req.body
  let { text, type, options, correctAnswer, exam, points } = req.body;

  // Check if the exam exists
  const existingExam = await Exam.findById(exam);
  if (!existingExam) {
    return next(new AppError(messages.exam.notExist, 404));
  }
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

export const updateQuestion = async (req, res, next) => {
  const { questionId } = req.params; // Get question ID from params
  let { text, type, options, correctAnswer, points } = req.body; // Get question data from request body

  text = text ? text.trim() : null; // Ensure text is trimmed

  // Check if the question exists
  const questionExist = await Question.findById(questionId);
  if (!questionExist) {
    return next(new AppError(messages.question.notExist, 404)); // Return 404 if question does not exist
  }

  // Check if the text is already in use by another question in the same exam
  if (text) {
    const textExist = await Question.findOne({
      text,
      exam: questionExist.exam,
      _id: { $ne: questionId },
    });
    if (textExist) {
      return next(new AppError(messages.question.alreadyExist, 400)); // Return 400 if text is already taken
    }
  }

  // Update fields if they are provided in the request
  if (text) questionExist.text = text;
  if (type) questionExist.type = type;
  if (options) questionExist.options = options;
  if (correctAnswer) questionExist.correctAnswer = correctAnswer;
  if (points) questionExist.points = points;

  // Save the updated question
  const questionUpdated = await questionExist.save();
  if (!questionUpdated) {
    return next(new AppError(messages.question.failToUpdate, 500)); // Handle save failure
  }

  // Send response with the updated question
return res.status(200).json({
    message: messages.question.updated,
    success: true,
    data: questionUpdated,
});
};
