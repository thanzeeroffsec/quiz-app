import mongoose, { Document, Model, Schema } from "mongoose";

interface IStudent extends Document {
  name: string;
  category: string;
  point: number;
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
});

const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);

export default Student;
