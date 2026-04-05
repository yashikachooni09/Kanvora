const express = require("express");
const router = express.Router();

const {
  createBoard,
  getBoards,
  deleteBoard
} = require("../controllers/boardController");

const auth = require("../middlewares/auth");


router.post("/", auth, createBoard);

router.get("/", auth, getBoards);

router.delete("/:id", auth, deleteBoard);

module.exports = router;