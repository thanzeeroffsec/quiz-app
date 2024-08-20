import dbConnect from "@/db/config/mongodb";
import Question from "@/db/models/Question";
import Quiz from "@/db/models/Quizz";
import Student from "@/db/models/Student";
import { count } from "console";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const studentCount = await Student.countDocuments();
    const quizCount = await Quiz.countDocuments();
    const questionCount = await Question.countDocuments();
    const quizzData = await Quiz.find();
    const counts = {
      studentCount,
      quizCount,
      questionCount,
      quizzData,
    };
    return NextResponse.json(counts);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch counts" });
  }
}
