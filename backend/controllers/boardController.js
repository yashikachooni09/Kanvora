const Board = require("../models/Board");

// ✅ Create Board
exports.createBoard = async (req, res) => {
  try {
    const { title, color, image, visibility } = req.body;

    const board = await Board.create({
      title,
      color,
      image,
      visibility,
      userId: req.user.id,
    });

    res.json({
      success: true,
      message: "Board created successfully",
      data: board,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ Get Boards
exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: boards,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ Delete Board
exports.deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;

    await Board.findOneAndDelete({
      _id: id,
      userId: req.user.id, // security 🔥
    });

    res.json({
      success: true,
      message: "Board deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};