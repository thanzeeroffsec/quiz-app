import dbConnect from "@/db/config/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/db/models/Quizz";
import Student from "@/db/models/Student";
import "@/db/models/Question";

// Type definitions
interface Answer {
  questionId: string;
  option: number;
}

interface Question {
  _id: string;
  answer: string; // Adjust based on your actual schema
  // Add other relevant fields here
}

interface QuizDocument extends Document {
  questions: Question[]; // Ensure this matches your Quiz schema
  userId: string;
}

export async function GET(
  req: Request,
  { params }: { params: { quizId?: string } }
) {
  const { quizId } = params;
  console.log(quizId);

  if (!quizId) {
    return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
  }

  try {
    await dbConnect();

    const quiz = await Quiz.findById(quizId)
      .populate("questions")
      .populate("userId");

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const { quizId, answers }: { quizId: string; answers: Answer[] } =
      await req.json();

    if (!quizId || !answers) {
      return NextResponse.json(
        { message: "Quiz ID and answers are required" },
        { status: 400 }
      );
    }

    // Fetch quiz and populate questions
    const quiz = (await Quiz.findById(quizId).populate(
      "questions"
    )) as QuizDocument | null;

    if (!quiz || !quiz.questions) {
      return NextResponse.json(
        { error: "Questions not found in the quiz" },
        { status: 404 }
      );
    }

    // Calculate the number of correct answers
    let countOfCorrectAnswers = 0;
    let countOfWrongAnswers = 0;

    answers.forEach((answer) => {
      // Find the corresponding question
      const question = quiz.questions.find(
        (q) => q._id.toString() === answer.questionId
      );

      // Compare the user's option with the correct answer
      if (question) {
        if (question.answer === String(answer.option)) {
          countOfCorrectAnswers++;
        } else {
          countOfWrongAnswers++;
        }
      } else {
        // Handle case where the question is not found
        console.log(`Question with ID ${answer.questionId} not found.`);
      }
    });

    const updateQuizz = await Quiz.findByIdAndUpdate(
      quizId,
      {
        correct: countOfCorrectAnswers,
        wrong: countOfWrongAnswers,
        completed: true,
      },
      { new: true }
    );

    if (!quiz.userId) {
      throw new Error("User ID not found in the quiz");
    }
    const student = await Student.findById(quiz.userId);
    const newPoints = (student?.point || 0) + countOfCorrectAnswers;

    const userUpdate = await Student.findByIdAndUpdate(
      quiz.userId,
      {
        $set: {
          point: newPoints, // Set the point field to the newPoints value
          quizId: null, // Reset quizId to null
          inQuiz: false, // Set inQuiz to false
        },
      },
      { new: true } // Return the updated document
    );

    return NextResponse.json(updateQuizz);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not submit the quiz" },
      { status: 500 }
    );
  }
}
