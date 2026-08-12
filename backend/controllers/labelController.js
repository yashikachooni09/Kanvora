const Label = require("../models/Label");
const Board = require("../models/Board");
const User = require("../models/User");
const Card = require("../models/Card");

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
  return { allowed: true, role, isViewer: role === "viewer", board };
};

// GET /boards/:id/labels
exports.getBoardLabels = async (req, res) => {
  try {
    const { id: boardId } = req.params;
    const perm = await checkBoardPermission(boardId, req.user.id);
    if (!perm.allowed) {
      return res.status(403).json({ success: false, message: perm.message });
    }

    const labels = await Label.find({ boardId });
    res.json({ success: true, data: labels });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /boards/:id/labels
exports.createLabel = async (req, res) => {
  try {
    const { id: boardId } = req.params;
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Label name is required" });
    }

    const perm = await checkBoardPermission(boardId, req.user.id);
    if (!perm.allowed) {
      return res.status(403).json({ success: false, message: perm.message });
    }
    if (perm.isViewer) {
      return res.status(403).json({ success: false, message: "Viewers cannot create labels" });
    }

    const newLabel = await Label.create({
      name,
      color: color || "#6366f1",
      boardId,
    });

    res.json({ success: true, data: newLabel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /boards/:id/labels/:labelId
exports.updateLabel = async (req, res) => {
  try {
    const { id: boardId, labelId } = req.params;
    const { name, color } = req.body;

    const perm = await checkBoardPermission(boardId, req.user.id);
    if (!perm.allowed) {
      return res.status(403).json({ success: false, message: perm.message });
    }
    if (perm.isViewer) {
      return res.status(403).json({ success: false, message: "Viewers cannot update labels" });
    }

    const label = await Label.findOneAndUpdate(
      { _id: labelId, boardId },
      { name, color },
      { new: true }
    );

    if (!label) {
      return res.status(404).json({ success: false, message: "Label not found" });
    }

    res.json({ success: true, data: label });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /boards/:id/labels/:labelId
exports.deleteLabel = async (req, res) => {
  try {
    const { id: boardId, labelId } = req.params;

    const perm = await checkBoardPermission(boardId, req.user.id);
    if (!perm.allowed) {
      return res.status(403).json({ success: false, message: perm.message });
    }
    if (perm.isViewer) {
      return res.status(403).json({ success: false, message: "Viewers cannot delete labels" });
    }

    const label = await Label.findOneAndDelete({ _id: labelId, boardId });
    if (!label) {
      return res.status(404).json({ success: false, message: "Label not found" });
    }

    // Pull this label from all cards
    await Card.updateMany(
      { labels: labelId },
      { $pull: { labels: labelId } }
    );

    res.json({ success: true, message: "Label deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
