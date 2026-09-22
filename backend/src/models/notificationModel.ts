import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  receiver: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;

  type:
    | "session_request"
    | "session_accepted"
    | "session_rejected"
    | "review_received";

  title: string;
  message: string;

  link?: string;

  isRead: boolean;
}

const notificationSchema = new Schema(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "session_request",
        "session_accepted",
        "session_rejected",
        "review_received",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    link: {
      type: String,
      default: "",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema
);