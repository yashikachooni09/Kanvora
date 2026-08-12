const express = require("express");
const router = express.Router();

const {
  createBoard,
  getBoards,
  getSingleBoard,
  updateBoard,
  deleteBoard,
  inviteBoard,
  toggleStar,
  getStarredBoards,
} = require("../controllers/boardController");

const {
  getBoardLabels,
  createLabel,
  updateLabel,
  deleteLabel,
} = require("../controllers/labelController");

const auth = require("../middlewares/auth");

// ✅ Create Board
router.post("/", auth, createBoard);

// ✅ Get All Boards
router.get("/", auth, getBoards);

// ✅ Get Starred Boards
router.get("/starred", auth, getStarredBoards);

// ✅ Get Single Board
router.get("/:id", auth, getSingleBoard);

// ✅ Toggle Star Board
router.put("/:id/star", auth, toggleStar);

// ✅ Update Board
router.put("/:id", auth, updateBoard);

// ✅ Delete Board
router.delete("/:id", auth, deleteBoard);

// ✅ Invite User to Board
router.post("/:id/invite", auth, inviteBoard);

// ✅ Board Labels
router.get("/:id/labels", auth, getBoardLabels);
router.post("/:id/labels", auth, createLabel);
router.put("/:id/labels/:labelId", auth, updateLabel);
router.delete("/:id/labels/:labelId", auth, deleteLabel);

module.exports = router;
