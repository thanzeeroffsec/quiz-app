import mongoose, { Document, Model, Schema } from "mongoose";

interface IQuizz extends Document {
  userId: mongoose.Types.ObjectId; // Reference to User model
  questions: mongoose.Types.ObjectId[]; // Array of references to Question model
  correct: number;
  wrong: number;
  active: boolean;
  completed: boolean;
}
const QuizSchema = new Schema<IQuizz>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
    ],
    correct: {
      type: Number,
    },
    wrong: {
      type: Number,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Quiz: Model<IQuizz> =
  mongoose.models.Quiz || mongoose.model<IQuizz>("Quiz", QuizSchema);

export default Quiz;
