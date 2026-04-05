const express = require("express");
const router = express.Router();

const { createCard, getCards } = require("../controllers/cardController");
const auth = require("../middlewares/auth");

router.post("/", auth, createCard);
router.get("/", auth, getCards);

module.exports = router;