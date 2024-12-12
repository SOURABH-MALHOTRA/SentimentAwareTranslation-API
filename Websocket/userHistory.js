const express = require("express");
const { TranslationLog } = require("../Model/model.js");

const router = express.Router();

// Pagination endpoint for translation history
router.get("/translation-history", async (req, res) => {
  const userId = req.user?.userId; // Assuming user info is in req.user after authentication
  const { page = 1, limit = 10 } = req.query;

  try {
    // Retrieve user-specific translation logs
    const logs = await TranslationLog.find({ userId })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec();

    const totalLogs = await TranslationLog.countDocuments({ userId });

    res.json({
      data: logs,
      total: totalLogs,
      page: Number(page),
      pages: Math.ceil(totalLogs / limit),
    });
  } catch (error) {
    console.error("Error fetching translation history:", error);
    res.status(500).json({ error: "Unable to fetch translation history" });
  }
});

module.exports = router;
