const express = require("express");
const router = express.Router();

const { createCard, getCards,moveCard } = require("../controllers/cardController");
const auth = require("../middlewares/auth");

router.post("/", auth, createCard);
router.get("/", auth, getCards);
router.patch("/move/:id", moveCard);

module.exports = router;