import dbConnect from "@/db/config/mongodb";
import Quiz from "@/db/models/Quizz";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();
    const { userId } = params;
    const quizzData = await Quiz.find({ userId }).populate("userId");

    return NextResponse.json({ quizzData });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}
