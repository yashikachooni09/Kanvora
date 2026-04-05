const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List",
    required: true,
  },

  position: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("Card", cardSchema);