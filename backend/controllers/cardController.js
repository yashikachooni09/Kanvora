const Card = require("../models/Card");

// ✅ Create Card
exports.createCard = async (req, res) => {
  try {
    const { title, listId } = req.body;

    const card = await Card.create({
      title,
      listId
    });

    res.json({
      success: true,
      data: card
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ✅ Get Cards by List
exports.getCards = async (req, res) => {
  try {
    const { listId } = req.query;

    const cards = await Card.find({ listId });

    res.json({
      success: true,
      data: cards
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};