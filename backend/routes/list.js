const express = require("express");
const router = express.Router();

const {
  createList,
  getLists,
  deleteList,
} = require("../controllers/listController");

const auth = require("../middlewares/auth");

// ✅ Create List
router.post("/", auth, createList);

// ✅ Get Lists (by boardId)
router.get("/", auth, getLists);

// ✅ Delete List
router.delete("/:id", auth, deleteList);

module.exports = router;