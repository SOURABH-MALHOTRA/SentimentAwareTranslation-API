const mongoose = require("mongoose");
const translationLogSchema = new mongoose.Schema(
  {
    originalText: { type: String, required: true },
    translatedText: { type: String, required: true },
    sourceLanguage: { type: String, required: true },
    targetLanguage: { type: String },
  },
  { timestamp: true }
);

const userPreferenceSchema = new mongoose.Schema({
  preferredLanguages: { type: String },
  toneSettings: { type: String },
});

const TranslationLog = mongoose.model("TranslationLog", translationLogSchema);
const UserPreference = mongoose.model("UserPreference", userPreferenceSchema);
module.exports = { TranslationLog, UserPreference };
