const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  createWorkspace,
  getWorkspaces,
  getSingleWorkspace,
  updateWorkspace,
  deleteWorkspace,
} = require("../controllers/workspaceController");

// ✅ Create Workspace
router.post("/", auth, createWorkspace);

// ✅ Get All Workspaces
router.get("/", auth, getWorkspaces);

// ✅ Get Single Workspace
router.get("/:id", auth, getSingleWorkspace);

// ✅ Update Workspace
router.put("/:id", auth, updateWorkspace);

// ✅ Delete Workspace
router.delete("/:id", auth, deleteWorkspace);

module.exports = router;
