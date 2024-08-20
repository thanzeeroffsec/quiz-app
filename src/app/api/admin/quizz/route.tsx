import dbConnect from "@/db/config/mongodb";
import Question from "@/db/models/Question";
import Quiz from "@/db/models/Quizz";
import Student from "@/db/models/Student";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect(); // Connect to MongoDB

    const body = await req.json(); // Parse the JSON body from the request
    const { userId, category, questionLength } = body;
    console.log(questionLength);

    if (!userId || !category || !questionLength) {
      return NextResponse.json(
        { message: "User ID, category, and question length are required." },
        { status: 400 }
      );
    }

    const availableQuestions = await Question.aggregate([
      { $match: { category } }, // Filter questions by category
      { $sample: { size: Math.min(questionLength, questionLength) } }, // Get random questions
    ]);

    if (availableQuestions.length === 0) {
      return NextResponse.json(
        { message: "No questions available in this category." },
        { status: 404 }
      );
    }

    const questionIds = availableQuestions.map((question) => question._id);

    const newQuiz = new Quiz({
      userId,
      questions: questionIds, // Save the random question IDs
      correct: 0,
      wrong: 0,
      active: true, // or set to false if you want it to be inactive by default
    });
    const userUpdate = await Student.findByIdAndUpdate(
      userId,

      { inQuiz: true, quizId: newQuiz._id },
      { new: true } // This option returns the updated document
    );
    if (!userUpdate) {
      return NextResponse.json(
        { message: "User not found or update failed." },
        { status: 404 }
      );
    }

    // Save the new quiz to the database

    await newQuiz.save();

    return NextResponse.json(
      { message: "Quiz created successfully", quiz: newQuiz },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { message: "Failed to create quiz", error },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { userId, quizId } = await req.json();
    if (!userId || !quizId) {
      return NextResponse.json(
        { message: "User ID and Quiz ID are required." },
        { status: 400 }
      );
    }
    const userUpdate = await Student.findByIdAndUpdate(
      userId,
      { inQuiz: false, quizId: null },
      { new: true }
    );
    if (!userUpdate) {
      return NextResponse.json(
        { message: "User not found or update failed." },
        { status: 404 }
      );
    }
    await Quiz.findByIdAndDelete(quizId);
    return NextResponse.json(
      { message: "Quiz deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "error while deleting quiz" },
      { status: 200 }
    );
  }
}
