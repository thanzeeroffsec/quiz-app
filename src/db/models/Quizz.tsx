import mongoose, { Document, Model, Schema } from "mongoose";

interface IQuestion extends Document {
  question: string;
  options: string[];
  category: string;
  answer: string;
}

const QuestionSchema = new Schema<IQuestion>({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const Question: Model<IQuestion> =
  mongoose.models.Question ||
  mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
