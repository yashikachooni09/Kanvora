const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  title: String,
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List"
  }
});

module.exports = mongoose.model("Card", cardSchema);