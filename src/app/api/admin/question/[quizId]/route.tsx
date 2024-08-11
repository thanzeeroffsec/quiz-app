import dbConnect from "@/db/config/mongodb";
import Quiz from "@/db/models/Quizz";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  const { quizId } = params;

  if (!quizId) {
    return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
  }

  await dbConnect(); // Connect to MongoDB

  try {
    // Fetch the quiz question from the database
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    console.error("Error fetching quiz question:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz question" },
      { status: 500 }
    );
  }
}
