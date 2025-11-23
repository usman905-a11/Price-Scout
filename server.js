const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 7860;

// --- Middleware ---
app.use(express.json()); // Parse JSON bodies from frontend requests

// --- API Key Configuration ---
// The key is securely passed from Hugging Face secrets as an environment variable
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- API Endpoint for the AI Agent ---
// Your React app will call this endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ response: text });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    res.status(500).json({ error: 'Failed to generate content from AI.' });
  }
});

// --- Serve the Frontend ---
// Serve the static files from the React app's build directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handles any requests that don't match the API endpoint by sending back the main index.html file.
// This is important for client-side routing in React.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});