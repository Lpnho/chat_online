import mongoose from "mongoose";
export const Chat = mongoose.model("Chat", {
  parts: {
    dest_name: String,
    dest_email: String,
    reme_name: String,
    reme_email: String,
  },
  chat_id: String,
  chat_messages: [String],
});
