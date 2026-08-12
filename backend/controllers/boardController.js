const Board = require("../models/Board");
const User = require("../models/User");
const { sendBoardInviteEmail } = require("../utils/emailService");

exports.createBoard = async (req, res) => {
  try {
    const { title, color, image, visibility, workspaceId } = req.body;

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
      workspaceId: workspaceId || null,
      userId: req.user.id,
      owner: req.user.id,
    });

    res.json({
      success: true,
      message: "Board created successfully",
      data: {
        ...board.toObject(),
        userRole: "owner",
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getBoards = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const userEmail = currentUser?.email ? currentUser.email.toLowerCase() : "";

    const boards = await Board.find({
      $or: [
        { userId: req.user.id },
        { owner: req.user.id },
        { "members.userId": req.user.id },
        { "members.email": { $regex: new RegExp(`^${userEmail}$`, "i") } },
      ],
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

exports.getSingleBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    const currentUser = await User.findById(req.user.id);
    const userEmail = currentUser?.email ? currentUser.email.toLowerCase() : "";

    const isOwner =
      board.userId?.toString() === req.user.id ||
      board.owner?.toString() === req.user.id;

    const memberEntry = board.members.find(
      (m) =>
        (m.userId && m.userId.toString() === req.user.id) ||
        (m.email && m.email.toLowerCase() === userEmail)
    );

    if (!isOwner && !memberEntry) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (memberEntry && !memberEntry.userId) {
      memberEntry.userId = req.user.id;
      await board.save();
    }

    const userRole = isOwner ? "owner" : memberEntry ? memberEntry.role || "editor" : "viewer";

    res.json({
      success: true,
      data: {
        ...board.toObject(),
        userRole,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, color, image, visibility } = req.body;

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    const currentUser = await User.findById(req.user.id);
    const userEmail = currentUser?.email ? currentUser.email.toLowerCase() : "";
    const isOwner =
      board.userId?.toString() === req.user.id ||
      board.owner?.toString() === req.user.id;

    const memberEntry = board.members.find(
      (m) =>
        (m.userId && m.userId.toString() === req.user.id) ||
        (m.email && m.email.toLowerCase() === userEmail)
    );

    const userRole = isOwner ? "owner" : memberEntry ? memberEntry.role : null;
    if (userRole === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Viewers have read-only access",
      });
    }

    if (title) board.title = title;
    if (color !== undefined) board.color = color;
    if (image !== undefined) board.image = image;
    if (visibility) board.visibility = visibility;

    await board.save();

    res.json({
      success: true,
      message: "Board updated successfully",
      data: {
        ...board.toObject(),
        userRole: userRole || "editor",
      },
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

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    const currentUser = await User.findById(req.user.id);
    const userEmail = currentUser?.email ? currentUser.email.toLowerCase() : "";
    const isOwner =
      board.userId?.toString() === req.user.id ||
      board.owner?.toString() === req.user.id;

    const memberEntry = board.members.find(
      (m) =>
        (m.userId && m.userId.toString() === req.user.id) ||
        (m.email && m.email.toLowerCase() === userEmail)
    );

    const userRole = isOwner ? "owner" : memberEntry ? memberEntry.role : null;
    if (userRole !== "owner" && userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only board owner or admin can delete this board",
      });
    }

    await Board.findByIdAndDelete(id);

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

// ✅ INVITE USER TO BOARD
exports.inviteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { emails, role } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one email is required",
      });
    }

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    const currentUser = await User.findById(req.user.id);
    const userEmail = currentUser?.email ? currentUser.email.toLowerCase() : "";
    const isOwner =
      board.userId?.toString() === req.user.id ||
      board.owner?.toString() === req.user.id;

    const memberEntry = board.members.find(
      (m) =>
        (m.userId && m.userId.toString() === req.user.id) ||
        (m.email && m.email.toLowerCase() === userEmail)
    );

    const callerRole = isOwner ? "owner" : memberEntry ? memberEntry.role : null;

    if (callerRole !== "owner" && callerRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only board owner or admins can share this board",
      });
    }

    const inviterName = currentUser ? `${currentUser.fname} ${currentUser.lname}`.trim() : "A team member";

    const newMembers = [];
    const targetEmails = [];

    for (const email of emails) {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail) continue;

      if (!targetEmails.includes(cleanEmail)) {
        targetEmails.push(cleanEmail);
      }

      const isExisting = board.members.some((m) => m.email?.toLowerCase() === cleanEmail);
      if (!isExisting) {
        const user = await User.findOne({ email: cleanEmail });
        newMembers.push({
          userId: user ? user._id : null,
          email: cleanEmail,
          role: role || "editor",
          invitedAt: new Date(),
        });
      } else {
        await Board.updateOne(
          { _id: id, "members.email": cleanEmail },
          { $set: { "members.$.role": role || "editor" } }
        );
      }
    }

    if (newMembers.length > 0) {
      await Board.updateOne(
        { _id: id },
        { $push: { members: { $each: newMembers } } }
      );
    }

    const emailResults = [];
    const failedEmails = [];

    for (const email of targetEmails) {
      const result = await sendBoardInviteEmail({
        toEmail: email,
        inviterName,
        boardTitle: board.title,
        boardId: id,
        role: role || "editor",
      });
      emailResults.push(result);
      if (!result.success) {
        failedEmails.push({ email, error: result.error });
      }
    }

    const updatedBoard = await Board.findById(id);

    if (failedEmails.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Failed to send email to ${failedEmails.map(f => f.email).join(", ")}: ${failedEmails[0].error}. Please check EMAIL_USER & EMAIL_PASSWORD in backend/.env`,
        failedEmails,
        data: {
          ...updatedBoard.toObject(),
          userRole: callerRole,
        },
      });
    }

    res.json({
      success: true,
      message: `Invitation email sent successfully to ${targetEmails.join(", ")}!`,
      emailResults,
      data: {
        ...updatedBoard.toObject(),
        userRole: callerRole,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ Toggle Star Board
exports.toggleStar = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await Board.findOne({ _id: id, userId: req.user.id });
    if (!board) {
      return res.status(404).json({ success: false, message: "Board not found or access denied" });
    }

    const newStarredStatus = !board.starred;
    await Board.updateOne({ _id: id }, { $set: { starred: newStarredStatus } });

    res.json({
      success: true,
      data: { ...board.toObject(), starred: newStarredStatus },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get Starred Boards
exports.getStarredBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      userId: req.user.id,
      starred: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: boards,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};