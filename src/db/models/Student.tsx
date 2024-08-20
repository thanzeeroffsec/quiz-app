import mongoose, { Document, Model, Schema } from "mongoose";

interface IStudent extends Document {
  name: string;
  category: string;
  point: number;
  inQuiz: boolean;
  quizId: mongoose.Types.ObjectId;
}

const StudentSchema = new Schema<IStudent>({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  point: {
    type: Number,
    default: 0,
  },
  inQuiz: {
    type: Boolean,
    default: false,
  },
  quizId: {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
  },
});

const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);

export default Student;
