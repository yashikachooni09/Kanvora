const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      default: "#4f46e5",
    },

    image: {
      type: String,
      default: "",
    },

    visibility: {
      type: String,
      enum: ["private", "workspace", "public"],
      default: "private",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", boardSchema);