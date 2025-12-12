// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve ALL files from the SAME folder server.js is in
app.use(express.static(__dirname));

// Always return index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, model } = req.body;

    const completion = await client.chat.completions.create({
      model: model || "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are MiniGPT, created by ChatGPT and SasoPlayzYT."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`MiniGPT server running on port ${PORT}`)
);
