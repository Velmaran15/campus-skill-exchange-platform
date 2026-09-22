import mongoose, { Schema, Document } from "mongoose";
import { ISkill } from "./Skill";

/*
  1️⃣ Define TypeScript interface
  This describes what a User object looks like
*/

export interface IUser extends Document {
  profileImage?: string;
  name: string;
  email: string;
  password: string;
  role: "tutor" | "learner";
  bio?: string;
  languages?: string[];
  rating: number;
  totalSessions: number;
  savedSkills: mongoose.Types.ObjectId[] | ISkill[];
  createdAt: Date;
}

/*
  2️⃣ Define Mongoose Schema
  This defines how data is stored in MongoDB
*/
const UserSchema: Schema = new Schema(
  {
    profileImage: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["tutor", "learner"],
      required: true
    },
    bio: {
      type: String,
      default: ""
    },
    languages: {
      type: [String]
    },
    rating: {
      type: Number,
      default: 0
    },
    totalSessions: {
      type: Number,
      default: 0
    },
    savedSkills: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill"
    }],
  },
  {
    timestamps: true
  }
);

/*
  3️⃣ Export Model
*/
export default mongoose.model<IUser>("User", UserSchema);