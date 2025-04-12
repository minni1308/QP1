const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdf = require("pdf-parse");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

// Make fetch and Headers available globally
global.fetch = fetch;
global.Headers = fetch.Headers;

// Enable CORS
router.use(cors());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

// Configure Gemini AI with error checking
let genAI;
try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }
  console.log("API Key length:", process.env.GEMINI_API_KEY.length);
  console.log(
    "First few characters of API Key:",
    process.env.GEMINI_API_KEY.substring(0, 8) + "..."
  );

  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (error) {
  console.error("Error initializing Gemini AI:", error);
  throw error;
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = [".pdf", ".txt"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF and TXT files are supported."));
    }
  },
});

// Helper function to extract text from PDF
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

// ----------------------------
// Helper function to generate questions using Gemini
// ----------------------------
async function generateQuestionsWithGemini(content, numQuestions, difficulty) {
  console.log("Generating questions with content length:", content.length);

  try {
    // Use the correct model identifier (example: gemini-2.0-flash)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prepare the prompt
    const prompt = `Generate ${numQuestions} descriptive questions based on the following content.
Make the questions easy,medium,hard difficulty level.
Format your response as a JSON object with three arrays: easy, medium, and hard, where each array contains descriptive questions.

Content to generate questions from:
${content}

Remember to:
- Make questions clear and thought-provoking
- Make them appropriate for each difficulty level
- Test understanding and analytical skills
- Avoid yes/no questions

The response MUST be in this exact format:
{
  "easy": [
    "",
    ""
  ],
  "medium": [
    "",
    ""
  ],
  "hard": [
    "",
    ""
  ]
}`;

    console.log("Sending request to Gemini API...");
    const result = await model.generateContent(prompt);
    console.log("Received response from Gemini API");
    const response = result.response;
    const text = response.text();
    
    console.log("Raw Gemini response:", text);

    // Clean the response text
    const cleanedText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    try {
      const parsedQuestions = JSON.parse(cleanedText);

      // Validate the response format
      if (!parsedQuestions || typeof parsedQuestions !== 'object') {
        throw new Error("Response is not a valid JSON object");
      }

      // Validate that we have all difficulty levels
      const requiredLevels = ['easy', 'medium', 'hard'];
      for (const level of requiredLevels) {
        if (!parsedQuestions[level] || !Array.isArray(parsedQuestions[level])) {
          throw new Error(`Missing or invalid '${level}' questions array`);
        }
      }

      // Validate that each array has questions
      for (const level of requiredLevels) {
        if (parsedQuestions[level].length === 0) {
          throw new Error(`No questions generated for '${level}' level`);
        }
        
        // Validate that each question is a non-empty string
        parsedQuestions[level].forEach((question, index) => {
          if (typeof question !== 'string' || question.trim().length === 0) {
            throw new Error(`Invalid question at index ${index} in '${level}' array`);
          }
        });
      }

      return parsedQuestions;
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      throw new Error(`Failed to parse generated questions: ${parseError.message}`);
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    if (error.message.includes('API_KEY_INVALID')) {
      throw new Error('Invalid API key. Please check your GEMINI_API_KEY environment variable.');
    }
    throw new Error('Error generating questions with Gemini: ' + error.message);
  }
}

// Main route handler
router.post("/", upload.single("file"), async (req, res) => {
  console.log("Received question generation request");
  try {
    const { subject, difficulty, numberOfQuestions, content } = req.body;
    let textContent = content;

    // If a file was uploaded, extract its text
    if (req.file) {
      console.log("Processing uploaded file:", req.file.originalname);
      const filePath = req.file.path;

      try {
        if (path.extname(req.file.originalname).toLowerCase() === ".pdf") {
          textContent = await extractTextFromPDF(filePath);
        } else {
          textContent = await fs.readFile(filePath, "utf8");
        }
        console.log(
          "Successfully extracted text from file, content length:",
          textContent.length
        );
      } catch (error) {
        console.error("File processing error:", error);
        return res.status(400).json({
          success: false,
          message: "Error processing file: " + error.message,
        });
      } finally {
        // Clean up: delete the uploaded file
        try {
          await fs.unlink(filePath);
          console.log("Cleaned up uploaded file:", filePath);
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      }
    }

    if (!textContent) {
      return res.status(400).json({
        success: false,
        message: "No content provided for question generation",
      });
    }

    // Validate input parameters
    if (!subject || !difficulty || !numberOfQuestions) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required parameters: subject, difficulty, or numberOfQuestions",
      });
    }

    // Generate questions using Gemini
    console.log("Calling Gemini API...");
    const questions = await generateQuestionsWithGemini(
      textContent,
      parseInt(numberOfQuestions),
      difficulty
    );
    console.log("Questions generated successfully");

    res.json({
      success: true,
      questions: questions,
    });
  } catch (error) {
    console.error("Error in question generation:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error generating questions",
      error: error.message,
    });
  }
});

module.exports = router;
