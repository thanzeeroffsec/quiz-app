import dbConnect from "@/db/config/mongodb";
import Student from "@/db/models/Student";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const students = await Student.find({});

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { message: "Error fetching students" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, category } = await req.json();
    if (!name || !category) {
      return NextResponse.json(
        { message: "Student name and category are required." },
        { status: 400 }
      );
    }
    const newStudent = new Student({
      name,
      category,
    });
    await newStudent.save();

    return NextResponse.json(
      { message: "Student created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { message: "Error creating student." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  // Update student
  try {
    await dbConnect();
    const { id, name, category } = await req.json();
    if (!name || !category) {
      return NextResponse.json(
        { message: "Student details and category are required." },
        { status: 400 }
      );
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, category },
      { new: true } // Return the updated document
    );
    if (!updatedStudent) {
      return NextResponse.json(
        { message: "Student not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  // Delete student
  try {
    await dbConnect();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "Student ID is required." },
        { status: 400 }
      );
    }
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return NextResponse.json(
        { message: "Student not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Student deleted successfully." });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error deleting student." },
      { status: 500 }
    );
  }
}
