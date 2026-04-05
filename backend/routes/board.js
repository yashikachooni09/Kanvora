const express = require("express");
const router = express.Router();

const {
  createBoard,
  getBoards,
  getSingleBoard,
  deleteBoard
} = require("../controllers/boardController");

const auth = require("../middlewares/auth");

// ✅ Create Board
router.post("/", auth, createBoard);

// ✅ Get All Boards
router.get("/", auth, getBoards);

// ✅ Get Single Board
router.get("/:id", auth, getSingleBoard);

// ✅ Delete Board
router.delete("/:id", auth, deleteBoard);

module.exports = router;