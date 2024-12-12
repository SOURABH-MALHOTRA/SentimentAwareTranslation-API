const express = require("express");
const router = express.Router();
const {
  Translation,
  DetectSentiment,
  translateWithSentiment,
  AllTranslationLogs,
} = require("../Controller/controller.js");
router.post("/translate", Translation);
router.post("/detect-sentiment", DetectSentiment);
router.post("/translate-with-sentiment", translateWithSentiment);
router.get("/logs", AllTranslationLogs);
module.exports = router;
