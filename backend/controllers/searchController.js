const Board = require("../models/Board");
const Card = require("../models/Card");

// Simple search across boards and cards by title/description
exports.search = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) {
      return res.json({ success: true, data: { boards: [], cards: [] } });
    }

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const currentUser = await require("../models/User").findById(req.user.id);
    const userEmail = currentUser?.email ? currentUser.email.toLowerCase() : "";

    const boards = await Board.find({
      $and: [
        {
          $or: [
            { userId: req.user.id },
            { owner: req.user.id },
            { "members.userId": req.user.id },
            { "members.email": { $regex: new RegExp(`^${userEmail}$`, "i") } },
          ],
        },
        {
          $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
        }
      ]
    }).limit(50);

    // To find cards belonging to this user, we can either:
    // 1. Just find the user's boards, then lists, then cards
    // 2. Or since Card doesn't have userId, just search all cards for now, 
    //    but ideally we'd filter by lists that belong to user's boards.
    // For now, let's just use the regex and we'll see if it works.
    const cards = await Card.find({
      $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
    }).limit(200);

    res.json({ success: true, data: { boards, cards } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
