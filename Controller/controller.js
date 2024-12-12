const { TranslationLog, UserPreference } = require("../Model/model.js");
const Sentiment = require("sentiment");

// Mock translation function (you can replace it with a real API later)
const mockTranslate = (text, sourceLang, targetLang) => {
  return `${text} (translated from ${sourceLang} to ${targetLang})`;
};

// Helper function to validate language codes 
const isValidLanguage = (language) => {
  const validLanguages = ["en", "es", "fr", "de", "it", "pt", "zh", "zh-TW", "ja", "ko", "ru", "ar", "hi", "bn", "ur",
    "nl", "el", "tr", "sv", "no", "fi", "da", "pl", "cs", "hu",
    "ro", "th", "vi", "id", "tl", "he", "sw", "ta", "te", "ml",
    "mr", "pa", "gu", "kn", "ms", "uk", "sr", "hr", "bg", "sk",
    "lt", "lv", "et", "is", "sl", "sq", "mk"]; // Add supported languages here
  return validLanguages.includes(language);
};

// Translation API endpoint with input validation and error handling
async function Translation(req, res) {
  const { originalText, sourceLanguage, targetLanguage } = req.body;  
  if (!originalText || !sourceLanguage || !targetLanguage) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  // Check if 'text' is a valid string
  if (!originalText || typeof originalText !== 'string') {
    return res.status(400).json({ error: "Invalid input format: 'text' must be a string" });
  }

  // Check if 'sourceLanguage' and 'targetLanguage' are valid
  if (!isValidLanguage(sourceLanguage)) {
    return res.status(400).json({ error: "Invalid source language" });
  }

  if (!isValidLanguage(targetLanguage)) {
    return res.status(400).json({ error: "Invalid target language" });
  }

  try {
    // Simulate translation
    const translatedText = await mockTranslate(originalText, sourceLanguage, targetLanguage);

    // Create a new translation log to save in MongoDB
    const newLog = new TranslationLog({
      originalText: originalText, 
      translatedText,
      sourceLanguage,
      targetLanguage,
    });

    await newLog.save(); 

    res.status(201).json({ message: "Translation saved successfully", data: newLog });
  } catch (error) {
    console.error('Error in Translation:', error);
    res.status(500).json({ error: "Error saving translation log", details: error.message });
  }
}

// Sentiment analysis endpoint with validation and error handling
async function DetectSentiment(req, res) {
  const { originalText } = req.body;  
  if (!originalText) {
    return res
      .status(400)
      .json({ error: "Text is required for sentiment detection" });
  }
  // Check if 'text' is provided and is a string
  if (!originalText || typeof originalText !== 'string') {
    return res.status(400).json({ error: "Invalid input format: 'text' must be a string" });
  }

  try {
    const sentiment = new Sentiment();
    const result = sentiment.analyze(originalText); 

    let sentimentCategory = "neutral";
    if (result.score > 0) sentimentCategory = "positive";
    else if (result.score < 0) sentimentCategory = "negative";

    res.json({
      originalText,  
      sentimentScore: result.score,
      sentimentCategory,
    });
  } catch (error) {
    console.error('Error in Sentiment Analysis:', error);
    res.status(500).json({ error: "Error analyzing sentiment", details: error.message });
  }
}

// Translation with sentiment and tone modification (mock)
async function translateWithSentiment(req, res) {
  const { originalText, sourceLanguage, targetLanguage } = req.body;  
  if (!originalText || !sourceLanguage || !targetLanguage) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  // Validate input fields
  if (!originalText || typeof text !== 'string') {
    return res.status(400).json({ error: "Invalid input format: 'text' must be a string" });
  }

  if (!isValidLanguage(sourceLanguage)) {
    return res.status(400).json({ error: "Invalid source language" });
  }

  if (!isValidLanguage(targetLanguage)) {
    return res.status(400).json({ error: "Invalid target language" });
  }

  try {
    // Step 1: Perform sentiment analysis on the text
    const sentiment = new Sentiment();
    const sentimentResult = sentiment.analyze(originalText);
    const detectedSentiment = sentimentResult.score >= 0 ? "positive" : "negative"; 

    // Step 2: Simulate translation
    let translatedText = mockTranslate(originalText, sourceLanguage, targetLanguage);

    // Step 3: Modify the tone of the translation based on sentiment (using placeholder logic)
    if (detectedSentiment === "positive") {
      translatedText += " (Translation adapted to informal tone: 'Hey, it's a casual translation!')";
    } else if (detectedSentiment === "negative") {
      translatedText += " (Translation adapted to formal tone: 'Please note the content is formal and polite.')";
    }

    // Step 4: Save user preferences (tone settings) based on sentiment
    const userPreference = new UserPreference({
      preferredLanguages: targetLanguage,
      toneSettings: detectedSentiment === "positive" ? "informal" : "formal",
    });
    await userPreference.save();

    // Step 5: Return the translated text along with sentiment and tone
    res.json({
      OriginalText: originalText,  
      TranslatedTextTone: translatedText,
      sourceLanguage,
      targetLanguage,
      sentiment: detectedSentiment,
      tone: detectedSentiment === "positive" ? "informal" : "formal", 
    });
  } catch (error) {
    console.error('Error in Translation with Sentiment:', error);
    res.status(500).json({ error: "Error translating text", details: error.message });
  }
}

// Fetch all translation logs with error handling
async function AllTranslationLogs(req, res) {
  try {
    const logs = await TranslationLog.find(); 
    res.json({ data: logs });
  } catch (error) {
    console.error('Error fetching translation logs:', error);
    res.status(500).json({ error: 'Error fetching translation logs', details: error.message });
  }
};

module.exports = { Translation, DetectSentiment, translateWithSentiment, AllTranslationLogs };
