const List = require("../models/List");
const Board = require("../models/Board");
const User = require("../models/User");

const checkBoardPermission = async (boardId, userId) => {
  const board = await Board.findById(boardId);
  if (!board) return { allowed: false, message: "Board not found" };

  const user = await User.findById(userId);
  const userEmail = user?.email ? user.email.toLowerCase() : "";

  const isOwner = board.userId?.toString() === userId || board.owner?.toString() === userId;
  const memberEntry = board.members.find(
    (m) => (m.userId && m.userId.toString() === userId) || (m.email && m.email.toLowerCase() === userEmail)
  );

  if (!isOwner && !memberEntry) {
    return { allowed: false, message: "Access denied" };
  }

  const role = isOwner ? "owner" : memberEntry ? memberEntry.role || "editor" : "viewer";
  return { allowed: true, role, isViewer: role === "viewer" };
};

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

    const perm = await checkBoardPermission(boardId, req.user.id);
    if (!perm.allowed) {
      return res.status(403).json({ success: false, message: perm.message });
    }
    if (perm.isViewer) {
      return res.status(403).json({ success: false, message: "Viewers have read-only access" });
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

    const perm = await checkBoardPermission(boardId, req.user.id);
    if (!perm.allowed) {
      return res.status(403).json({ success: false, message: perm.message });
    }

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

    const list = await List.findById(id);
    if (!list) {
      return res.status(404).json({ success: false, message: "List not found" });
    }

    const perm = await checkBoardPermission(list.boardId, req.user.id);
    if (!perm.allowed) {
      return res.status(403).json({ success: false, message: perm.message });
    }
    if (perm.isViewer) {
      return res.status(403).json({ success: false, message: "Viewers have read-only access" });
    }

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