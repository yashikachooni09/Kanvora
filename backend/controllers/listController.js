const List = require("../models/List");

// ✅ CREATE LIST
exports.createList = async (req, res) => {
  try {
    const { title, boardId } = req.body;

    if (!title || !boardId) {
      return res.status(400).json({
        success: false,
        message: "Title and boardId required",
      });
    }

    const list = await List.create({
      title,
      boardId,
    });

    res.json({
      success: true,
      data: list,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ GET LISTS BY BOARD ID
exports.getLists = async (req, res) => {
  try {
    const { boardId } = req.query;

    const lists = await List.find({ boardId });

    res.json({
      success: true,
      data: lists,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ DELETE LIST
exports.deleteList = async (req, res) => {
  try {
    const { id } = req.params;

    await List.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "List deleted",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};