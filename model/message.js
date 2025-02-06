import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    SenderName: { type: String, },
    message: { type: String, },
    image: { type: String },
  },
  { timestamps: true }
);
export default mongoose.models.Message || mongoose.model("Message", MessageSchema, "messages");
