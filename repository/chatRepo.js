import db from "../db/db.js";
import AppError from "../error/AppError.js";

const saveChat = async (userId, userMessage, botMessage) => {
    // Save chat data to your preferred database or storage system
    const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const [result] = await conn.execute(
            "INSERT INTO chat_history (user_id, message, sender) VALUES (?, ?, 'user')",
            [userId, userMessage]
            );
            const [result2] = await conn.execute(
            "INSERT INTO chat_history (user_id, message, sender) VALUES (?, ?, 'bot')",
            [userId, botMessage]
            );
            await conn.commit();
            console.log("Conversation added successfully!");
        }catch (error) {
            await conn.rollback();
            console.error("Error adding conversation:", error);
            throw new AppError("Error adding conversation:", error);
        }
        finally {
            conn.release();
        }
}
// Function to fetch past chat history and return as a formatted string
const getUserChatHistory = async (userId) => {
    const conn = await db.getConnection();
    try {
      const [rows] = await conn.execute(
        "SELECT message, sender FROM chat_history WHERE user_id = ? ORDER BY timestamp ASC",
        [userId]
      );
  
      // Convert to chat history format
      return rows.map((row) => `${row.sender}: ${row.message}`).join("\n");
    } catch (error) {
      console.error("Error fetching chat history:", error);
      throw new AppError("Error fetching chat history:", error);
    }
    finally {
        conn.release();
    }
}

export default { saveChat,getUserChatHistory };