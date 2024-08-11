import dbConnect from "@/db/config/mongodb";
import Question from "@/db/models/Quizz";
import { NextRequest, NextResponse } from "next/server";

export async function POST(Req: NextRequest) {
  try {
    await dbConnect();
    const { question, options, correctOption, category } = await Req.json();
    console.log({ question, options, correctOption, category });

    if (!question || !options || !category || !correctOption) {
      return NextResponse.json({
        message: "Question, options, category and answer are required.",
      });
    }
    const newQuestion = new Question({
      question,
      options,
      category,
      answer: correctOption,
    });
    await newQuestion.save();
    return NextResponse.json(
      {
        message: "Question created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error creating question.",
      },
      { status: 400 }
    );
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, question, options, correctOption, category } = body;

  if (!id) {
    return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
  }

  await dbConnect(); // Connect to MongoDB

  try {
    // Update the quiz question in the database
    const updatedQuiz = await Question.findByIdAndUpdate(
      id,
      { question, options, answer: correctOption, category },
      { new: true }
    );

    if (!updatedQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(updatedQuiz, { status: 200 });
  } catch (error) {
    console.error("Error updating quiz question:", error);
    return NextResponse.json(
      { error: "Failed to update quiz question" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect(); // Connect to MongoDB

  try {
    const quizzes = await Question.find({}); // Fetch all quizzes
    console.log(quizzes);

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Quiz ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const deletedQuiz = await Question.findByIdAndDelete(id);

    if (!deletedQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Quiz deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}
