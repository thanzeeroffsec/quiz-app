export const dynamic = "force-dynamic";

import dbConnect from "@/db/config/mongodb";
import Quiz from "@/db/models/Quizz";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const quizz = await Quiz.find({ completed: false });
    if (!quizz) {
      return NextResponse.json({ message: "there is no quiz at this time" });
    }
    console.log("fucking calling");
    console.log(quizz);

    return NextResponse.json(quizz, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "there is an error" });
  }
}
