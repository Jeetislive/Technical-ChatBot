import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import { ConversationChain } from "langchain/chains";
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { BufferMemory } from "langchain/memory";
import indexRoute from "./routes/indexRoute.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize AI model
// const model = new ChatGoogleGenerativeAI({
//     apiKey: process.env.GEMINI_API_KEY,
//     model: "gemini-pro",
//   });

// Memory for conversation context
// const memory = new BufferMemory();
// const chain = new ConversationChain({ llm: model, memory });

// Routes
app.use("/", indexRoute);

// app.post("/chat", async (req, res) => {
//     const { message } = req.body;
//     try {
//       const response = await chain.call({ input: message });
  
//       // Get current timestamp
//       const timestamp = new Date().toISOString(); // ISO format: YYYY-MM-DDTHH:mm:ss.sssZ
  
//       res.json({ response: response.response, timestamp });
//     } catch (error) {
//       console.error("Chatbot Error:", error);
//       res.status(500).json({ error: error.message });
//     }
//   });
  
// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
