const express = require("express");
const generateQuestionsRouter = express.Router();
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const { Configuration, OpenAIApi } = require("openai");
const pdf = require("pdf-parse");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    if (!fs.promises.access(uploadDir).then(() => true).catch(() => false)) {
      fs.promises.mkdir(uploadDir, { recursive: true });
    }
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
    const allowedTypes = [".doc", ".docx", ".html", ".pdf", ".txt"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Helper function to extract text from different file types
async function extractTextFromFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  const filePath = file.path;

  try {
    switch (ext) {
      case ".doc":
      case ".docx":
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;

      case ".pdf":
        const dataBuffer = await fs.readFile(filePath);
        const pdfData = await pdf(dataBuffer);
        return pdfData.text;

      case ".txt":
      case ".html":
        return fs.readFile(filePath, "utf8");

      default:
        throw new Error("Unsupported file type");
    }
  } finally {
    // Clean up: delete the uploaded file
    await fs.unlink(filePath);
  }
}

// Helper function to generate questions using OpenAI
async function generateQuestionsWithOpenAI(content, numQuestions, difficulty) {
  const prompt = `Generate ${numQuestions} multiple-choice questions with 4 options each based on the following content. 
    Make the questions ${difficulty} difficulty level. 
    For each question, provide the correct answer.
    Format the response as a JSON array of objects, where each object has:
    - text: the question text
    - options: array of 4 possible answers
    - answer: the correct answer (one of the options)
    Content: ${content}`;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 2000,
    temperature: 0.7,
  });

  try {
    return JSON.parse(response.data.choices[0].text.trim());
  } catch (error) {
    throw new Error('Error parsing OpenAI response');
  }
}

// Route to handle question generation
router.post("/generate", upload.single("file"), async (req, res) => {
  try {
    const { subject, difficulty, numberOfQuestions, content } = req.body;
    let textContent = content;

    // If a file was uploaded, extract its text
    if (req.file) {
      if (req.file.mimetype === "application/pdf") {
        textContent = await extractTextFromFile(req.file);
      } else {
        // For text files
        textContent = req.file.buffer.toString("utf-8");
      }
    }

    if (!textContent) {
      return res.status(400).json({
        success: false,
        message: "No content provided for question generation"
      });
    }

    // Generate questions using OpenAI
    const questions = await generateQuestionsWithOpenAI(
      textContent,
      parseInt(numberOfQuestions),
      difficulty
    );

    res.json({
      success: true,
      questions: questions
    });

  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({
      success: false,
      message: "Error generating questions",
      error: error.message
    });
  }
});

module.exports = generateQuestionsRouter;