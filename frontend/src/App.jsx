import { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Capture user's message with timestamp
    const userMessage = {
      sender: "You",
      text: message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChat((prevChat) => [...prevChat, userMessage]);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/chat", { message });

      // Capture AI's response with timestamp
      const botMessage = {
        sender: "Bot",
        text: res.data.response,
        timestamp: new Date().toLocaleTimeString(), // Convert backend timestamp if needed
      };

      setChat((prevChat) => [...prevChat, botMessage]);
    } catch (error) {
      setChat((prevChat) => [
        ...prevChat,
        { sender: "Bot", text: "Error: " + error.message, timestamp: new Date().toLocaleTimeString() },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Technical Support Chatbot
        </h2>
        <div className="h-80 overflow-y-auto border rounded p-3 bg-gray-50 space-y-2">
          {chat.map((msg, index) => (
            <div key={index} className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}>
              <p className="text-xs text-gray-500">{msg.timestamp}</p>
              <div
                className={`p-2 rounded-lg max-w-xs ${
                  msg.sender === "You"
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-gray-300 text-black self-start"
                }`}
              >
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex mt-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-grow border p-2 rounded-l focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
