// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai'); 

const app = express();
const PORT = 5000;

// --- 1. API Initialization (Secure) ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error("FATAL: GEMINI_API_KEY is not set in the server's .env file.");
}
const ai = new GoogleGenAI({ apiKey:AIzaSyC1NbSr_sT5esoROUJPV4nC5XqeIGid_co  });
const model = 'gemini-2.5-flash';

// Middleware
// Allow your Vite app (e.g., on port 5173) to communicate with this server (port 5000)
app.use(cors({
    origin: 'http://localhost:5173' // IMPORTANT: Check your Vite dev port and change if necessary
}));
app.use(express.json());

// Utility to convert frontend format to Gemini SDK format
const formatMessagesForGemini = (allMessages) => {
    let history = [];
    let systemInstruction = "You are Mind Mend, a compassionate mental wellness assistant.";
    let userPrompt = "";

    for (let i = 0; i < allMessages.length; i++) {
        const m = allMessages[i];
        if (m.role === 'system') {
            systemInstruction = m.content;
        } else if (i === allMessages.length - 1 && m.role === 'user') {
            userPrompt = m.content; // Last message is the current prompt
        } else {
            history.push({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            });
        }
    }
    return { history, systemInstruction, userPrompt };
};

// --- 2. Chat Endpoint ---
app.post('/chat', async (req, res) => {
    try {
        const { messages: allMessages } = req.body;
        
        const { history, systemInstruction, userPrompt } = formatMessagesForGemini(allMessages);

        // Create the chat session with history and system instruction
        const chat = ai.chats.create({
            model: model,
            config: { systemInstruction: systemInstruction },
            history: history, 
        });

        const response = await chat.sendMessage({ message: userPrompt });

        res.json({
            message: {
                role: "assistant", 
                content: response.text
            }
        });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ 
            error: "Failed to communicate with the AI model.",
            details: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});