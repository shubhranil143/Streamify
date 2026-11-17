import mongoose from "mongoose";

// FriendRequest Schema: tracks invitation state between two users (relational join document in MongoDB)
const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"], // Finite states: pending until recipient accepts
      default: "pending",
    },
  },
  {
    timestamps: true, // Used for sorting notifications chronologically
  }
);

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;