const Card = require("../models/Card");
const List = require("../models/List");
const Board = require("../models/Board");
const User = require("../models/User");

const checkPermission = async ({ listId, cardId, userId }) => {
  let targetListId = listId;
  if (!targetListId && cardId) {
    const card = await Card.findById(cardId);
    if (!card) return { allowed: false, message: "Card not found", card: null };
    targetListId = card.listId;
  }

  const list = await List.findById(targetListId);
  if (!list) return { allowed: false, message: "List not found" };

  const board = await Board.findById(list.boardId);
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

// ✅ Create Card
exports.createCard = async (req, res) => {
  try {
    const { title, listId } = req.body;

    const perm = await checkPermission({ listId, userId: req.user.id });
    if (!perm.allowed) {
      return res.status(403).json({ success: false, message: perm.message });
    }
    if (perm.isViewer) {
      return res.status(403).json({ success: false, message: "Viewers have read-only access" });
    }

    const card = await Card.create({
      title,
      listId,
      history: [{ user: req.user.id, action: 'created', details: 'Created this card' }]
    });

    res.json({
      success: true,
      data: card,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ Get Cards by List (exclude archived)
exports.getCards = async (req, res) => {
  try {
    const { listId } = req.query;

    const perm = await checkPermission({ listId, userId: req.user.id });
    if (!perm.allowed) {
      return res.status(403).json({ success: false, message: perm.message });
    }

    const cards = await Card.find({
      listId,
      isArchived: false,
    }).populate("labels").populate({ path: "history.user", select: "fname lname avatar" });

    res.json({
      success: true,
      data: cards,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.moveCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { listId, position } = req.body;

    const perm = await checkPermission({ cardId: id, userId: req.user.id });
    if (!perm.allowed) {
      return res.status(403).json({ success: false, message: perm.message });
    }
    if (perm.isViewer) {
      return res.status(403).json({ success: false, message: "Viewers have read-only access" });
    }

    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ success: false, message: "Card not found" });

    if (card.listId.toString() !== listId) {
      const oldList = await List.findById(card.listId);
      const newList = await List.findById(listId);
      
      if (oldList && newList) {
        card.history.push({
          user: req.user.id,
          action: 'moved',
          details: `Moved from ${oldList.title} to ${newList.title}`
        });
      }
    }

    card.listId = listId;
    card.position = position;
    await card.save();
    
    await card.populate("labels");
    await card.populate({ path: "history.user", select: "fname lname avatar" });

    res.json({
      success: true,
      data: card,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ✅ Update Card
exports.updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const perm = await checkPermission({ cardId: id, userId: req.user.id });
    if (!perm.allowed) {
      return res.status(403).json({ success: false, message: perm.message });
    }
    if (perm.isViewer) {
      return res.status(403).json({ success: false, message: "Viewers have read-only access" });
    }

    const card = await Card.findByIdAndUpdate(id, updates, { new: true }).populate("labels").populate({ path: "history.user", select: "fname lname avatar" });
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    res.json({
      success: true,
      data: card,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Delete Card
exports.deleteCard = async (req, res) => {
  try {
    const { id } = req.params;

    const perm = await checkPermission({ cardId: id, userId: req.user.id });
    if (!perm.allowed) {
      return res.status(403).json({ success: false, message: perm.message });
    }
    if (perm.isViewer) {
      return res.status(403).json({ success: false, message: "Viewers have read-only access" });
    }

    const card = await Card.findByIdAndDelete(id);
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    res.json({
      success: true,
      message: "Card deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Archive Card
exports.toggleArchive = async (req, res) => {
  try {
    const { id } = req.params;

    const perm = await checkPermission({ cardId: id, userId: req.user.id });
    if (!perm.allowed) {
      return res.status(403).json({ success: false, message: perm.message });
    }
    if (perm.isViewer) {
      return res.status(403).json({ success: false, message: "Viewers have read-only access" });
    }

    const card = await Card.findById(id).populate("labels");
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    card.isArchived = !card.isArchived;
    await card.save();

    res.json({
      success: true,
      data: card,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Toggle Complete
exports.toggleComplete = async (req, res) => {
  try {
    const { id } = req.params;

    const perm = await checkPermission({ cardId: id, userId: req.user.id });
    if (!perm.allowed) {
      return res.status(403).json({ success: false, message: perm.message });
    }
    if (perm.isViewer) {
      return res.status(403).json({ success: false, message: "Viewers have read-only access" });
    }

    const card = await Card.findById(id).populate("labels");
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    card.completed = !card.completed;
    await card.save();

    res.json({
      success: true,
      data: card,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Upload Attachment
exports.uploadAttachment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const perm = await checkPermission({ cardId: id, userId: req.user.id });
    if (!perm.allowed) {
      return res.status(403).json({ success: false, message: perm.message });
    }
    if (perm.isViewer) {
      return res.status(403).json({ success: false, message: "Viewers have read-only access" });
    }

    const card = await Card.findById(id).populate("labels");
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    const filePath = `/uploads/${req.file.filename}`;
    card.attachments.push(filePath);
    card.image = filePath;
    await card.save();

    res.json({
      success: true,
      data: card,
      message: "Attachment uploaded successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Add Label to Card
exports.addLabel = async (req, res) => {
  try {
    const { id } = req.params;
    const { labelId } = req.body;

    if (!labelId) {
      return res.status(400).json({
        success: false,
        message: "Label ID is required",
      });
    }

    const perm = await checkPermission({ cardId: id, userId: req.user.id });
    if (!perm.allowed) {
      return res.status(403).json({ success: false, message: perm.message });
    }
    if (perm.isViewer) {
      return res.status(403).json({ success: false, message: "Viewers have read-only access" });
    }

    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    if (card.labels.includes(labelId)) {
      return res.status(400).json({
        success: false,
        message: "Label already exists on this card",
      });
    }

    card.labels.push(labelId);
    await card.save();

    await card.populate("labels");
    await card.populate({ path: "history.user", select: "fname lname avatar" });

    res.json({
      success: true,
      data: card,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Remove Label from Card
exports.removeLabel = async (req, res) => {
  try {
    const { id } = req.params;
    const { labelId } = req.body;

    if (!labelId) {
      return res.status(400).json({
        success: false,
        message: "Label ID is required",
      });
    }

    const perm = await checkPermission({ cardId: id, userId: req.user.id });
    if (!perm.allowed) {
      return res.status(403).json({ success: false, message: perm.message });
    }
    if (perm.isViewer) {
      return res.status(403).json({ success: false, message: "Viewers have read-only access" });
    }

    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    card.labels = card.labels.filter((label) => label.toString() !== labelId);
    await card.save();

    await card.populate("labels");
    await card.populate({ path: "history.user", select: "fname lname avatar" });

    res.json({
      success: true,
      data: card,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

