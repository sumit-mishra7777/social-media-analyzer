// NEW CODE FOR backend/index.js

// 1. Import all necessary libraries
require('dotenv').config(); // To read the .env file
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse');
const Tesseract = require('tesseract.js');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // The new Google AI library

// 2. Initialize everything
const app = express();
const port = 5000;

// Initialize the Google AI Client with our API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. Middlewares
app.use(cors());
app.use(express.json());

// 4. Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 5. NEW FUNCTION: This function calls the AI to get suggestions
async function getAiSuggestions(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const prompt = `Analyze the following social media post text. Provide 3-4 actionable suggestions to improve its engagement. Format the suggestions as a simple bulleted list. Text: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestions = response.text();
    return suggestions;
  } catch (error) {
    console.error("Error with AI suggestion:", error);
    return "Could not generate AI suggestions at this time.";
  }
}

// 6. MAIN API ENDPOINT (Now with AI call)
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file was uploaded.' });
    }

    let extractedText = '';
    const fileBuffer = req.file.buffer;

    // STEP 1: Extract text using Tesseract or PDF-Parse
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdf(fileBuffer);
      extractedText = data.text;
    } else if (req.file.mimetype.startsWith('image/')) {
      const result = await Tesseract.recognize(fileBuffer, 'eng');
      extractedText = result.data.text;
    } else {
      return res.status(400).json({ error: 'Unsupported file type.' });
    }
    
    // If no text is found, stop here
    if (!extractedText.trim()) {
        return res.json({ text: "No text could be extracted from the file.", suggestions: "No analysis available." });
    }

    // STEP 2: Get AI suggestions for the extracted text
    console.log("Getting AI suggestions...");
    const suggestions = await getAiSuggestions(extractedText);
    console.log("Suggestions received!");

    // STEP 3: Send both text and suggestions to the frontend
    res.json({ text: extractedText, suggestions: suggestions });

  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Server error during file processing.' });
  }
});

// 7. Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});