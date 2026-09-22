import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
    conversation: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;

    messageType: "text" | "file" | "image" | "system" | "session";

    text?: string;

    fileUrl?: string;
    fileName?: string;

    readBy: mongoose.Types.ObjectId[];

    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        conversation: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        messageType: {
            type: String,
            enum: [
                "text",
                "file",
                "image",
                "system",
                "session",
            ],
            default: "text",
        },
        text: {
            type: String,
            trim: true,
        },
        fileUrl: {
            type: String,
        },
        fileName: {
            type: String,
        },
        readBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IMessage>(
    "Message",
    messageSchema
);