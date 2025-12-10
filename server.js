import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from public/
app.use(express.static(path.join(process.cwd(), "public")));

// Root route serves index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const { message, model } = req.body;
    const completion = await client.chat.completions.create({
      model: model || "gpt-4.1-mini",
      messages: [{ role: "user", content: message }],
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
