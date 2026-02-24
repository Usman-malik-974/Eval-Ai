const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    roleAppliedFor: String,
    interviewType: String,
    difficulty: String,

    question: String,
    candidateAnswer: String,

    aiFeedback: String,
    score: Number,

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "InterviewSession",
  interviewSessionSchema
);