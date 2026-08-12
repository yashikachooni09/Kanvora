const Workspace = require("../models/Workspace");
const Board = require("../models/Board");

// ✅ CREATE WORKSPACE
exports.createWorkspace = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Workspace name is required",
      });
    }

    const workspace = await Workspace.create({
      name,
      description,
      icon,
      userId: req.user.id,
    });

    res.json({
      success: true,
      message: "Workspace created successfully",
      data: workspace,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ GET ALL WORKSPACES
exports.getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    // Get board count for each workspace
    const workspacesWithCounts = await Promise.all(
      workspaces.map(async (ws) => {
        const boardCount = await Board.countDocuments({
          workspaceId: ws._id,
        });
        return {
          ...ws.toObject(),
          boardCount,
        };
      }),
    );

    res.json({
      success: true,
      data: workspacesWithCounts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ GET SINGLE WORKSPACE
exports.getSingleWorkspace = async (req, res) => {
  try {
    const { id } = req.params;

    const workspace = await Workspace.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // Get all boards in this workspace
    const boards = await Board.find({
      workspaceId: id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        ...workspace.toObject(),
        boards,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ UPDATE WORKSPACE
exports.updateWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const workspace = await Workspace.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updates,
      { new: true },
    );

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    res.json({
      success: true,
      message: "Workspace updated successfully",
      data: workspace,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ DELETE WORKSPACE
exports.deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params;

    const workspace = await Workspace.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // Delete all boards in this workspace
    await Board.deleteMany({ workspaceId: id });

    res.json({
      success: true,
      message: "Workspace deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
