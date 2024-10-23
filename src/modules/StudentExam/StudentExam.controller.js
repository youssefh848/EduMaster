import { Exam, Question, StudentExam } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";


// start exam
export const startExam = async (req, res, next) => {
  const { examId } = req.params;

  // Find the exam
  const exam = await Exam.findById(examId);
  if (!exam) {
    return next(new AppError(messages.exam.notExist, 404));
  }

  // Ensure the student hasn't already started or submitted the exam
  const existingStudentExam = await StudentExam.findOne({ 
    student: req.authUser._id, 
    exam: examId 
  });

  if (existingStudentExam && existingStudentExam.isSubmitted) {
    return next(new AppError('You have already submitted this exam', 400));
  }

  // Calculate the end time based on the start time and duration
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + exam.duration * 60000); 

  // Create a new student exam entry
  const studentExam = new StudentExam({
    student: req.authUser._id,
    exam: examId,
    startTime,
    endTime,
  });

  await studentExam.save();

  // Return the exam details with timer info
  res.status(200).json({
    message: 'Exam started',
    success: true,
    data: {
      exam,
      startTime,
      endTime,
    },
  });
};


// submit exam
export const submitExam = async (req, res, next) => {
  const { examId } = req.params;
  const { answers } = req.body; 

  // Find the student's exam record using the authenticated user's ID
  const studentExam = await StudentExam.findOne({ student: req.authUser._id, exam: examId });
  if (!studentExam) {
    return next(new AppError('Exam not started or already submitted', 404));
  }

  if (studentExam.isSubmitted) {
    return next(new AppError(messages.exam.alreadyExist, 400));
  }

  // Check if the current time exceeds the exam end time
  const now = new Date();
  if (now > studentExam.endTime) {
    return next(new AppError('Time for submitting the exam has expired', 400));
  }

  let score = 0;

  // Compare answers
  for (const answer of answers) {
    const question = await Question.findById(answer.questionId);
    if (!question) {
      return next(new AppError(messages.question.notExist, 404));
    }

    const isCorrect = question.correctAnswer === answer.selectedAnswer;
    score += isCorrect ? question.points : 0;

    // Update student's answer record
    studentExam.answers.push({
      question: question._id,
      selectedAnswer: answer.selectedAnswer,
      isCorrect,
    });
  }

  // Mark the exam as submitted and save the score
  studentExam.isSubmitted = true;
  studentExam.score = score;
  await studentExam.save();

  // Return the score
  res.status(200).json({
    message: 'Exam submitted successfully',
    success: true,
    data: {
      score,
      totalPoints: studentExam.answers.length * 2,
    },
  });
};


// Get remaining time for the exam
export const getRemainingTime = async (req, res, next) => {
  const { examId } = req.params;

  // Find the student's exam record
  const studentExam = await StudentExam.findOne({ student: req.authUser._id, exam: examId });
  if (!studentExam) {
    return next(new AppError(messages.exam.notExist, 404));
  }

  // Check if the exam is already submitted
  if (studentExam.isSubmitted) {
    return next(new AppError('Exam already submitted', 400));
  }

  // Get the current time
  const now = new Date();

  // Check if the exam has started
  if (now < studentExam.startTime) {
    return next(new AppError('Exam has not started yet', 400));
  }

  // Calculate the remaining time
  const remainingTime = studentExam.endTime - now;

  // If the remaining time is less than or equal to 0, the exam time is over
  if (remainingTime <= 0) {
    return res.status(200).json({
      message: 'Time is up',
      success: true,
      data: {
        remainingTime: 0, 
      },
    });
  }

  // Convert remaining time to minutes and seconds
  const minutes = Math.floor(remainingTime / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000); 

  // Send response with the calculated remaining time
  res.status(200).json({
    message: 'Remaining time retrieved successfully',
    success: true,
    data: {
      remainingTime: {
        minutes,
        seconds,
      },
    },
  });
};
