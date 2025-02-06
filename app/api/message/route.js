import Message from "../../../model/message";
import connectDB from "../../../lib/connect";
export async function GET() {
  try {
    await connectDB();
    const messages = await Message.find();
    if (messages) {
      return Response.json({ message: messages }, { status: 200 });
    }
  } catch (error) {
    return Response.json({ message: "messages not found" }, { status: 404 });
  }
}
