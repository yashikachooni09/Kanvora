const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List",
    required: true,
  },
  position: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: "",
  },
  labels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Label" }],
  completed: {
    type: Boolean,
    default: false,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  attachments: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  history: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      action: { type: String, required: true },
      details: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    }
  ]
});

module.exports = mongoose.model("Card", cardSchema);