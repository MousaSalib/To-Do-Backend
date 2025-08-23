import mongoose, { Document, Schema } from "mongoose";

export interface ITodo extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  startDate: Date;
  endDate: Date;
  durationInDays: number;
  durationInHours: number;
  durationInMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new Schema<ITodo>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    completed: { type: Boolean, default: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    durationInDays: { type: Number, required: true },
    durationInHours: { type: Number, required: true },
    durationInMinutes: { type: Number, required: true },
  },
  { timestamps: true }
);

todoSchema.pre("save", function (next) {
  if (this.startDate && this.endDate) {
    const diffMs = this.endDate.getTime() - this.startDate.getTime();

    this.durationInDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    this.durationInHours = Math.ceil(diffMs / (1000 * 60 * 60));
    this.durationInMinutes = Math.ceil(diffMs / (1000 * 60));
  }
  next();
});

export default mongoose.model<ITodo>("Todo", todoSchema);
