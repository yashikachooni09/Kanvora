const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const {
  createCard,
  getCards,
  moveCard,
  updateCard,
  deleteCard,
  toggleComplete,
  toggleArchive,
  uploadAttachment,
  addLabel,
  removeLabel,
} = require("../controllers/cardController");



// ✅ Create Card
router.post("/", auth, createCard);

// ✅ Get Cards by List
router.get("/", auth, getCards);

// ✅ Move Card
router.put("/:id/move", auth, moveCard);

// ✅ Update Card
router.put("/:id", auth, updateCard);

// ✅ Delete Card
router.delete("/:id", auth, deleteCard);



// ✅ Toggle Complete
router.put("/:id/complete", auth, toggleComplete);

// ✅ Toggle Archive
router.put("/:id/archive", auth, toggleArchive);

// ✅ Upload Attachment
router.post("/:id/attachment", auth, upload.single("file"), uploadAttachment);

// ✅ Add Label
router.post("/:id/label", auth, addLabel);

// ✅ Remove Label
router.delete("/:id/label", auth, removeLabel);

module.exports = router;
