const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  title: String,
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board"
  }
}, { timestamps: true });

module.exports = mongoose.model("List", listSchema);