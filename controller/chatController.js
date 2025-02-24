import { ConversationChain } from "langchain/chains";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BufferMemory } from "langchain/memory";
import chatRepo from "../repository/chatRepo.js";

// Initialize AI model
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-pro",
});

// Prompt for moderation to classify questions related to Technical Field, Web Development, AI & ML, or Hii,Hello
const moderationPrompt = "Classify the following question as 'allowed' or 'not allowed' based on whether it is related to Hii,Hello,Technical Field, Web Development, AI & ML:\n\nQuestion: ";

// Memory for conversation context
const memory = new BufferMemory();
const chain = new ConversationChain({ llm: model, memory });

const chatBot = async (req, res, next) => {

  const { message } = req.body;
  let userId = 1; // Default user ID for testing
  try {
    // check the user asking for "Hii" or "Hello" or "Technical Field" or "Web Development" or "AI & ML" related data or not
    const moderationResponse = await model.invoke(moderationPrompt + message);
    // console.log(moderationResponse.content.trim().toLowerCase().split(" ")[0]);
    
    const moderationResult = moderationResponse.content.trim().toLowerCase().split(" ")[0];

    if (moderationResult !== "allowed") {
      return res.json({ response: "Sorry, I can only answer questions related to Technical Field." });
    }
    const response = await chain.call({ input: message });

    // Get current timestamp
    const timestamp = new Date().toISOString(); // ISO format: YYYY-MM-DDTHH:mm:ss.sssZ
    // Save conversation to DB
    // await chatRepo.saveChat(userId, message, response.response);

    res.json({ response: response.response, timestamp });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export default { chatBot };
// import { ConversationChain } from "langchain/chains";
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { BufferMemory, ChatMessageHistory } from "langchain/memory";
// import chatRepo from "../repository/chatRepo.js";

// // Initialize AI model
// const model = new ChatGoogleGenerativeAI({
//   apiKey: process.env.GEMINI_API_KEY,
//   model: "gemini-pro",
// });

// const chatBot = async (req, res, next) => {
//   const { message } = req.body;
//   let userId = 1; // Default user ID for testing

//   try {
//     // Fetch previous chat history from DB
//     let pastChatHistory = await chatRepo.getUserChatHistory(userId);
//     if (!pastChatHistory) pastChatHistory = [];

//     // Initialize chat history memory
//     const chatHistoryMemory = new ChatMessageHistory();

//     // Convert pastChatHistory (which is a single string) into structured messages
//     pastChatHistory.split("\n").forEach((chat) => {
//       const [sender, text] = chat.split(": ");
//       if (sender === "User") {
//         chatHistoryMemory.addUserMessage(text);
//       } else if (sender === "Bot") {
//         chatHistoryMemory.addAIMessage(text);
//       }
//     });

//     // Create memory with chat history
//     const memory = new BufferMemory({ chatHistory: chatHistoryMemory });

//     // Create Chat Chain with stored memory
//     const chain = new ConversationChain({ llm: model, memory });

//     // Get AI response
//     const response = await chain.call({ input: message });

//     // Get current timestamp
//     const timestamp = new Date().toISOString();

//     // Save conversation to DB
//     await chatRepo.saveChat(userId, message, response.response);

//     res.json({ response: response.response, timestamp });
//   } catch (error) {
//     next(error);
//   }
// };

// export default { chatBot };
