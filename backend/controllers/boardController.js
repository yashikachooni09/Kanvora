const Board = require("../models/Board");

// ✅ CREATE BOARD
exports.createBoard = async (req, res) => {
  try {
    const { title, color, image, visibility } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

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

// ✅ GET ALL BOARDS
exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

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

// ✅ GET SINGLE BOARD (IMPORTANT 🔥)
exports.getSingleBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await Board.findOne({
      _id: id,
      userId: req.user.id, // 🔒 security
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    res.json({
      success: true,
      data: board,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ DELETE BOARD
exports.deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await Board.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

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