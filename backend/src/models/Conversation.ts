import mongoose, { Document, Schema } from "mongoose";

export interface IConversation extends Document {
    tutor: mongoose.Types.ObjectId;
    learner: mongoose.Types.ObjectId;
    session: mongoose.Types.ObjectId;

    lastMessage?: string;
    lastMessageAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
    {
        tutor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        learner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        session: {
            type: Schema.Types.ObjectId,
            ref: "Session",
            required: true,
            unique: true,
        },

        lastMessage: {
            type: String,
            default: "",
        },

        lastMessageAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IConversation>(
    "Conversation",
    conversationSchema
);