import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  tutor: mongoose.Types.ObjectId;
  learner: mongoose.Types.ObjectId;
  skill: mongoose.Types.ObjectId;

  status: "pending" | "accepted" | "rejected" | "completed";

  rating?: number;
  feedback?: string;

  requestedAt?: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  completedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema: Schema = new Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending"
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: {
      type: String
    },
    requestedAt: { type: Date },
    acceptedAt: { type: Date },
    rejectedAt: { type: Date },
    completedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ISession>("Session", SessionSchema);