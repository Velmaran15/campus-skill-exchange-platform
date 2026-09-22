import mongoose, { Schema, Document } from "mongoose";

export interface ISkill extends Document {
  tutor: mongoose.Types.ObjectId;
  skillName: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description?: string;
  createdAt: Date;
}

const SkillSchema: Schema = new Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    skillName: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true
    },
    description: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ISkill>("Skill", SkillSchema);